import { test, expect } from "@playwright/test";
import { userData } from "../../test-data/emailTest.data";
import { messages } from "../../test-data/messages.data";
import { acceptCookies } from "../../fixtures/cookies.fixture";
import { login } from "../../fixtures/login.fixture";
import { LoginPage } from "../../pages/login.page";

test.describe("Login with invalid credentials, an error message is displayed", () => {
  let loginPage: LoginPage;
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await page.goto("/en");
    await acceptCookies(page);
  });

  test("The user is not able to login using an invalid email, an error message is displayed", async ({
    page,
  }) => {
    // Actions
    await login(page, userData.invalidEmail, userData.validPassword);
    // Assertion
    await expect(loginPage.errorMessage).toContainText(messages.loginError);
  });

  test("The user is not able to login using an invalid password, an error message is displayed", async ({
    page,
  }) => {
    // Actions
    await login(page, userData.validEmail, userData.invalidPassword);

    // Assertion
    await expect(loginPage.errorMessage).toContainText(messages.loginError);
  });
});
