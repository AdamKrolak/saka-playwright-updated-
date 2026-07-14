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
  "saka_exp_assignment_product_card_cta_speech_bubble_vs_direct";

type Variant = "control" | "test";
type LeadChannel = "phone" | "whatsapp";

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
function isLeadEventRequest(request: Request): boolean {
  try {
    const body = JSON.parse(request.postData() ?? "{}");
    return body.eventName === "product_card_lead_event";
  } catch {
    return false;
  }
}

/** Returns true when the request is a `calculator_interaction` analytics call. */
function isCalculatorInteractionRequest(request: Request): boolean {
  try {
    const body = JSON.parse(request.postData() ?? "{}");
    return body.eventName === "calculator_interaction";
  } catch {
    return false;
  }
}

/**
 * Runs the given action, waits for the resulting `product_card_lead_event`
 * request, and asserts a single event fired with the expected lead channel.
 */
async function clickAndAssertLeadEvent(
  page: Page,
  action: () => Promise<void>,
  channel: LeadChannel,
): Promise<void> {
  const capturedLeadRequests: string[] = [];
  const requestListener = (request: Request) => {
    if (isLeadEventRequest(request)) {
      capturedLeadRequests.push(request.postData()!);
    }
  };
  page.on("request", requestListener);

  const leadRequestPromise = page.waitForRequest(isLeadEventRequest);

  await action();
  const leadRequest = await leadRequestPromise;

  // Wait briefly to capture any duplicate events that may fire shortly after
  await page.waitForTimeout(1000);
  page.off("request", requestListener);

  const body = JSON.parse(leadRequest.postData() ?? "{}");

  expect(body.eventName).toBe("product_card_lead_event");
  expect(body.metadata.lead_channel).toBe(channel);
  expect(body.metadata.page_type).toBe("listing");

  expect(
    capturedLeadRequests,
    "Exactly one 'product_card_lead_event' request should fire per action — no duplicates",
  ).toHaveLength(1);
}

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
  test("E2E tests for financing calculator event firing 'calculator_interaction'", async ({
    page,
    homePage,
    carPage,
  }) => {
    await page.goto(
      "https://saka-website-git-feat-sak-153-financing-cal-203c05-saka-finland.vercel.app/en",
    );
    await page.evaluate(() => window.scrollTo(0, 1000));
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
    );

    await carPage.calculatorSlider().click({ force: true });
    await carPage.calculatorSlider().click({ force: true });
    await carPage.calculatorSlider().click({ force: true });
    await carPage.calculatorSlider().click({ force: true });

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
});
