import { test, expect } from "../fixtures/fixtures";

// This spec uses the 'authenticated' project which loads saved login storageState.
// The beforeEach login steps from the Cypress original are replaced by storageState.

test.beforeEach(async ({ page }) => {
  page.on("pageerror", (err) => {
    if (
      err.message.includes("fbq is not defined") ||
      err.message.includes("Cannot read properties of undefined") ||
      err.message.includes("NEXT_REDIRECT")
    ) {
      // Suppress known errors
    }
  });
  // Navigate to My Saka — already authenticated via storageState
  await page.goto("https://saka.fi/fi/oma-saka");
});

test.describe("Smoke test for My Saka Page.", () => {
  test("The user can login with valid credentials, hero banner is displayed and welcome text contains user name", async ({
    page,
    myAccount,
  }) => {
    await page.waitForTimeout(500);
    await expect(myAccount.welcomeText()).toBeVisible();
    await expect(myAccount.welcomeText()).toContainText("Adam");
  });

  test("Verify that my account navigation buttons are visible", async ({
    page,
    myAccount,
  }) => {
    await page.waitForTimeout(500);
    await expect(myAccount.favouriteCarsBtn()).toBeVisible();
    await expect(myAccount.myCarsBtn()).toBeVisible();
    await expect(myAccount.dashboardBtn()).toBeVisible();
    await expect(myAccount.myProfileBtn()).toBeVisible();
    await expect(myAccount.offersBtn()).toBeVisible();
  });

  test("Validate content of the dashboard", async ({ page, myAccount }) => {
    await page.waitForTimeout(500);
    await expect(myAccount.welcomeBanner()).toBeVisible();
    await expect(myAccount.ourArticles()).toBeVisible();
    await expect(myAccount.myPages()).toBeVisible();
    await expect(myAccount.yourFavCars()).toBeVisible();
    await expect(myAccount.yourOffers()).toBeVisible();
  });

  test("Favourite cars are displayed on the dashboard", async ({
    page,
    myAccount,
  }) => {
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 200));
    await expect(myAccount.favouriteCar1()).toBeVisible();
    await expect(myAccount.favouriteCar2()).toBeVisible();
  });

  test("The user has access to articles on the dashboard", async ({
    page,
    myAccount,
  }) => {
    await page.waitForTimeout(500);
    await expect(myAccount.article1()).toBeVisible();
    await expect(myAccount.article2()).toBeVisible();
  });

  test("The user can navigate to My Cars section. Verify the content of the page", async ({
    page,
    myAccount,
  }) => {
    await page.waitForTimeout(2000);
    await myAccount.myCarsBtn().click({ force: true });
    await expect(myAccount.myCarsTitle()).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 200));
    await expect(myAccount.myCarsBtn()).toBeVisible();
    await page.locator(".top-0 > .flex").click({ force: true });
    await myAccount.myCarsBtn().click({ force: true });
  });

  test("Verify that the user can add a car to My Cars", async ({
    page,
    myAccount,
  }) => {
    await page.waitForTimeout(2000);
    await myAccount.myCarsBtn().click({ force: true });
    await expect(myAccount.myCarsTitle()).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 200));
    await expect(myAccount.myCarsBtn()).toBeVisible();
    await page.locator(".top-0 > .flex").click({ force: true });
    await myAccount.addCar().click({ force: true });
    await expect(myAccount.fields()).toBeVisible();
    await expect(myAccount.addImage()).toBeVisible();
    await expect(myAccount.addCarForm()).toBeVisible();
  });

  test("The user can navigate to My Favourite Cars section. Verify content of the page", async ({
    page,
    myAccount,
  }) => {
    await page.waitForTimeout(500);
    await myAccount.favouriteCarsBtn().click({ force: true });
    await expect(myAccount.myFavCarsTitle()).toBeVisible();
    await expect(myAccount.myFavCar1()).toBeVisible();
    await expect(myAccount.myFavCar2()).toBeVisible();
    await expect(myAccount.recommendedCarsTitle()).toBeVisible();
    await expect(myAccount.recommendedCar1()).toBeVisible();
    await expect(myAccount.recommendedCarsNavigation()).toBeVisible();
  });

  test("The user can navigate to My Profile section. Verify content of the page", async ({
    page,
    myAccount,
  }) => {
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, 100));
    await myAccount.myProfileBtn().click({ force: true });
    await page
      .locator(":nth-child(4) > .border-primary-400")
      .click({ force: true });
    await page
      .locator(
        ":nth-child(1) > .flex-col > :nth-child(2) > .border-primary-400",
      )
      .click({ force: true });
    await page.evaluate(() => window.scrollTo(0, 100));
    await myAccount.myProfileBtn().click({ force: true });
    await page.waitForTimeout(500);
    await expect(myAccount.myProfileTitle()).toBeVisible();
    await expect(myAccount.firstName()).toBeVisible();
    await expect(myAccount.lastName()).toBeVisible();
    await expect(myAccount.phoneNumber()).toBeVisible();
    await expect(myAccount.email()).toBeVisible();
    await expect(myAccount.editProfileBtn()).toBeVisible();
  });

  test("The user can navigate to Offers section. Verify content of the page", async ({
    page,
    myAccount,
  }) => {
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, 500));
    await myAccount.offersBtn().click({ force: true });
    await expect(myAccount.offersTitle()).toBeVisible();
  });

  test("The user can log out and is redirected to login page", async ({
    page,
    myAccount,
    navigationMenu,
  }) => {
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL("https://saka.fi/fi/oma-saka");
    await myAccount.myAccoutIcon().click();
    await expect(navigationMenu.loginDropdown()).toBeVisible();
    await navigationMenu.logOutBtn().click();
    await expect(page).toHaveURL("https://saka.fi/fi/auth/kirjaudu");
  });
});
