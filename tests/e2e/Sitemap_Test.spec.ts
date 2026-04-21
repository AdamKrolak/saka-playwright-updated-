import { test, expect } from "../fixtures/fixtures";
import xml2js from "xml2js";

test.describe("Sitemap Validation", () => {
  test("Validate that sitemap contains links for cars, articles and static", async ({
    request,
  }) => {
    const response = await request.get("https://saka.fi/sitemap.xml");
    expect(response.status()).toBe(200);

    const body = await response.text();
    const parsed = await xml2js.parseStringPromise(body);
    const links: string[] = (parsed.sitemapindex?.sitemap ?? []).map(
      (s: any) => s.loc?.[0] ?? "",
    );

    const carsMap = links.filter((l) =>
      l.startsWith("https://saka.fi/sitemaps/cars/sitemap/"),
    );
    expect(carsMap.length).toBeGreaterThanOrEqual(4);

    const articleMap = links.filter((l) =>
      l.startsWith("https://saka.fi/sitemaps/articles/sitemap/"),
    );
    expect(articleMap.length).toBeGreaterThanOrEqual(1);

    const staticMap = links.filter((l) =>
      l.startsWith("https://saka.fi/sitemaps/pages/sitemap/"),
    );
    expect(staticMap.length).toBeGreaterThanOrEqual(1);
  });

  test("Validate that sitemap contains links for all cars", async ({
    request,
  }) => {
    const response = await request.get(
      "https://saka.fi/sitemaps/cars/sitemap/en-3.xml",
    );
    expect(response.status()).toBe(200);

    const body = await response.text();
    const parsed = await xml2js.parseStringPromise(body);
    const links: string[] = (parsed.urlset?.url ?? []).map(
      (u: any) => u.loc?.[0] ?? "",
    );

    const carsMap = links.filter((l) =>
      l.startsWith("https://saka.fi/en/car/"),
    );
    expect(
      carsMap.length,
      `Sitemap should contain 500 links starting with https://saka.fi/en/car/`,
    ).toBeGreaterThanOrEqual(500);
  });
});

test.describe("Meta tags validation", () => {
  test("Verify that meta tags contain all needed data", async ({
    page,
    homePage,
    siteMap,
  }) => {
    page.on("pageerror", (err) => {
      if (
        err.message.includes("fbq is not defined") ||
        err.message.includes("Cannot read properties of undefined")
      ) {
        // Suppress known errors
      }
    });
    await page.goto("https://saka.fi/en");
    await homePage.acceptAllCookies();
    await page.goto("https://saka.fi/en");

    await expect(page).toHaveTitle(/Trusted Car Dealership | 3500\+ Used Cars/);

    await expect(siteMap.description()).toHaveAttribute(
      "content",
      expect.stringContaining("Find the perfect used car from Saka"),
    );
    await expect(siteMap.robots()).toHaveAttribute("content", "index, follow");
    await expect(siteMap.canonical()).toHaveAttribute(
      "href",
      "https://saka.fi/en",
    );
  });
});

test.describe("Check pageInfo event in dataLayer", () => {
  test("Validate that dataLayer contains all needed data for GA", async ({
    page,
    homePage,
    categoryPage,
  }) => {
    page.on("pageerror", (err) => {
      if (
        err.message.includes("fbq is not defined") ||
        err.message.includes("Cannot read properties of undefined")
      ) {
        // Suppress known errors
      }
    });
    await page.goto("https://saka.fi/en");
    await homePage.acceptAllCookies();
    await page.goto("https://saka.fi/en/used-cars");
    await categoryPage.car1().click({ force: true });
    await page.waitForTimeout(2000);

    const dataLayer: any[] = await page.evaluate(
      () => (window as any).dataLayer ?? [],
    );
    expect(dataLayer).toBeTruthy();

    const pageInfoEvent = dataLayer.find((e) => e.event === "pageInfo");
    expect(pageInfoEvent, "pageInfo event should exist").toBeTruthy();
    expect(pageInfoEvent.manufacturer).toBeTruthy();
    expect(pageInfoEvent.bodyType).toBeTruthy();
    expect(pageInfoEvent.model).toBeTruthy();
    expect(pageInfoEvent.price).toBeTruthy();
    expect(pageInfoEvent.fuelType).toBeTruthy();
    expect(pageInfoEvent.gearType).toBeTruthy();
    expect(pageInfoEvent.mileage).toBeTruthy();
    expect(pageInfoEvent.isCarPage).toBeTruthy();
    expect(pageInfoEvent.registerNumber).toBeTruthy();
  });
});

test("Verify events triggered when user navigates from search page to car page", async ({
  page,
  homePage,
  navigationMenu,
  searchPage,
}) => {
  page.on("pageerror", (err) => {
    if (
      err.message.includes("fbq is not defined") ||
      err.message.includes("Cannot read properties of undefined")
    ) {
      // Suppress known errors
    }
  });
  await page.goto("https://saka.fi/en");
  await homePage.acceptAllCookies();
  await navigationMenu.searchIcon().click();
  await page
    .getByRole("textbox", { name: "Search for anything" })
    .fill("volvo");
  await page
    .getByRole("textbox", { name: "Search for anything" })
    .press("Enter");
  await expect(searchPage.car1()).toBeVisible();
  await expect(searchPage.car1()).toContainText("Volvo");

  // Get the first Volvo car link and navigate directly
  const carHref = await searchPage
    .car1()
    .locator('a[href*="/car/"]')
    .getAttribute("href");
  expect(carHref).toBeTruthy();
  await page.goto(`https://saka.fi${carHref}`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3000);

  const dataLayer: any[] = await page.evaluate(
    () => (window as any).dataLayer ?? [],
  );
  expect(dataLayer).toBeTruthy();

  const pageInfoEvent = dataLayer.find((e) => e.event === "pageInfo");
  expect(pageInfoEvent, "pageInfo event should exist").toBeTruthy();
  expect(pageInfoEvent.contentId).toContain("Volvo");
  expect(pageInfoEvent.manufacturer).toBe("Volvo");
  expect(pageInfoEvent.bodyType).toBeTruthy();
  expect(pageInfoEvent.model).toBeTruthy();
  expect(pageInfoEvent.price).toBeTruthy();
  expect(pageInfoEvent.fuelType).toBeTruthy();
  expect(pageInfoEvent.gearType).toBeTruthy();
  expect(pageInfoEvent.mileage).toBeTruthy();
  expect(pageInfoEvent.isCarPage).toBeTruthy();
  expect(pageInfoEvent.registerNumber).toBeTruthy();
});
