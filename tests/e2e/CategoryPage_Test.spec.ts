import { test, expect } from "../fixtures/fixtures";

test.beforeEach(async ({ page, homePage }) => {
  page.on("pageerror", (err) => {
    if (
      err.message.includes("fbq is not defined") ||
      err.message.includes("Cannot read properties of undefined")
    ) {
      // Suppress known third-party errors
    }
  });
  await page.goto("https://saka.fi/en/diesel-cars");
  await homePage.acceptAllCookies();
});

test.describe("Smoke test for Category page.", () => {
  test("Verify that user can navigate from Homepage to Diesel cars category", async ({
    page,
    navigationMenu,
  }) => {
    await navigationMenu.carsForSale2().click();
    await navigationMenu.dieselCars().click({ force: true });
    await expect(page).toHaveURL("https://saka.fi/en/diesel-cars");
  });

  test("Verify that user can navigate from the category page to a car page", async ({
    page,
    categoryPage,
  }) => {
    await expect(page).toHaveURL("https://saka.fi/en/diesel-cars");
    await categoryPage.car1().click({ force: true });
    await expect(page).toHaveURL(/https:\/\/saka\.fi\/en\/car\//);
  });

  test("Verify content of the category page", async ({ categoryPage }) => {
    await expect(categoryPage.heroBanner()).toBeVisible();
    await expect(categoryPage.heroBannerDesc()).toBeVisible();
    await expect(categoryPage.heroBannerTitle()).toBeVisible();
    await expect(categoryPage.heroBannerTitle()).toContainText("DIESEL CARS");
    await expect(categoryPage.heroBannerDesc()).toContainText(
      "Diesel cars offer efficient and reliable performance",
    );
  });

  test("Verify that search result counter is visible", async ({
    categoryPage,
  }) => {
    await expect(categoryPage.carCounter()).toBeVisible();
  });

  test("Verify that category page filters are visible", async ({
    categoryPage,
  }) => {
    await expect(categoryPage.filters()).toBeVisible();
  });

  test("Verify sorting options", async ({ categoryPage }) => {
    await expect(categoryPage.sorting()).toBeVisible();
    await categoryPage.sorting().click({ force: true });
  });

  test("Verify pagination of the search result page", async ({
    page,
    categoryPage,
  }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(categoryPage.pagination()).toBeVisible();
    await expect(categoryPage.pagination()).toContainText("1");
  });

  test("Verify that user can navigate to next page of the search results", async ({
    page,
    categoryPage,
  }) => {
    await categoryPage.nextPage().click({ force: true });
    await page.waitForTimeout(2000);
    await expect(categoryPage.pagination()).toBeVisible();
    await expect(categoryPage.pagination()).toContainText("2");
    await expect(page).toHaveURL("https://saka.fi/en/diesel-cars?page=2");
  });

  test("Verify car cards on the category page", async ({ categoryPage }) => {
    await expect(categoryPage.car1Diesel()).toBeVisible();
    await expect(categoryPage.car1Diesel()).toContainText("Diesel");
    await expect(categoryPage.car1Image()).toBeVisible();
    await expect(categoryPage.car4Price()).toBeVisible();
    await expect(categoryPage.car4Accessories()).toBeVisible();
    await expect(categoryPage.car4CompareBtn()).toBeVisible();
  });

  test("Verify filtering of the category page - click Mercedes if present", async ({
    page,
  }) => {
    const carTitles = page.locator(".grid .m-0");
    for (const el of await carTitles.all()) {
      const text = await el.textContent();
      if (text?.includes("Mercedes")) {
        await el.click({ force: true });
        break;
      }
    }
  });

  test("Verify filtering by model on the category page", async ({
    page,
    searchPage,
  }) => {
    await searchPage.filterModel().click({ force: true });
    await searchPage
      .modelList()
      .getByText("V90", { exact: true })
      .click({ force: true });
    await expect(searchPage.activeFilters()).toContainText("V90");
    await expect(page).toHaveURL(
      /https:\/\/saka\.fi\/en\/diesel-cars\?model=V90/,
    );
    await expect(searchPage.car1()).toBeVisible();
    await expect(searchPage.car1()).toContainText("Volvo V90");
  });

  test("The user can remove selected filters", async ({ page, searchPage }) => {
    await searchPage.filterModel().click({ force: true });
    await searchPage
      .modelList()
      .getByText("V90", { exact: true })
      .click({ force: true });
    await expect(searchPage.activeFilters()).toContainText("V90");
    await expect(page).toHaveURL(
      /https:\/\/saka\.fi\/en\/diesel-cars\?model=V90/,
    );
    await expect(searchPage.car1()).toContainText("Volvo V90");
    await expect(searchPage.clearAllBtn()).toBeVisible();
    await searchPage.clearAllBtn().click({ force: true });
    await expect(searchPage.clearAllBtn()).toBeHidden();
    await expect(page).toHaveURL("https://saka.fi/en/diesel-cars");
  });
});
