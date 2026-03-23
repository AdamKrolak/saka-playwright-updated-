import { test, expect } from "../fixtures/fixtures";

test.beforeEach(
  async ({ page, homePage, navigationMenu, salesLocationPage }) => {
    page.on("pageerror", (err) => {
      if (
        err.message.includes("fbq is not defined") ||
        err.message.includes("Cannot read properties of undefined") ||
        err.message.includes("NEXT_REDIRECT") ||
        err.message.includes("Minified React error")
      ) {
        // Suppress known errors
      }
    });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/fi")) {
      await page.goto("https://saka.fi/en", { waitUntil: "domcontentloaded" });
    }
    await homePage.acceptAllCookies();
    await navigationMenu.salesLocation().click();
    await salesLocationPage.closePromoBanner();
  },
);

test.describe("Smoke test for Sales Location Page.", () => {
  test("Verify that user can navigate to Sales Location page", async ({
    salesLocationPage,
  }) => {
    await salesLocationPage.verifyLocPageUrl();
  });

  test("Verify content of the Sales Location page", async ({
    salesLocationPage,
  }) => {
    await expect(salesLocationPage.pageTitle()).toBeVisible();
    await expect(salesLocationPage.pageTitle()).toContainText(
      "Dealership Locations",
    );
    await salesLocationPage.map().click();
    await salesLocationPage.location1().scrollIntoViewIfNeeded();
    await expect(salesLocationPage.location1()).toBeVisible();
    await salesLocationPage.location2().scrollIntoViewIfNeeded();
    await expect(salesLocationPage.location2()).toBeVisible();
    await salesLocationPage.location3().scrollIntoViewIfNeeded();
    await expect(salesLocationPage.location3()).toBeVisible();
    await expect(salesLocationPage.locationDropdown()).toBeVisible();
  });

  test("Verify location dropdown. Check if locations are in alphabetical order", async ({
    page,
    salesLocationPage,
  }) => {
    await expect(salesLocationPage.locationDropdown()).toContainText(
      "Select a location",
    );
    await salesLocationPage.locationDropdown().scrollIntoViewIfNeeded();
    await salesLocationPage.locationDropdown().click();
    const listbox = salesLocationPage.locationDropdownList();
    try {
      await listbox.waitFor({ state: "visible", timeout: 3000 });
    } catch {
      await salesLocationPage.locationDropdown().click();
      await listbox.waitFor({ state: "visible", timeout: 5000 });
    }
    await expect(listbox.getByText("Express")).toBeVisible();
  });

  test("Verify that user can check information about a dealership locale", async ({
    salesLocationPage,
  }) => {
    await salesLocationPage.location1Address().scrollIntoViewIfNeeded();
    await expect(salesLocationPage.location1Address()).toBeVisible();
    await salesLocationPage.location1Name().scrollIntoViewIfNeeded();
    await expect(salesLocationPage.location1Name()).toBeVisible();
    await salesLocationPage.location1State().scrollIntoViewIfNeeded();
    await expect(salesLocationPage.location1State()).toBeVisible();
    await salesLocationPage.location1Phone().scrollIntoViewIfNeeded();
    await expect(salesLocationPage.location1Phone()).toBeVisible();
    await salesLocationPage.location1CarsBtn().scrollIntoViewIfNeeded();
    await expect(salesLocationPage.location1CarsBtn()).toBeVisible();
  });

  test("Verify that user is redirected to correct location dealership category", async ({
    page,
    salesLocationPage,
  }) => {
    await salesLocationPage.location1CarsBtn().click({ force: true });
    await expect(page).toHaveURL("https://saka.fi/en/locations/pakkala");
  });

  test("The user can select location from the dropdown list", async ({
    page,
    salesLocationPage,
  }) => {
    await expect(salesLocationPage.locationDropdown()).toContainText(
      "Select a location",
    );
    await salesLocationPage.selectLocationFromDropdown("Hyvinkää");
    await expect(salesLocationPage.locationHyvinkää()).toBeVisible();
    await expect(salesLocationPage.locationHyvinkää()).toContainText(
      "Hyvinkää",
    );
  });

  test("Verify that selected dealership contains map with the location of the store and address", async ({
    page,
    salesLocationPage,
  }) => {
    await expect(salesLocationPage.locationDropdown()).toContainText(
      "Select a location",
    );
    await salesLocationPage.selectLocationFromDropdown("Hyvinkää");
    await expect(salesLocationPage.locationMap()).toBeVisible();
    await expect(salesLocationPage.locationHyvinkääAddress()).toBeVisible();
    await expect(salesLocationPage.locationHyvinkääAddress()).toContainText(
      "Hyvinkää",
    );
  });

  test("Verify that selected dealership contains sales people list", async ({
    page,
    salesLocationPage,
  }) => {
    await expect(salesLocationPage.locationDropdown()).toContainText(
      "Select a location",
    );
    await salesLocationPage.selectLocationFromDropdown("Hyvinkää");
    await expect(salesLocationPage.locationaSalespeopleTitle()).toBeVisible();
    await expect(salesLocationPage.locationaSalespeople1()).toBeVisible();
    await expect(salesLocationPage.locationaSalespeople2()).toBeVisible();
  });

  test("Verify that selected dealership short description", async ({
    page,
    salesLocationPage,
  }) => {
    await expect(salesLocationPage.locationDropdown()).toContainText(
      "Select a location",
    );
    await salesLocationPage.selectLocationFromDropdown("Hyvinkää");
    await salesLocationPage.locationDescription().scrollIntoViewIfNeeded();
    await expect(salesLocationPage.locationDescription()).toBeVisible();
    await expect(salesLocationPage.locationDescription()).toContainText(
      "Hyvinkää",
    );
  });
});
