import { test, expect } from "../fixtures/fixtures";
import type { Page, Request } from "@playwright/test";

test.beforeEach(async ({ page, homePage }) => {
  page.on("pageerror", (err) => {
    if (
      err.message.includes("fbq is not defined") ||
      err.message.includes("Cannot read properties of undefined")
    ) {
      // Suppress known third-party errors
    }
  });
  await homePage.acceptAllCookies();
});

const CARS_URL = "https://saka.fi/en";
const COOKIE_DOMAIN = "saka.fi";
const EXPERIMENT_COOKIE =
  "saka_exp_assignment_sak_153_financing_calculator_redesign_b3_vs_control";

type Variant = "control" | "test";

/**
 * Navigates to the cars listing, sets the experiment assignment cookie to the
 * given variant, reloads, and asserts the cookie was applied.
 */
async function setExperimentVariant(
  page: Page,
  homePage: any,
  variant: Variant,
): Promise<void> {
  await page.goto(CARS_URL, { waitUntil: "domcontentloaded" });

  await page.context().addCookies([
    {
      name: EXPERIMENT_COOKIE,
      value: variant,
      domain: COOKIE_DOMAIN,
      path: "/",
    },
  ]);

  await page.reload({ waitUntil: "domcontentloaded" });

  await homePage.acceptAllCookies();

  const cookies = await page.context().cookies();
  const experimentCookie = cookies.find((c) => c.name === EXPERIMENT_COOKIE);

  expect(
    experimentCookie?.value,
    `Cookie '${EXPERIMENT_COOKIE}' should be set to '${variant}'`,
  ).toBe(variant);
}

/** Returns true when the request is a `product_card_lead_event` analytics call. */
/** Returns true when the request is a `calculator_interaction` analytics call. */
function isCalculatorInteractionRequest(request: Request): boolean {
  try {
    const body = JSON.parse(request.postData() ?? "{}");
    return body.eventName === "calculator_interaction";
  } catch {
    return false;
  }
}

/** Returns true when the request is a `financing_offer_form_submitted` analytics call. */
function isFinancingOfferFormSubmittedRequest(request: Request): boolean {
  try {
    const body = JSON.parse(request.postData() ?? "{}");
    return body.eventName === "financing_offer_form_submitted";
  } catch {
    return false;
  }
}

/**
 * Runs the given action, waits for the resulting `product_card_lead_event`
 * request, and asserts a single event fired with the expected lead channel.
 */

/**
 * Waits for the GTM `carCardCTA` + `gtm.linkClick` events and asserts the
 * `gtm.elementUrl` starts with the expected scheme for the lead channel.
 */
async function assertGtmLinkClick(
  page: Page,
  elementUrlPrefix: string,
): Promise<void> {
  await page.waitForFunction(
    () =>
      (window as any).dataLayer?.some((e: any) => e.event === "carCardCTA") &&
      (window as any).dataLayer?.some((e: any) => e.event === "gtm.linkClick"),
  );

  const dataLayer: any[] = await page.evaluate(
    () => (window as any).dataLayer ?? [],
  );

  const carCardCTAEvent = dataLayer.find((e) => e.event === "carCardCTA");
  expect(
    carCardCTAEvent,
    "carCardCTA event should exist in dataLayer",
  ).toBeTruthy();

  const gtmLinkClickEvent = dataLayer.find((e) => e.event === "gtm.linkClick");
  expect(
    gtmLinkClickEvent,
    "gtm.linkClick event should exist in dataLayer",
  ).toBeTruthy();

  expect(
    typeof gtmLinkClickEvent["gtm.elementUrl"] === "string" &&
      gtmLinkClickEvent["gtm.elementUrl"].startsWith(elementUrlPrefix),
    `gtm.linkClick event should have gtm.elementUrl starting with '${elementUrlPrefix}'`,
  ).toBe(true);
}

test.describe("E2E tests for financing calculator event firing 'calculator_interaction'", () => {
  test("Control variant E2E tests for financing calculator event firing 'calculator_interaction'", async ({
    page,
    homePage,
    carPage,
  }) => {
    await setExperimentVariant(page, homePage, "control");
    await page.evaluate(() => window.scrollTo(0, 1000));
    await homePage.acceptAllCookies();

    await expect(
      homePage.homePageMid().getByRole("region").first().getByRole("heading"),
    ).toBeVisible();
    await homePage.latestCar1().click({ force: true });
    await page
      .locator('[data-test-id="car-finance-calculator-button"]')
      .click({ force: true });
    await page
      .locator('[data-test-id="car-finance-calculator-button"]')
      .click({ force: true });
    // await page
    //   .getByRole("link", { name: "Tesla Model 3" })
    //   .click({ force: true });

    // Capture every calculator_interaction request that fires during the session
    const capturedCalculatorRequests: string[] = [];
    const calculatorRequestListener = (request: Request) => {
      if (isCalculatorInteractionRequest(request)) {
        capturedCalculatorRequests.push(request.postData()!);
      }
    };
    page.on("request", calculatorRequestListener);

    // Set up listener to capture calculator_interaction event
    const calculatorInteractionPromise = page.waitForRequest(
      isCalculatorInteractionRequest,
      { timeout: 15000 },
    );

    // Interact with the financing calculator to trigger the event. A native
    // range <input> does not reliably change value on a plain click, so focus
    // the slider and move it with the keyboard, which fires the change events
    // the app listens to. Moving left then right guarantees a value change
    // regardless of the slider's starting position.
    const slider = carPage.calculatorSlider();
    await slider.scrollIntoViewIfNeeded();
    await slider.focus();
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");

    // Wait for and verify the calculator_interaction event
    const calculatorRequest = await calculatorInteractionPromise;
    const body = JSON.parse(calculatorRequest.postData() ?? "{}");

    expect(body.eventName).toBe("calculator_interaction");

    // Wait briefly to capture any duplicate events that may fire shortly after
    await page.waitForTimeout(1000);
    page.off("request", calculatorRequestListener);

    // Verify the event fired exactly once per session — no duplicates
    expect(
      capturedCalculatorRequests,
      "Exactly one 'calculator_interaction' event should fire per session — no duplicates",
    ).toHaveLength(1);

    console.log("✓ calculator_interaction event fired exactly once");
  });

  test("Test variant E2E tests for financing calculator event firing 'calculator_interaction'", async ({
    page,
    homePage,
    carPage,
  }) => {
    await setExperimentVariant(page, homePage, "test");
    await page.evaluate(() => window.scrollTo(0, 1000));
    await homePage.acceptAllCookies();

    await expect(
      homePage.homePageMid().getByRole("region").first().getByRole("heading"),
    ).toBeVisible();
    await homePage.latestCar1().click({ force: true });
    await page
      .locator('[data-test-id="car-finance-calculator-button"]')
      .click({ force: true });
    await page
      .locator('[data-test-id="car-finance-calculator-button"]')
      .click({ force: true });
    // await page
    //   .getByRole("link", { name: "Tesla Model 3" })
    //   .click({ force: true });

    // Capture every calculator_interaction request that fires during the session
    const capturedCalculatorRequests: string[] = [];
    const calculatorRequestListener = (request: Request) => {
      if (isCalculatorInteractionRequest(request)) {
        capturedCalculatorRequests.push(request.postData()!);
      }
    };
    page.on("request", calculatorRequestListener);

    // Set up listener to capture calculator_interaction event
    const calculatorInteractionPromise = page.waitForRequest(
      isCalculatorInteractionRequest,
      { timeout: 15000 },
    );

    // Interact with the financing calculator to trigger the event. A native
    // range <input> does not reliably change value on a plain click, so focus
    // the slider and move it with the keyboard, which fires the change events
    // the app listens to. Moving left then right guarantees a value change
    // regardless of the slider's starting position.
    const slider = carPage.calculatorSlider();
    await slider.scrollIntoViewIfNeeded();
    await slider.focus();
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");

    // Wait for and verify the calculator_interaction event
    const calculatorRequest = await calculatorInteractionPromise;
    const body = JSON.parse(calculatorRequest.postData() ?? "{}");

    expect(body.eventName).toBe("calculator_interaction");

    // Wait briefly to capture any duplicate events that may fire shortly after
    await page.waitForTimeout(1000);
    page.off("request", calculatorRequestListener);

    // Verify the event fired exactly once per session — no duplicates
    expect(
      capturedCalculatorRequests,
      "Exactly one 'calculator_interaction' event should fire per session — no duplicates",
    ).toHaveLength(1);

    console.log("✓ calculator_interaction event fired exactly once");
  });

  test("Control variant - submit finance form after interacting with calculator, verify financing_offer_submission event", async ({
    page,
    homePage,
    carPage,
  }) => {
    await setExperimentVariant(page, homePage, "control");
    await page.evaluate(() => window.scrollTo(0, 1000));
    await homePage.acceptAllCookies();

    await expect(
      homePage.homePageMid().getByRole("region").first().getByRole("heading"),
    ).toBeVisible();
    await homePage.latestCar1().click({ force: true });
    await page
      .locator('[data-test-id="car-finance-calculator-button"]')
      .click({ force: true });
    await page
      .locator('[data-test-id="car-finance-calculator-button"]')
      .click({ force: true });

    const capturedCalculatorRequests: string[] = [];
    const calculatorRequestListener = (request: Request) => {
      if (isCalculatorInteractionRequest(request)) {
        capturedCalculatorRequests.push(request.postData()!);
      }
    };
    page.on("request", calculatorRequestListener);

    // Set up listener to capture calculator_interaction event
    const calculatorInteractionPromise = page.waitForRequest(
      isCalculatorInteractionRequest,
      { timeout: 15000 },
    );

    const slider = carPage.calculatorSlider();
    await slider.scrollIntoViewIfNeeded();
    await slider.focus();
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");

    await page.waitForTimeout(1000);
    await carPage.sendFinancingRequestButton().click({ force: true });
    await carPage.finaceFormName().fill("Test User");
    await carPage.finaceFormEmail().fill("test@example.com");
    await carPage.finaceFormPhone().fill("+358701740615");
    await carPage.checkboxFinaceForm().check();

    // Capture every financing_offer_form_submitted request that fires
    const capturedSubmitRequests: string[] = [];
    const submitRequestListener = (request: Request) => {
      if (isFinancingOfferFormSubmittedRequest(request)) {
        capturedSubmitRequests.push(request.postData()!);
      }
    };
    page.on("request", submitRequestListener);

    // Set up listener before submitting to capture the submission event
    const submitRequestPromise = page.waitForRequest(
      isFinancingOfferFormSubmittedRequest,
      { timeout: 15000 },
    );

    await carPage.submitFinaceForm().click();

    // Wait for and verify the financing_offer_form_submitted event
    const submitRequest = await submitRequestPromise;
    const submitBody = JSON.parse(submitRequest.postData() ?? "{}");

    expect(submitBody.eventName).toBe("financing_offer_form_submitted");

    // Wait briefly to capture any duplicate events that may fire shortly after
    await page.waitForTimeout(1000);
    page.off("request", submitRequestListener);

    // Verify the event fired exactly once — no duplicates
    expect(
      capturedSubmitRequests,
      "Exactly one 'financing_offer_form_submitted' event should fire — no duplicates",
    ).toHaveLength(1);

    console.log("✓ financing_offer_form_submitted event fired exactly once");
  });

  test("Test variant - submit finance form, verify finance submit event ", async ({
    page,
    homePage,
    carPage,
  }) => {
    await setExperimentVariant(page, homePage, "test");
    await page.evaluate(() => window.scrollTo(0, 1000));
    await homePage.acceptAllCookies();

    await expect(
      homePage.homePageMid().getByRole("region").first().getByRole("heading"),
    ).toBeVisible();
    await homePage.latestCar1().click({ force: true });
    await page
      .locator('[data-test-id="car-finance-calculator-button"]')
      .click({ force: true });
    await page
      .locator('[data-test-id="car-finance-calculator-button"]')
      .click({ force: true });
    // await page
    //   .getByRole("link", { name: "Tesla Model 3" })
    //   .click({ force: true });

    // Capture every calculator_interaction request that fires during the session
    const capturedCalculatorRequests: string[] = [];
    const calculatorRequestListener = (request: Request) => {
      if (isCalculatorInteractionRequest(request)) {
        capturedCalculatorRequests.push(request.postData()!);
      }
    };
    page.on("request", calculatorRequestListener);

    // Set up listener to capture calculator_interaction event
    const calculatorInteractionPromise = page.waitForRequest(
      isCalculatorInteractionRequest,
      { timeout: 15000 },
    );

    // Interact with the financing calculator to trigger the event. A native
    // range <input> does not reliably change value on a plain click, so focus
    // the slider and move it with the keyboard, which fires the change events
    // the app listens to. Moving left then right guarantees a value change
    // regardless of the slider's starting position.
    const slider = carPage.calculatorSlider();
    await slider.scrollIntoViewIfNeeded();
    await slider.focus();
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");

    // Open the financing offer form (b3 variant) and fill it in
    await carPage.applyForFinancingDecisionButton().click();
    await carPage.finaceFormName().fill("Test User");
    await carPage.finaceFormEmail().fill("test@example.com");
    await carPage.finaceFormPhone().fill("+358701740615");
    await carPage.checkboxFinaceForm().check();

    // Capture every financing_offer_form_submitted request that fires
    const capturedSubmitRequests: string[] = [];
    const submitRequestListener = (request: Request) => {
      if (isFinancingOfferFormSubmittedRequest(request)) {
        capturedSubmitRequests.push(request.postData()!);
      }
    };
    page.on("request", submitRequestListener);

    // Set up listener before submitting to capture the submission event
    const submitRequestPromise = page.waitForRequest(
      isFinancingOfferFormSubmittedRequest,
      { timeout: 15000 },
    );

    await carPage.submitFinaceForm().click();

    // Wait for and verify the financing_offer_form_submitted event
    const submitRequest = await submitRequestPromise;
    const submitBody = JSON.parse(submitRequest.postData() ?? "{}");

    expect(submitBody.eventName).toBe("financing_offer_form_submitted");

    // Wait briefly to capture any duplicate events that may fire shortly after
    await page.waitForTimeout(1000);
    page.off("request", submitRequestListener);

    // Verify the event fired exactly once — no duplicates
    expect(
      capturedSubmitRequests,
      "Exactly one 'financing_offer_form_submitted' event should fire — no duplicates",
    ).toHaveLength(1);

    console.log("✓ financing_offer_form_submitted event fired exactly once");
  });
});
