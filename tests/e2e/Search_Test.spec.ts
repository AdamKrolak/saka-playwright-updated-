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
  await page.goto("/en");
  await homePage.acceptAllCookies();
});

test.describe("Smoke test for the search", () => {
  test("Verify search suggestions are displayed", async ({
    navigationMenu,
    searchSuggestions,
  }) => {
    await navigationMenu.searchIcon().click();
    await expect(searchSuggestions.searchSuggestions()).toBeVisible();
  });

  test("Verify user can enter keyword to search input field", async ({
    navigationMenu,
    searchSuggestions,
  }) => {
    await navigationMenu.searchIcon().click();
    await expect(searchSuggestions.searchInput()).toBeVisible();
    await searchSuggestions.searchInput().fill("volvo");
  });

  test("Verify that search suggestions match entered input", async ({
    navigationMenu,
    searchSuggestions,
  }) => {
    await navigationMenu.searchIcon().click();
    await expect(searchSuggestions.searchInput()).toBeVisible();
    await searchSuggestions.searchInput().fill("volvo");
    await expect(searchSuggestions.searchSugCarTitle1()).toContainText("Volvo");
  });

  test("Verify user can navigate to search result page", async ({
    page,
    navigationMenu,
    searchSuggestions,
  }) => {
    await navigationMenu.searchIcon().click();
    await expect(searchSuggestions.searchInput()).toBeVisible();
    await searchSuggestions.searchInput().fill("volvo");
    await searchSuggestions.searchInput().press("Enter");
    await expect(page).toHaveURL(/\/en\/search\?.*q=volvo/);
  });

  test("Verify search result page content", async ({
    page,
    navigationMenu,
    searchSuggestions,
    searchPage,
  }) => {
    await navigationMenu.searchIcon().click();
    await searchSuggestions.searchInput().fill("volvo");
    await searchSuggestions.searchInput().press("Enter");
    await expect(page).toHaveURL(/\/en\/search\?.*q=volvo/);
    await expect(searchPage.heroBanner()).toBeVisible();
    await expect(searchPage.heroTitle()).toBeVisible();
    await expect(searchPage.heroTitle()).toContainText(
      'Search results for "volvo"',
    );
  });

  test("Verify that search result counter is visible", async ({
    navigationMenu,
    searchSuggestions,
    searchPage,
  }) => {
    await navigationMenu.searchIcon().click();
    await searchSuggestions.searchInput().fill("volvo");
    await searchSuggestions.searchInput().press("Enter");
    await expect(searchPage.carsCounter()).toBeVisible();
  });

  test("Verify that search result filters are visible", async ({
    navigationMenu,
    searchSuggestions,
    searchPage,
  }) => {
    await navigationMenu.searchIcon().click();
    await searchSuggestions.searchInput().fill("volvo");
    await searchSuggestions.searchInput().press("Enter");
    await expect(searchPage.filters()).toBeVisible();
  });

  test("Verify sorting options", async ({
    navigationMenu,
    searchSuggestions,
    searchPage,
  }) => {
    await navigationMenu.searchIcon().click();
    await searchSuggestions.searchInput().fill("volvo");
    await searchSuggestions.searchInput().press("Enter");
    await expect(searchPage.sortingOptions()).toBeVisible();
    await searchPage.sortingOptions().click({ force: true });
  });

  test("Verify pagination of the search result page", async ({
    page,
    navigationMenu,
    searchSuggestions,
    searchPage,
  }) => {
    await navigationMenu.searchIcon().click();
    await searchSuggestions.searchInput().fill("volvo");
    await searchSuggestions.searchInput().press("Enter");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(searchPage.pagination()).toBeVisible();
    await expect(searchPage.pagination()).toContainText("1");
  });

  test("Verify that user can navigate to next page of the search results", async ({
    page,
    navigationMenu,
    searchSuggestions,
    searchPage,
  }) => {
    await navigationMenu.searchIcon().click();
    await searchSuggestions.searchInput().fill("volvo");
    await searchSuggestions.searchInput().press("Enter");
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await searchPage.nextPage().waitFor({ state: "visible" });
    await searchPage.nextPage().click({ force: true });
    await page.waitForTimeout(2000);
    await expect(searchPage.pagination()).toBeVisible();
    await expect(searchPage.pagination()).toContainText("2");
    await expect(page).toHaveURL(/\/en\/search\?.*q=volvo.*page=2/);
  });

  test("Verify that user can navigate to a car page from search result page", async ({
    page,
    navigationMenu,
    searchSuggestions,
  }) => {
    await navigationMenu.searchIcon().click();
    await searchSuggestions.searchInput().fill("volvo");
    await searchSuggestions.searchInput().press("Enter");
    await page.waitForURL(/\/en\/search\?.*q=volvo/);
    await page
      .locator('[data-id="desktop-search-trigger"][data-state="closed"]')
      .waitFor({ state: "visible", timeout: 10000 });
    const firstSearchResultCard = page
      .locator('section [data-slot="card"]')
      .first()
      .locator('a[href*="/car/"]');
    await firstSearchResultCard.waitFor({ state: "visible" });
    await firstSearchResultCard.click();
    await expect(page).toHaveURL(/https:\/\/saka\.fi\/en\/car\/volvo-/);
  });

  test("Verify car cards on search result page", async ({
    navigationMenu,
    searchSuggestions,
    searchPage,
  }) => {
    await navigationMenu.searchIcon().click();
    await searchSuggestions.searchInput().fill("volvo");
    await searchSuggestions.searchInput().press("Enter");
    await expect(searchPage.car1()).toBeVisible();
    await expect(searchPage.car1()).toContainText("Volvo");
    await expect(searchPage.car1Image()).toBeVisible();
    await expect(searchPage.car2Price()).toBeVisible();
    await expect(searchPage.car2Accessories()).toBeVisible();
    await expect(searchPage.car2CompareBtn()).toBeVisible();
  });

  test("Verify filtering of the search results", async ({
    page,
    navigationMenu,
    searchSuggestions,
    searchPage,
  }) => {
    await navigationMenu.searchIcon().click();
    await searchSuggestions.searchInput().fill("volvo");
    await searchSuggestions.searchInput().press("Enter");
    await page.waitForURL(/\/en\/search\?.*q=volvo/);
    await page
      .locator('[data-id="desktop-search-trigger"][data-state="closed"]')
      .waitFor({ state: "visible", timeout: 10000 });
    await searchPage.filterModel().waitFor({ state: "visible" });
    await searchPage.filterModel().click();
    await searchPage.modelList().waitFor({ state: "visible" });
    await searchPage.modelList().getByText("XC60").first().click();
    await expect(searchPage.activeFilters()).toContainText("XC60");
    await expect(page).toHaveURL(/\/en\/search\?.*q=volvo.*model=XC60/);
    await expect(searchPage.car1()).toBeVisible();
    await expect(searchPage.car1()).toContainText("Volvo XC60");
  });

  test("The user can remove selected filters", async ({
    page,
    navigationMenu,
    searchSuggestions,
    searchPage,
  }) => {
    await navigationMenu.searchIcon().click();
    await searchSuggestions.searchInput().fill("volvo");
    await searchSuggestions.searchInput().press("Enter");
    await page.waitForURL(/\/en\/search\?.*q=volvo/);
    await page
      .locator('[data-id="desktop-search-trigger"][data-state="closed"]')
      .waitFor({ state: "visible", timeout: 10000 });
    await searchPage.filterModel().waitFor({ state: "visible" });
    await searchPage.filterModel().click();
    await searchPage.modelList().waitFor({ state: "visible" });
    await searchPage.modelList().getByText("XC60").first().click();
    await expect(searchPage.activeFilters()).toContainText("XC60");
    await expect(page).toHaveURL(/\/en\/search\?.*q=volvo.*model=XC60/);
    await expect(searchPage.car1()).toContainText("Volvo XC60");
    await expect(searchPage.clearAllBtn()).toBeVisible();
    await searchPage.clearAllBtn().click({ force: true });
    await expect(searchPage.clearAllBtn()).toBeHidden();
    await expect(page).toHaveURL(/\/en\/search\?.*q=volvo/);
  });
});
