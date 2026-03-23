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
  await page.goto("/en/hybrid-cars");
  await homePage.acceptAllCookies();
});

test.describe("Smoke test for Car page.", () => {
  test("Verify that user can navigate from category page to the car page", async ({
    page,
    categoryPage,
  }) => {
    await expect(page).toHaveURL(/saka\.fi\/(en|fi)\/hybrid-cars/);
    await categoryPage.car1().click({ force: true });
    await expect(page).toHaveURL(/saka\.fi\/(en|fi)\/car\//);
  });

  test("Verify that image and gallery of the cars is displayed", async ({
    page,
    homePage,
    carPage,
  }) => {
    await page.goto("/en");
    await page.evaluate(() => window.scrollTo(0, 1000));
    await expect(
      homePage.homePageMid().getByRole("region").first().getByRole("heading"),
    ).toBeVisible();
    await homePage.electricCar1().click({ force: true });
    await expect(carPage.carImage()).toBeVisible();
    await expect(carPage.firstGallImage()).toBeVisible();
  });

  test("Verify that name of the car is visible", async ({
    categoryPage,
    carPage,
  }) => {
    await categoryPage.car1().click({ force: true });
    await expect(carPage.carName()).toBeVisible();
  });

  test("Verify that short description of the car is visible", async ({
    categoryPage,
    carPage,
  }) => {
    await categoryPage.car1().click({ force: true });
    await expect(carPage.carShorDsc()).toBeVisible();
  });

  test("Verify that car price is visible", async ({
    categoryPage,
    carPage,
  }) => {
    await categoryPage.car1().click({ force: true });
    await expect(carPage.carPrice()).toBeVisible();
  });

  test("Verify that breadcrumbs are displayed", async ({
    categoryPage,
    carPage,
  }) => {
    await categoryPage.car1().click({ force: true });
    await expect(carPage.breadcrumbs()).toBeVisible();
  });

  test("Verify that financing calculator is visible", async ({
    page,
    categoryPage,
    carPage,
  }) => {
    await categoryPage.car1().click({ force: true });
    await page.waitForTimeout(1000);
    await expect(carPage.financingBtn()).toBeVisible();
    await carPage.financingBtn().scrollIntoViewIfNeeded();
    await carPage.financingBtn().click();
  });

  test("Verify that basic info of the car are available", async ({
    categoryPage,
    carPage,
  }) => {
    await categoryPage.car1().click({ force: true });
    await expect(carPage.mileage()).toBeVisible();
    await expect(carPage.yearOfMan()).toBeVisible();
    await expect(carPage.type()).toBeVisible();
    await expect(carPage.transmission()).toBeVisible();
  });

  test("Verify that user can view image in full screen", async ({
    categoryPage,
    carPage,
  }) => {
    await categoryPage.car1().click({ force: true });
    await carPage.fullScreenBtn().click({ force: true });
    await expect(carPage.fullImage()).toBeVisible();
  });

  test("Verify that user can minimise image", async ({
    categoryPage,
    carPage,
  }) => {
    await categoryPage.car1().click({ force: true });
    await carPage.fullScreenBtn().click({ force: true });
    await carPage.minimiseBtn().click({ force: true });
    await expect(carPage.minimiseBtn()).toBeHidden();
  });

  test("Verify user can expand equipment accordion and the content is visible", async ({
    page,
    categoryPage,
    carPage,
  }) => {
    // Navigate to a car known to have Equipment tab
    await page.goto("/en/car/mini-countryman-175082");
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 500));
    await expect(carPage.equAcc()).toBeVisible();
    await carPage.equAcc().click({ force: true });
    await expect(carPage.equAccContent()).toBeVisible();
  });

  test("Verify user can expand basic information accordion and the content is visible", async ({
    page,
    categoryPage,
    carPage,
  }) => {
    await categoryPage.car1().click({ force: true });
    await page.getByRole("tab", { name: "Car Information" }).waitFor();
    await expect(carPage.basicInfoAcc()).toBeVisible();
    await carPage.basicInfoAcc().click({ force: true });
    await expect(carPage.basicInfoTitle()).toBeVisible();
    await expect(carPage.basicInfoAccCont()).toBeVisible();
  });

  test("Verify user can expand technical information accordion and the content is visible", async ({
    page,
    categoryPage,
    carPage,
  }) => {
    await categoryPage.car1().click({ force: true });
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 500));
    await expect(carPage.techInfoAcc()).toBeVisible();
    await carPage.techInfoAcc().click({ force: true });
    await expect(carPage.techInfoTitle()).toBeVisible();
    await expect(carPage.techInfoAcc()).toBeVisible();
  });

  test("Verify user can expand condition report accordion and the condition form is available", async ({
    page,
    categoryPage,
    carPage,
  }) => {
    // Navigate to a car known to have Condition Report button
    await page.goto("/en/car/mini-countryman-175082");
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 500));
    await expect(carPage.condRepotTitle()).toBeVisible();
    await expect(carPage.condRepotAcc()).toBeVisible();
    await carPage.condRepotAcc().click({ force: true });
    await expect(carPage.condRepotAccForm()).toBeVisible();
  });

  test("Verify that Related vehicles section is displayed", async ({
    page,
    categoryPage,
    carPage,
  }) => {
    // Navigate to a car known to have Related Vehicles section
    await page.goto("/en/car/mini-countryman-175082");
    await carPage.relatedCarTitle().scrollIntoViewIfNeeded();
    await expect(carPage.relatedCarTitle()).toBeVisible();
    await expect(carPage.relatedCarSection()).toBeVisible();
    await carPage
      .relatedCarFirstCar()
      .waitFor({ state: "visible", timeout: 30000 });
    await expect(carPage.relatedCarFirstCar()).toBeVisible();
  });

  test("Verify that user can navigate to related car page", async ({
    page,
    categoryPage,
    carPage,
  }) => {
    await page.goto("/en/car/mini-countryman-175082");
    await carPage.relatedCarTitle().scrollIntoViewIfNeeded();
    await carPage
      .relatedCarFirstCar()
      .waitFor({ state: "visible", timeout: 30000 });
    await carPage.relatedCarFirstCar().scrollIntoViewIfNeeded();
    await carPage.relatedCarFirstCar().click({ force: true });
  });

  test("Verify that SakaVarma is visible", async ({
    page,
    categoryPage,
    carPage,
  }) => {
    // Navigate to a car known to have SakaVarma in equipment list
    await page.goto("/en/car/mini-countryman-175082");
    await expect(carPage.sakaVarma()).toBeVisible();
  });

  test("Verify that Sales People section is visible", async ({
    page,
    categoryPage,
    carPage,
  }) => {
    await categoryPage.car1().click({ force: true });
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight / 2),
    );
    await carPage.salesPeopleTitle().scrollIntoViewIfNeeded();
    await expect(carPage.salesPeopleTitle()).toBeVisible();
    await carPage.salesPeopleSection().scrollIntoViewIfNeeded();
    await expect(carPage.salesPeopleSection()).toBeVisible();
    await carPage.salesPeopleFirst().scrollIntoViewIfNeeded();
    await expect(carPage.salesPeopleFirst()).toBeVisible();
  });
});
