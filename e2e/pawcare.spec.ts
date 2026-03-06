import { test, expect } from "@playwright/test";

// ===================================================================
// 20 E2E tests — all UI-only, no backend login required
// ===================================================================

// ---------- Landing Page (3 tests) ----------

test("1 - Landing page loads with PawCare branding", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("PawCare").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Get Started" })).toBeVisible();
});

test("2 - Landing page has navigation links", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "About" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign In" })).toBeVisible();
});

test("3 - Landing page Get Started navigates to register", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Get Started" }).click();
  await page.waitForURL(/\/register/, { timeout: 10000 });
  await expect(page).toHaveURL(/\/register/);
});

// ---------- Login Page (5 tests) ----------

test("4 - Login page renders form fields", async ({ page }) => {
  await page.goto("/login");
  await expect(page.locator("#email")).toBeVisible();
  await expect(page.locator("#password")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
});

test("5 - Login page has role toggle buttons", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("button", { name: /Pet Owner/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Provider/i })).toBeVisible();
});

test("6 - Login shows validation error for empty email", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page.getByText("Please enter a valid email")).toBeVisible({ timeout: 5000 });
});

test("7 - Login shows validation error for short password", async ({ page }) => {
  await page.goto("/login");
  await page.locator("#email").fill("test@example.com");
  await page.locator("#password").fill("short");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page.getByText("Password must be of 8 characters")).toBeVisible({ timeout: 5000 });
});

test("8 - Login has forgot password link", async ({ page }) => {
  await page.goto("/login");
  const link = page.getByRole("link", { name: /Forgot password/i });
  await expect(link).toBeVisible();
  await link.click();
  await page.waitForURL(/\/forget-password/, { timeout: 10000 });
  await expect(page).toHaveURL(/\/forget-password/);
});

// ---------- Register Page (6 tests) ----------

test("9 - Register page renders user form fields", async ({ page }) => {
  await page.goto("/register");
  await expect(page.locator("#Firstname")).toBeVisible();
  await expect(page.locator("#Lastname")).toBeVisible();
  await expect(page.locator("#email")).toBeVisible();
  await expect(page.locator("#phoneNumber")).toBeVisible();
  await expect(page.locator("#password")).toBeVisible();
  await expect(page.locator("#confirmPassword")).toBeVisible();
});

test("10 - Register page has Create Account button", async ({ page }) => {
  await page.goto("/register");
  await expect(page.getByRole("button", { name: "Create Account" })).toBeVisible();
});

test("11 - Register page toggles to provider form", async ({ page }) => {
  await page.goto("/register");
  await page.getByRole("button", { name: /Provider/i }).click();
  await expect(page.locator("#businessName")).toBeVisible();
  await expect(page.locator("#address")).toBeVisible();
  await expect(page.locator("#providerEmail")).toBeVisible();
  await expect(page.locator("#providerPassword")).toBeVisible();
  await expect(page.locator("#providerConfirmPassword")).toBeVisible();
});

test("12 - Register page toggles back to user form", async ({ page }) => {
  await page.goto("/register");
  await page.getByRole("button", { name: /Provider/i }).click();
  await expect(page.locator("#businessName")).toBeVisible();
  await page.getByRole("button", { name: /Pet Owner/i }).click();
  await expect(page.locator("#Firstname")).toBeVisible();
});

test("13 - Register shows validation error for empty form", async ({ page }) => {
  await page.goto("/register");
  await page.getByRole("button", { name: "Create Account" }).click();
  // Zod outputs "Invalid name" for empty first/last name
  await expect(page.getByText("Invalid name").first()).toBeVisible({ timeout: 5000 });
});

test("14 - Register shows password mismatch error", async ({ page }) => {
  await page.goto("/register");
  await page.locator("#Firstname").fill("Test");
  await page.locator("#Lastname").fill("User");
  await page.locator("#email").fill("test@example.com");
  await page.locator("#phoneNumber").fill("1234567890");
  await page.locator("#password").fill("password123");
  await page.locator("#confirmPassword").fill("different123");
  await page.getByRole("button", { name: "Create Account" }).click();
  await expect(page.getByText("Please match the passwords...")).toBeVisible({ timeout: 5000 });
});

// ---------- Navigation to Public Pages (3 tests) ----------

test("15 - About page loads", async ({ page }) => {
  await page.goto("/about");
  await expect(page).toHaveURL(/\/about/);
  const body = await page.textContent("body");
  expect(body!.length).toBeGreaterThan(0);
});

test("16 - Services public page loads", async ({ page }) => {
  await page.goto("/services");
  await expect(page).toHaveURL(/\/services/);
  const body = await page.textContent("body");
  expect(body!.length).toBeGreaterThan(0);
});

test("17 - Announcements page loads", async ({ page }) => {
  await page.goto("/announcements");
  await expect(page).toHaveURL(/\/announcements/);
  const body = await page.textContent("body");
  expect(body!.length).toBeGreaterThan(0);
});

// ---------- Auth Guard & 404 (2 tests) ----------

test("18 - Unauthenticated user redirected to login", async ({ page }) => {
  await page.goto("/user/home");
  await page.waitForURL(/\/login/, { timeout: 15000 });
  await expect(page).toHaveURL(/\/login/);
});

test("19 - 404 page shows for unknown route", async ({ page }) => {
  await page.goto("/completely-unknown-page-xyz");
  await expect(page.getByText("Error 404")).toBeVisible({ timeout: 10000 });
});

// ---------- Forgot Password Page (1 test) ----------

test("20 - Forgot password page renders email form", async ({ page }) => {
  await page.goto("/forget-password");
  await expect(page).toHaveURL(/\/forget-password/);
  await expect(page.locator('input[type="email"], #email')).toBeVisible();
});
