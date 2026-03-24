import { Page } from "playwright-core";

export async function acceptCookies(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Allow all" }).click();
}
