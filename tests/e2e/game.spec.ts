import { expect, test, type Page } from "@playwright/test";
import { seedCards } from "../../src/data/seed";

const API = "**/api/cards/random**";

const truthHalf = (page: Page) => page.locator('.card-half[data-type="truth"]');
const dareHalf = (page: Page) => page.locator('.card-half[data-type="dare"]');
const truthText = (page: Page) => truthHalf(page).locator(".card-text");
const dareText = (page: Page) => dareHalf(page).locator(".card-text");

async function startGame(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Rút bài" }).click();
  await expect(truthHalf(page)).toBeVisible();
}

function trackConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

test("draws a card with both halves blurred, then reveals each half independently", async ({ page }) => {
  const errors = trackConsoleErrors(page);
  await startGame(page);

  await expect(truthHalf(page)).toHaveAttribute("data-revealed", "false");
  await expect(dareHalf(page)).toHaveAttribute("data-revealed", "false");
  await expect(truthText(page)).toHaveCSS("filter", /blur/);
  await expect(dareText(page)).toHaveCSS("filter", /blur/);
  await expect(truthHalf(page)).toContainText("Chạm để lật");

  await truthHalf(page).click();
  await expect(truthHalf(page)).toHaveAttribute("data-revealed", "true");
  await expect(truthText(page)).toHaveCSS("filter", "none");
  await expect(dareHalf(page)).toHaveAttribute("data-revealed", "false");
  await expect(dareText(page)).toHaveCSS("filter", /blur/);

  await dareHalf(page).click();
  await expect(dareHalf(page)).toHaveAttribute("data-revealed", "true");
  await expect(dareText(page)).toHaveCSS("filter", "none");
  await expect(truthHalf(page)).toHaveAttribute("data-revealed", "true");

  expect(errors).toEqual([]);
});

test("new card resets reveal state and shows different content", async ({ page }) => {
  await startGame(page);
  const firstTruth = await truthText(page).textContent();
  await truthHalf(page).click();
  await dareHalf(page).click();

  await page.getByRole("button", { name: "Lá mới" }).click();
  await expect(page.getByText("Lá #2")).toBeVisible();
  await expect(truthHalf(page)).toHaveAttribute("data-revealed", "false");
  await expect(dareHalf(page)).toHaveAttribute("data-revealed", "false");
  expect(await truthText(page).textContent()).not.toBe(firstTruth);
});

test("does not repeat recent cards", async ({ page }) => {
  const truthIds: string[] = [];
  const dareIds: string[] = [];
  page.on("response", async (response) => {
    if (!response.url().includes("/api/cards/random")) return;
    const body = await response.json();
    truthIds.push(body.truth.id);
    dareIds.push(body.dare.id);
  });

  await startGame(page);
  for (let round = 2; round <= 20; round++) {
    await page.getByRole("button", { name: "Lá mới" }).click();
    await expect(page.getByText(`Lá #${round}`)).toBeVisible();
  }

  expect(truthIds).toHaveLength(20);
  expect(new Set(truthIds).size).toBe(20);
  expect(new Set(dareIds).size).toBe(20);
});

test("is fully playable with the keyboard", async ({ page }) => {
  await page.goto("/");
  const start = page.getByRole("button", { name: "Rút bài" });
  await start.focus();
  await page.keyboard.press("Enter");

  // Focus lands on the Truth half once the start button is gone.
  await expect(truthHalf(page)).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(truthHalf(page)).toHaveAttribute("data-revealed", "true");

  await page.keyboard.press("Tab");
  await expect(dareHalf(page)).toBeFocused();
  await page.keyboard.press("Space");
  await expect(dareHalf(page)).toHaveAttribute("data-revealed", "true");

  await page.keyboard.press("Tab");
  const newCard = page.getByRole("button", { name: "Lá mới" });
  await expect(newCard).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Lá #2")).toBeVisible();
  await expect(truthHalf(page)).toHaveAttribute("data-revealed", "false");
});

test("exposes hidden/revealed state to assistive tech", async ({ page }) => {
  await startGame(page);
  await expect(page.getByRole("button", { name: /Sự thật \(TRUTH\) — đang ẩn/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Thử thách \(DARE\) — đang ẩn/ })).toBeVisible();

  await truthHalf(page).click();
  const content = (await truthText(page).textContent()) ?? "";
  await expect(page.getByRole("button", { name: `Sự thật (TRUTH): ${content}` })).toBeVisible();
});

test("shows a friendly error and recovers on retry", async ({ page }) => {
  await page.route(API, (route) => route.fulfill({ status: 500, json: { error: "INTERNAL" } }));
  await page.goto("/");
  await page.getByRole("button", { name: "Rút bài" }).click();

  await expect(page.getByRole("alert").filter({ hasText: "Úi! Không rút được bài." })).toBeVisible();
  await expect(page.getByText(/stack|Error:/)).toHaveCount(0);

  await page.unroute(API);
  await page.getByRole("button", { name: "Thử lại" }).click();
  await expect(truthHalf(page)).toBeVisible();
});

test("shows the empty state when no cards match", async ({ page }) => {
  await page.route(API, (route) => route.fulfill({ status: 404, json: { error: "EMPTY" } }));
  await page.goto("/");
  await page.getByRole("button", { name: "Rút bài" }).click();

  await expect(page.getByText("Hết bài phù hợp rồi.")).toBeVisible();
  await page.getByRole("button", { name: "Về màn hình chính", exact: true }).click();
  await expect(page.getByRole("button", { name: "Rút bài" })).toBeVisible();
});

test("refresh returns to the start screen without errors", async ({ page }) => {
  const errors = trackConsoleErrors(page);
  await startGame(page);
  await page.reload();
  await expect(page.getByRole("button", { name: "Rút bài" })).toBeVisible();
  await startGame(page);
  expect(errors).toEqual([]);
});

const modeCheckbox = (page: Page, label: string) => page.locator(".mode-option").filter({ hasText: label });
const applyButton = (page: Page) => page.getByRole("button", { name: /Áp dụng/ });

/** Opens the picker and leaves exactly `labels` checked (unchecks everything else first). */
async function selectModes(page: Page, labels: string[]) {
  await page.locator(".mode-pill, [aria-label*='Chế độ chơi']").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  for (const info of await page.locator(".mode-option").all()) {
    const label = (await info.locator(".mode-option-label").textContent())?.trim() ?? "";
    const shouldBeChecked = labels.includes(label);
    if ((await info.getAttribute("aria-checked")) !== String(shouldBeChecked)) await info.click();
  }
}

test("checkboxes toggle independently and Apply is disabled with nothing selected", async ({ page }) => {
  await page.goto("/");
  await page.locator(".mode-pill").click();

  const defaultBox = modeCheckbox(page, "Mặc định");
  await expect(defaultBox).toHaveAttribute("aria-checked", "true");

  await defaultBox.click();
  await expect(defaultBox).toHaveAttribute("aria-checked", "false");
  await expect(applyButton(page)).toBeDisabled();

  await modeCheckbox(page, "Couple Mode").click();
  await expect(applyButton(page)).toBeEnabled();
});

test("switches to Couple mode with no level step — it always mixes every stage", async ({ page }) => {
  await page.goto("/");
  await selectModes(page, ["Couple Mode"]);
  await applyButton(page).click();
  // Couple Mode has no level picker: Apply closes the sheet immediately.
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.locator(".mode-pill")).toContainText("Couple Mode");
  await expect(page.locator(".mode-pill")).not.toContainText("·");

  await page.getByRole("button", { name: "Rút bài" }).click();
  await expect(truthHalf(page)).toBeVisible();
  await truthHalf(page).click();
  await expect(truthText(page)).toHaveCSS("filter", "none");
});

test("a single leveled mode (Dark Mode) can mix all its levels instead of picking one", async ({ page }) => {
  await page.goto("/");
  // Picking Dark Mode for the first time always hits the 18+ gate first.
  await selectModes(page, ["Dark Mode"]);
  await expect(page.getByText("Xác nhận độ tuổi")).toBeVisible();
  await page.getByRole("button", { name: "Tôi đã đủ 18 tuổi, tiếp tục" }).click();
  await applyButton(page).click();
  await page.locator(".level-option").filter({ hasText: "Tất cả cấp độ" }).click();
  await expect(page.locator(".mode-pill")).toContainText("Dark Mode · Tất cả cấp độ");

  await page.getByRole("button", { name: "Rút bài" }).click();
  await expect(truthHalf(page)).toBeVisible();
});

test("selecting several modes at once skips the level step and mixes them", async ({ page }) => {
  await page.goto("/");
  await selectModes(page, ["Mặc định", "Couple Mode"]);
  await applyButton(page).click();
  // Two modes selected → no single mode to show levels for, applies immediately.
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.locator(".mode-pill")).toContainText("Mặc định + Couple Mode");

  await page.getByRole("button", { name: "Rút bài" }).click();
  await expect(truthHalf(page)).toBeVisible();
});

test("Dark Mode requires an 18+ confirmation before it can be used", async ({ page }) => {
  await page.goto("/");
  await page.locator(".mode-pill").click();
  await modeCheckbox(page, "Mặc định").click(); // uncheck the initial default selection
  await modeCheckbox(page, "Dark Mode").click();

  // Consent gate appears first; backing out must not silently check Dark Mode.
  await expect(page.getByText("Xác nhận độ tuổi")).toBeVisible();
  await page.getByRole("button", { name: "Quay lại", exact: true }).click();
  await expect(modeCheckbox(page, "Dark Mode")).toHaveAttribute("aria-checked", "false");
  await page.getByRole("button", { name: "Đóng" }).click();
  await expect(page.locator(".mode-pill")).toContainText("Mặc định");

  // Confirming consent checks the box and unlocks the level picker; the choice sticks afterwards.
  await selectModes(page, ["Dark Mode"]);
  await page.getByRole("button", { name: "Tôi đã đủ 18 tuổi, tiếp tục" }).click();
  await expect(modeCheckbox(page, "Dark Mode")).toHaveAttribute("aria-checked", "true");
  await applyButton(page).click();
  await page.locator(".level-option").filter({ hasText: "Tease" }).click();
  await expect(page.locator(".mode-pill")).toContainText("Dark Mode");

  await page.locator(".mode-pill").click();
  await expect(page.getByText("Xác nhận độ tuổi")).toBeHidden();
});

test("switching mode sends the player back to the start screen with the picker usable via keyboard", async ({ page }) => {
  await startGame(page);
  await page.getByRole("button", { name: /Chế độ chơi/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();

  await selectModes(page, ["Couple Mode"]);
  await applyButton(page).click();
  // Couple Mode has no level step, so Apply alone closes the sheet.

  // Back on the start screen for the new mode — the previous card is gone.
  await expect(page.getByRole("button", { name: "Rút bài" })).toBeVisible();
  await expect(truthHalf(page)).toBeHidden();
});

test("sound is off by default and the choice persists", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /Âm thanh/ });
  await expect(toggle).toHaveAttribute("aria-pressed", "false");

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(page.getByRole("button", { name: /Âm thanh/ })).toHaveAttribute("aria-pressed", "true");
});

test("has SEO metadata", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Truth or Dare — Fun Party Game");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "Play Truth or Dare with random questions and challenges.",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
});

const longest = (type: "truth" | "dare") =>
  seedCards
    .filter((card) => card.type === type)
    .reduce((a, b) => (b.content.length > a.content.length ? b : a));

const VIEWPORTS = [
  { width: 320, height: 460 }, // small phone with browser bars
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
  { width: 667, height: 375 }, // phones in landscape
  { width: 844, height: 390 },
  { width: 915, height: 412 },
];

for (const viewport of VIEWPORTS) {
  test(`fits the ${viewport.width}x${viewport.height} viewport with the longest content`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const truth = longest("truth");
    const dare = longest("dare");
    await page.route(API, (route) =>
      route.fulfill({
        json: {
          truth: { ...truth, isActive: undefined, language: undefined },
          dare: { ...dare, isActive: undefined, language: undefined },
          recycled: { truth: false, dare: false },
        },
      }),
    );

    await startGame(page);
    await truthHalf(page).click();
    await dareHalf(page).click();
    // Let reveal transitions settle before measuring.
    await page.waitForTimeout(500);

    const metrics = await page.evaluate(() => {
      const root = document.documentElement;
      const card = document.querySelector(".card-shell")!.getBoundingClientRect();
      const button = [...document.querySelectorAll("button")].find((b) => b.textContent?.includes("Lá mới"))!;
      const bodies = [...document.querySelectorAll<HTMLElement>(".card-body")];
      return {
        horizontalScroll: root.scrollWidth > root.clientWidth,
        verticalScroll: root.scrollHeight > root.clientHeight,
        cardHeight: card.height,
        cardInside: card.left >= 0 && card.right <= root.clientWidth && card.top >= 0 && card.bottom <= root.clientHeight,
        buttonBottom: button.getBoundingClientRect().bottom,
        buttonHeight: button.getBoundingClientRect().height,
        textOverflow: bodies.some((body) => body.scrollHeight > body.clientHeight + 1),
      };
    });

    expect(metrics.horizontalScroll).toBe(false);
    expect(metrics.verticalScroll).toBe(false);
    expect(metrics.cardInside).toBe(true);
    // Guards against the card collapsing to its padding (seen on iOS WebKit).
    expect(metrics.cardHeight).toBeGreaterThan(200);
    expect(metrics.buttonBottom).toBeLessThanOrEqual(viewport.height);
    expect(metrics.buttonHeight).toBeGreaterThanOrEqual(44);
    expect(metrics.textOverflow).toBe(false);
  });
}
