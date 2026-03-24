import { Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly errorMessage: Locator;
  readonly welcomeMessage: Locator;

  constructor(private page: Page) {
    this.errorMessage = this.page
      .getByRole("region", { name: "Notifications (F8)" })
      .getByRole("status");
    this.welcomeMessage = this.page.getByRole("heading", {
      name: "Hi Adam, welcome to MySaka",
    });
  }
}
