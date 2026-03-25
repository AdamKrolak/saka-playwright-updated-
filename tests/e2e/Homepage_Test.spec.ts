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
  // Navigate first to allow site to set cookies, then force English locale
  await page.goto("/", { waitUntil: "domcontentloaded" });
  // If redirected to Finnish (IP-based detection), navigate back to English URL
  if (page.url().includes("/fi")) {
    await page.goto("https://saka.fi/en", { waitUntil: "domcontentloaded" });
  }
  await homePage.acceptAllCookies();
});

test.describe("Smoke test for Homepage.", () => {
  test("Verify that navigation menu is visible. Validate logo, icons and sections", async ({
    navigationMenu,
  }) => {
    await expect(navigationMenu.navMenu()).toBeVisible();
    await expect(navigationMenu.mySakaIcon()).toBeVisible();
    await expect(navigationMenu.searchIcon()).toBeVisible();
    await expect(navigationMenu.langFlag()).toBeVisible();
    await expect(navigationMenu.carsForSale2()).toBeVisible();
    await expect(navigationMenu.sellYourCar()).toBeVisible();
    await expect(navigationMenu.productsNServices()).toBeVisible();
    await expect(navigationMenu.articles()).toBeVisible();
    await expect(navigationMenu.salesLocation()).toBeVisible();
    await expect(navigationMenu.comapny()).toBeVisible();
    await expect(navigationMenu.logo()).toBeVisible();
  });

  test("Verify that user can switch language of the website", async ({
    page,
    navigationMenu,
  }) => {
    await navigationMenu.langFlag().click({ force: true });
    await navigationMenu.fiFlag().click();
    await expect(page).toHaveURL(/https:\/\/saka\.fi\/fi/);
  });

  test("Verify that navigation dropdowns", async ({ navigationMenu }) => {
    await navigationMenu.carsForSale2().click({ force: true });
    await expect(navigationMenu.carsForSaleDrop()).toBeVisible();
    await expect(navigationMenu.sellYourCar()).toBeVisible();
    await expect(navigationMenu.productsNServices()).toBeVisible();
    await expect(navigationMenu.articles()).toBeVisible();
    await expect(navigationMenu.salesLocation()).toBeVisible();
    await expect(navigationMenu.comapny()).toBeVisible();
    await expect(navigationMenu.logo()).toBeVisible();
  });

  test("Verify that user can navigate from Homepage to My Account", async ({
    page,
    homePage,
    navigationMenu,
    loginPage,
  }) => {
    await homePage.verifyHomepageUrl();
    await navigationMenu.mySakaIcon().click({ force: true });
    await expect(navigationMenu.loginDropdown()).toBeVisible();
    await page.waitForTimeout(2000);
    await navigationMenu.signIn().click();
    await loginPage.verifyLoginpageUrl();
  });

  test("Verify that user can navigate from Homepage to Registration page", async ({
    page,
    homePage,
    navigationMenu,
    registrationPage,
  }) => {
    await homePage.verifyHomepageUrl();
    await navigationMenu.mySakaIcon().click({ force: true });
    await expect(navigationMenu.loginDropdown()).toBeVisible();
    await page.waitForTimeout(2000);
    await navigationMenu.signUp().click();
    await registrationPage.verifyRegPageUrl();
  });

  test("Verify that hero banner and title are visible", async ({
    homePage,
  }) => {
    await expect(homePage.heroBanner()).toBeVisible();
    await expect(homePage.titleBanner()).toBeVisible();
    await expect(homePage.titleBanner()).toContainText(
      "Finland's largest used car dealer",
    );
  });

  test("Verify that Latest cars sections is displayed and user can navigate from Homepage to PDP - Latest Cars", async ({
    page,
    homePage,
  }) => {
    await page.evaluate(() => window.scrollTo(0, 500));
    await expect(
      homePage.homePageMid().getByRole("region").first(),
    ).toBeVisible();
    await homePage.latestCar1().click({ force: true });
    await expect(page).toHaveURL(/https:\/\/saka\.fi\/en\/car\//);
  });

  test("Verify that Electric cars sections is displayed and user can navigate from Homepage to PDP - Electric Cars", async ({
    page,
    homePage,
  }) => {
    await homePage.electricCar1().scrollIntoViewIfNeeded();
    await expect(
      homePage.homePageMid().getByRole("region", { name: "Electric cars" }),
    ).toBeVisible();
    await homePage.electricCar1().click();
    await expect(page).toHaveURL(/https:\/\/saka\.fi\/en\/car\//);
  });

  test("Verify that Family cars sections is displayed and user can navigate from Homepage to PDP - Family Cars", async ({
    page,
    homePage,
  }) => {
    await homePage.famillyCar2().scrollIntoViewIfNeeded();
    await expect(
      homePage.homePageMid().getByRole("region", { name: "Family cars" }),
    ).toBeVisible();
    await expect(
      homePage.homePageMid().getByRole("region", { name: "Electric cars" }),
    ).toBeVisible();
    await homePage.famillyCar2().click();
    await expect(page).toHaveURL(/https:\/\/saka\.fi\/en\/car\//);
  });

  test("Verify that user can display search suggestions", async ({
    navigationMenu,
    searchSuggestions,
  }) => {
    await navigationMenu.searchIcon().click();
    await expect(searchSuggestions.searchSuggestions()).toBeVisible();
  });

  test("Verify that services support section is displayed", async ({
    page,
    homePage,
  }) => {
    await page.evaluate(() => window.scrollTo(0, 3000));
    await expect(homePage.serviceSupport()).toBeVisible();
    await expect(homePage.serviceSupport()).toContainText(
      "Our additional services to support your car purchase",
    );
    await expect(homePage.serviceSupportArt()).toBeVisible();
  });

  test("Verify that articles section is displayed", async ({
    page,
    homePage,
  }) => {
    await page.evaluate(() => window.scrollTo(0, 4000));
    await expect(homePage.articleSection()).toBeVisible();
    await expect(homePage.articleSection()).toContainText(
      "Saka customer experiences",
    );
    await expect(homePage.article1()).toBeVisible();
  });

  test("Verify that footer is visible and contains logo and 4 columns, validate titles of the columns", async ({
    page,
    homePage,
  }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(homePage.footer()).toBeVisible();
    await expect(homePage.footerLogo()).toBeVisible();
    await expect(homePage.followUs()).toBeVisible();
    await expect(homePage.followUs()).toContainText("Follow us");
    await expect(homePage.carCategoriesFooter()).toBeVisible();
    await expect(homePage.carCategoriesFooter()).toContainText(
      "Car categories",
    );
    await expect(homePage.productNserviceces()).toBeVisible();
    await expect(homePage.productNserviceces()).toContainText(
      "Products & Services",
    );
    await expect(homePage.comapny()).toBeVisible();
    await expect(homePage.comapny()).toContainText("Company");
  });

  test("Verify that newsletter is visible and check newsletter sign-up confirmation message displays", async ({
    page,
    homePage,
  }) => {
    await homePage.newsletter().scrollIntoViewIfNeeded();
    await expect(homePage.newsletter()).toBeVisible();
    await homePage.newsletter().click();
    await homePage.newsletter().fill("test@email.com");
    await homePage.newsletterBtn().click({ force: true });
    await expect(page.getByRole("alert")).toBeVisible({ timeout: 10000 });
  });

  test("Verify social media links", async ({ page, homePage }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(homePage.facebook()).toBeVisible();
    await expect(homePage.facebook()).toHaveAttribute(
      "href",
      "https://fi-fi.facebook.com/SakaFinlandOy/",
    );
    await expect(homePage.instagram()).toBeVisible();
    await expect(homePage.instagram()).toHaveAttribute(
      "href",
      "https://www.instagram.com/saka.fi/",
    );
    await expect(homePage.tiktok()).toBeVisible();
    await expect(homePage.tiktok()).toHaveAttribute(
      "href",
      "https://www.tiktok.com/@saka.fi",
    );
    await expect(homePage.linkedIn()).toBeVisible();
    await expect(homePage.linkedIn()).toHaveAttribute(
      "href",
      "https://www.linkedin.com/company/suomenautokauppa/",
    );
    await expect(homePage.youtube()).toBeVisible();
    await expect(homePage.youtube()).toHaveAttribute(
      "href",
      "https://www.youtube.com/@SakaFinland",
    );
  });

  test("Verify that user can switch a language of the website", async ({
    page,
    navigationMenu,
  }) => {
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await navigationMenu.langFlag().click({ force: true });
    await navigationMenu.fiFlag().click();
    await expect(page).toHaveURL(/https:\/\/saka\.fi\/fi/);
  });
});
