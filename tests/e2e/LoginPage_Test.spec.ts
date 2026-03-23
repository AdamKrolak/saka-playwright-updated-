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
  await page.goto("/en/auth/login");
  await homePage.acceptAllCookies();
});

test.describe("Smoke test for Login Page.", () => {
  test("The user can login to My Account using email", async ({
    page,
    loginPage,
    myAccount,
  }) => {
    await loginPage.verifyLoginpageUrl();
    await loginPage.emailField().fill(process.env.TEST_EMAIL!);
    await loginPage.passwordField().fill(process.env.TEST_PASSWORD!);
    await loginPage.signInEmailButton().click({ force: true });
    await page.waitForTimeout(1000);
    await myAccount.verifyMySakapageUrl();
  });

  test("The user cannot login with invalid email address. An error message is displayed", async ({
    page,
    loginPage,
  }) => {
    await loginPage.verifyLoginpageUrl();
    await loginPage.emailField().fill("adam3krolak@vaimo.com");
    await loginPage.passwordField().fill(process.env.TEST_PASSWORD!);
    await loginPage.signInEmailButton().click({ force: true });
    await page.waitForTimeout(500);
    await expect(loginPage.errorMessage()).toBeVisible();
    await expect(page).not.toHaveURL("https://saka.fi/en/my-saka");
    await loginPage.verifyLoginpageUrl();
  });

  test("The user cannot login with invalid password. An error message is displayed", async ({
    page,
    loginPage,
  }) => {
    await loginPage.verifyLoginpageUrl();
    await loginPage.emailField().fill(process.env.TEST_EMAIL!);
    await loginPage.passwordField().fill("zaq13332WSX");
    await loginPage.signInEmailButton().click({ force: true });
    await page.waitForTimeout(500);
    await expect(loginPage.errorMessage()).toBeVisible();
    await expect(page).not.toHaveURL("https://saka.fi/en/my-saka");
    await loginPage.verifyLoginpageUrl();
  });

  test("Validate reset password page, reset password form is displayed", async ({
    loginPage,
  }) => {
    await loginPage.verifyLoginpageUrl();
    await loginPage.forgotPasswordLink().click({ force: true });
    await expect(loginPage.forgotPasswordForm()).toBeVisible();
    await expect(loginPage.forgotPasswordForm()).toContainText(
      "Forgot Password",
    );
    await expect(loginPage.forgotPasswordForm()).toContainText(
      "Enter your email address and we will send you a link to reset your password.",
    );
    await expect(loginPage.sendEmailBtn()).toBeVisible();
    await expect(loginPage.sendEmailBtn()).toContainText("Send email");
    await expect(loginPage.emailFieldResetPass2()).toBeVisible();
  });

  test("The user can reset the password. Confirmation message is displayed", async ({
    page,
    loginPage,
  }) => {
    await loginPage.verifyLoginpageUrl();
    await loginPage.forgotPasswordLink().click({ force: true });
    await page.waitForURL("**/forgot-password");
    await loginPage.emailFieldResetPass().fill(process.env.TEST_EMAIL!);
    await loginPage.sendEmailBtn().click({ force: true });
    await expect(loginPage.forgotPasswordSuccessMsg()).toBeVisible({
      timeout: 15000,
    });
  });
});
