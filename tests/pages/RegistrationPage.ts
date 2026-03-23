import { type Page, type Locator, expect } from "@playwright/test";

export class RegistrationPage {
  constructor(private page: Page) {}

  async verifyRegPageUrl(): Promise<void> {
    await expect(this.page).toHaveURL(/\/auth\/(register|rekisteroidy)/);
  }

  pageTitle(): Locator {
    return this.page.getByRole("heading", { level: 1 });
  }
  signUpForm(): Locator {
    return this.page.locator("form.w-full.space-y-6");
  }
  sakaLogo(): Locator {
    return this.page
      .locator("section.max-w-fit")
      .getByRole("link", { name: "Saka" })
      .locator("img");
  }

  emailField(): Locator {
    return this.page.locator("form.w-full.space-y-6 input[type='text']");
  }
  createPasswordField(): Locator {
    return this.page
      .locator("form.w-full.space-y-6 input[type='password']")
      .first();
  }
  confirmPasswordField(): Locator {
    return this.page
      .locator("form.w-full.space-y-6 input[type='password']")
      .nth(1);
  }

  sendVerificationButton(): Locator {
    return this.page.locator("form.w-full.space-y-6 button[type='submit']");
  }
  signInGoogleButton(): Locator {
    return this.page.locator("form.w-full.space-y-6 button[type='button']");
  }
  errorMessage(): Locator {
    return this.page.locator(".max-h-screen > .group");
  }
}
