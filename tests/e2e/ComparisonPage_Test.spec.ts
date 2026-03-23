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
  await page.context().addCookies([
    {
      name: "NEXT_LOCALE",
      value: "en",
      domain: "saka.fi",
      path: "/",
    },
    {
      name: "CookieConsent",
      value:
        "{stamp:%27-1%27,necessary:true,preferences:true,statistics:true,marketing:true,method:%27explicit%27,ver:1,utc:1700000000000,region:%27fi%27}",
      domain: ".saka.fi",
      path: "/",
    },
  ]);
  await page.goto("https://saka.fi/en/diesel-cars");
  await homePage.acceptAllCookies();
});

test.describe("Smoke test for Comparison page.", () => {
  test("Verify that user can add cars to comparison feature from category page", async ({
    navigationMenu,
    comparisonPage,
  }) => {
    await navigationMenu.carsForSale2().click();
    await navigationMenu.dieselCars().click({ force: true });
    await comparisonPage.addCarToComparison(0);
    await expect(comparisonPage.comparisonSidebar()).toBeVisible();
  });

  test("Verify that the comparison sidebar is available on the left side of the category page", async ({
    navigationMenu,
    comparisonPage,
  }) => {
    await navigationMenu.carsForSale2().click();
    await navigationMenu.dieselCars().click({ force: true });
    await comparisonPage.addCarToComparison(0);
    await expect(comparisonPage.comparisonSidebar()).toBeVisible();
  });

  test("Verify content of the comparison sidebar on category page", async ({
    navigationMenu,
    comparisonPage,
  }) => {
    await navigationMenu.carsForSale2().click();
    await navigationMenu.dieselCars().click({ force: true });
    await comparisonPage.addCarToComparison(0);
    await expect(comparisonPage.sidebarCar1()).toBeVisible();
  });

  test("Verify that user can add 3 cars to comparison sidebar from category page", async ({
    navigationMenu,
    comparisonPage,
  }) => {
    await navigationMenu.carsForSale2().click();
    await navigationMenu.dieselCars().click({ force: true });
    await comparisonPage.addCarToComparison(0);
    await comparisonPage.addCarToComparison(1);
    await comparisonPage.addCarToComparison(2);
    await expect(comparisonPage.sidebarCar31()).toBeVisible();
    await expect(comparisonPage.sidebarCar32()).toBeVisible();
    await expect(comparisonPage.sidebarCar33()).toBeVisible();
  });

  test("Verify that user is not able to add more than 3 cars to comparison sidebar", async ({
    navigationMenu,
    comparisonPage,
  }) => {
    await navigationMenu.carsForSale2().click();
    await navigationMenu.dieselCars().click({ force: true });
    await comparisonPage.addCarToComparison(0);
    await comparisonPage.addCarToComparison(1);
    await comparisonPage.addCarToComparison(2);
    await comparisonPage.addCarToComparison(3);
    await expect(comparisonPage.sidebarCar31()).toBeVisible();
    await expect(comparisonPage.sidebarCar32()).toBeVisible();
    await expect(comparisonPage.sidebarCar33()).toBeVisible();
    await expect(comparisonPage.sidebarMessage()).toBeVisible();
    await expect(comparisonPage.sidebarMessage()).toContainText("full");
  });

  test("Verify that user can hide and open comparison widget", async ({
    page,
    navigationMenu,
    comparisonPage,
  }) => {
    await navigationMenu.carsForSale2().click();
    await navigationMenu.dieselCars().click({ force: true });
    await comparisonPage.addCarToComparison(0);
    await comparisonPage.closeOpenSidebar().click({ force: true });
    // Sidebar uses CSS transform to slide off-screen, check the form is out of viewport
    await expect(comparisonPage.comparisonSidebar()).not.toBeInViewport();
    await comparisonPage.closeOpenSidebar().click({ force: true });
    await expect(comparisonPage.comparisonSidebar()).toBeInViewport();
  });

  test("Verify that user can remove car from comparison sidebar", async ({
    navigationMenu,
    comparisonPage,
  }) => {
    await navigationMenu.carsForSale2().click();
    await navigationMenu.dieselCars().click({ force: true });
    await comparisonPage.addCarToComparison(0);
    await comparisonPage.addCarToComparison(1);
    await comparisonPage.addCarToComparison(2);
    await expect(comparisonPage.sidebarCar31()).toBeVisible();
    await expect(comparisonPage.sidebarCar32()).toBeVisible();
    await expect(comparisonPage.sidebarCar33()).toBeVisible();
    await comparisonPage.removeCarButton().click({ force: true });
    await expect(comparisonPage.sidebarCar31()).toBeVisible();
    await expect(comparisonPage.sidebarCar32()).toBeVisible();
    await expect(comparisonPage.sidebarCar33()).toBeHidden();
  });

  test("Verify that user can navigate to comparison page", async ({
    page,
    navigationMenu,
    comparisonPage,
  }) => {
    await navigationMenu.carsForSale2().click();
    await navigationMenu.dieselCars().click({ force: true });
    await comparisonPage.addCarToComparison(0);
    await comparisonPage.addCarToComparison(1);
    await comparisonPage.addCarToComparison(2);
    await expect(comparisonPage.sidebarCar31()).toBeVisible();
    await expect(comparisonPage.sidebarCar32()).toBeVisible();
    await expect(comparisonPage.sidebarCar33()).toBeVisible();
    await comparisonPage.goToComparePageBtn().click({ force: true });
    await expect(page).toHaveURL(/\/(fi\/vertailu|en\/comparison)/);
  });

  test("Verify content of comparison page", async ({
    page,
    navigationMenu,
    comparisonPage,
  }) => {
    await navigationMenu.carsForSale2().click();
    await navigationMenu.dieselCars().click({ force: true });
    await comparisonPage.addCarToComparison(0);
    await comparisonPage.addCarToComparison(1);
    await comparisonPage.addCarToComparison(2);
    await expect(comparisonPage.sidebarCar31()).toBeVisible();
    await expect(comparisonPage.sidebarCar32()).toBeVisible();
    await expect(comparisonPage.sidebarCar33()).toBeVisible();
    await comparisonPage.goToComparePageBtn().click({ force: true });
    await expect(comparisonPage.title()).toBeVisible();
    await expect(comparisonPage.descripiton()).toBeVisible();
    await expect(comparisonPage.carHeader1()).toBeVisible();
    await expect(comparisonPage.carHeader2()).toBeVisible();
    await expect(comparisonPage.carHeader3()).toBeVisible();
    await expect(comparisonPage.carTile1()).toBeVisible();
    await expect(comparisonPage.carTile2()).toBeVisible();
    await expect(comparisonPage.carTile3()).toBeVisible();
    await expect(comparisonPage.price1()).toBeVisible();
    await expect(comparisonPage.price2()).toBeVisible();
    await expect(comparisonPage.price3()).toBeVisible();
  });
});
