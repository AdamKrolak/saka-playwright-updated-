import { Page } from "playwright-core";

export async function login(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  await page.getByRole("button", { name: "My Saka" }).click();
  await page.getByRole("link", { name: "Sign in" }).click();
  await page.locator("html").click();
  await page.getByRole("textbox", { name: "Email*" }).fill(email);
  await page.getByRole("textbox", { name: "Password*" }).fill(password);
  await page.getByRole("button", { name: "Sign In Using Email" }).click();
}
