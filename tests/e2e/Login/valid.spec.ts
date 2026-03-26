import { test, expect } from "@playwright/test";
import { userData } from "../../test-data/emailTest.data";
import { acceptCookies } from "../../fixtures/cookies.fixture";
import { login } from "../../fixtures/login.fixture";
import { LoginPage } from "../../pages/login.page";

test.describe("Login with valid credentials", () => {
  let loginPage: LoginPage;
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await page.goto("/en");
    //await acceptCookies(page);
  });
  test("The user is able to login using a valid email and password", async ({
    page,
  }) => {
    // Actions
    await login(page, userData.validEmail, userData.validPassword);
    // Assertion
    await expect(loginPage.errorMessage).not.toBeVisible();
    await expect(page).toHaveURL("/en/my-saka");
    await expect(loginPage.welcomeMessage).toContainText("Adam");
  });
});
