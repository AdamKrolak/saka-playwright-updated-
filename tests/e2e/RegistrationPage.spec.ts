import { test, expect } from "../fixtures/fixtures";

test.beforeEach(async ({ page, homePage }) => {
  page.on("pageerror", (err) => {
    if (
      err.message.includes("fbq is not defined") ||
      err.message.includes("Cannot read properties of undefined") ||
      err.message.includes("NEXT_REDIRECT")
    ) {
      // Suppress known errors
    }
  });
  await page.goto("/auth/register");
  await homePage.acceptAllCookies();
});

test.describe("Smoke test for Registration Page.", () => {
  test("Verify that Sign Up form and all fields are visible", async ({
    registrationPage,
  }) => {
    await registrationPage.verifyRegPageUrl();
    await expect(registrationPage.pageTitle()).toBeVisible();
    await expect(registrationPage.signUpForm()).toBeVisible();
    await expect(registrationPage.confirmPasswordField()).toBeVisible();
    await expect(registrationPage.createPasswordField()).toBeVisible();
    await expect(registrationPage.sakaLogo()).toBeVisible();
    await expect(registrationPage.sendVerificationButton()).toBeVisible();
    await expect(registrationPage.signInGoogleButton()).toBeVisible();
  });
});
