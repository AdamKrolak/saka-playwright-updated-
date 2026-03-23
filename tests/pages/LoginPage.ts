import { type Page, type Locator, expect } from "@playwright/test";

export class LoginPage {
  constructor(private page: Page) {}

  async verifyLoginpageUrl(): Promise<void> {
    await expect(this.page).toHaveURL(/\/en\/auth\/login/);
  }

  loginBanner(): Locator {
    return this.page.locator("section.max-w-fit");
  }
  sakaLogo(): Locator {
    return this.page
      .locator("section.max-w-fit")
      .getByRole("link", { name: "Saka" })
      .locator("img");
  }

  emailField(): Locator {
    return this.page.locator('form.w-full.space-y-6 input[name="email"]');
  }
  passwordField(): Locator {
    return this.page.locator('form.w-full.space-y-6 input[name="password"]');
  }

  signInEmailButton(): Locator {
    return this.page.getByRole("button", { name: "Sign In Using Email" });
  }
  signInGoogleButton(): Locator {
    return this.page.getByRole("button", { name: "Sign In using Google" });
  }

  errorMessage(): Locator {
    return this.page.locator('li[role="status"]').filter({ hasText: /error/i });
  }
  forgotPasswordLink(): Locator {
    return this.page.getByRole("link", { name: "Forgot password?" });
  }
  forgotPasswordForm(): Locator {
    return this.page.locator("section.max-w-\\[400px\\]");
  }
  sendEmailBtn(): Locator {
    return this.page.getByRole("button", { name: "Send email" });
  }

  emailFieldResetPass(): Locator {
    return this.page.locator('form.w-full.space-y-6 input[name="email"]');
  }
  emailFieldResetPass2(): Locator {
    return this.page.locator('form.w-full.space-y-6 input[name="email"]');
  }
  forgotPasswordSuccessMsg(): Locator {
    return this.page.getByText(
      "We have sent you an email with instructions to reset your password.",
    );
  }
}
