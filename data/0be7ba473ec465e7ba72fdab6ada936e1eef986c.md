# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: critical-journey.spec.ts >> Critical Journey: signup → scan → results >> login with existing credentials works
- Location: e2e/critical-journey.spec.ts:67:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByLabel(/email/i)

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
    - generic [ref=e2]:
        - link "🔒 RakshEx Launch Week — India's First AI Runtime Governance Platform → Launch countdown" [ref=e4] [cursor=pointer]:
            - /url: /changelog
            - generic [ref=e5]:
                - paragraph [ref=e6]: 🔒 RakshEx Launch Week — India's First AI Runtime Governance Platform →
                - generic "Launch countdown" [ref=e7]:
                    - generic [ref=e8]: "Launch in:"
                    - generic [ref=e9]:
                        - generic [ref=e10]: 15d
                        - generic [ref=e11]: ":"
                        - generic [ref=e12]: 17h
                        - generic [ref=e13]: ":"
                        - generic [ref=e14]: 29m
                        - generic [ref=e15]: ":"
                        - generic [ref=e16]: 55s
        - navigation [ref=e17]:
            - generic [ref=e18]:
                - generic [ref=e19]:
                    - link "RakshEx" [ref=e20] [cursor=pointer]:
                        - /url: /
                        - generic [ref=e21]:
                            - img [ref=e22]
                            - generic [ref=e24]: RakshEx
                    - generic [ref=e25]:
                        - generic [ref=e27] [cursor=pointer]:
                            - text: Products
                            - img [ref=e28]
                        - generic [ref=e31] [cursor=pointer]:
                            - text: Compare
                            - img [ref=e32]
                        - generic [ref=e35] [cursor=pointer]:
                            - text: Resources
                            - img [ref=e36]
                - generic [ref=e38]:
                    - link "Sign In" [ref=e39] [cursor=pointer]:
                        - /url: /login
                    - link "START FREE" [ref=e40] [cursor=pointer]:
                        - /url: /register
    - generic [ref=e42]:
        - generic [ref=e43]:
            - link "Rakshex" [ref=e44] [cursor=pointer]:
                - /url: /
            - paragraph [ref=e45]: Sign in to your account
        - generic [ref=e46]:
            - link "Sign in with Google" [ref=e47] [cursor=pointer]:
                - /url: /api/oauth/google
                - img [ref=e48]
                - text: Sign in with Google
            - generic [ref=e57]: Or continue with email
            - generic [ref=e58]:
                - generic [ref=e59]:
                    - generic [ref=e60]: Email
                    - textbox "your@email.com" [ref=e61]
                - generic [ref=e62]:
                    - generic [ref=e63]: Password
                    - generic [ref=e64]:
                        - textbox "••••••••" [ref=e65]
                        - button "Show password" [ref=e66] [cursor=pointer]:
                            - img [ref=e67]
                - generic [ref=e70]:
                    - generic [ref=e71] [cursor=pointer]:
                        - checkbox "Remember me" [ref=e72]
                        - generic [ref=e73]: Remember me
                    - button "Forgot password?" [ref=e74] [cursor=pointer]
                - button "Sign In" [ref=e75] [cursor=pointer]
            - paragraph [ref=e76]:
                - text: Don't have an account?
                - link "Create one" [ref=e77] [cursor=pointer]:
                    - /url: /register
    - alert [ref=e78]
    - dialog "Cookie notice" [ref=e79]:
        - generic [ref=e80]:
            - paragraph [ref=e81]:
                - text: Rakshex uses strictly necessary first-party cookies for authentication and security. No tracking, no advertising. See our
                - link "Privacy Policy" [ref=e82] [cursor=pointer]:
                    - /url: /privacy
                - text: for details.
            - generic [ref=e83]:
                - link "Learn more" [ref=e84] [cursor=pointer]:
                    - /url: /privacy
                - button "Reject optional" [ref=e85] [cursor=pointer]
                - button "Accept" [ref=e86] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  |
  3  | /**
  4  |  * Critical user journey integration test.
  5  |  *
  6  |  * Exercises the full flow: signup → login → create collection → start scan → view results.
  7  |  * This is the #1 conversion path — if it breaks, we lose users.
  8  |  */
  9  |
  10 | test.describe("Critical Journey: signup → scan → results", () => {
  11 |   const testUser = {
  12 |     name: "E2E Test User",
  13 |     email: `e2e-${Date.now()}@rakshex.test`,
  14 |     password: "TestPassword123!",
  15 |   };
  16 |
  17 |   test("full journey from signup to scan results", async ({ page }) => {
  18 |     // 1. Signup
  19 |     await page.goto("/register");
  20 |     await page.getByLabel(/full name/i).fill(testUser.name);
  21 |     await page.getByLabel(/email/i).fill(testUser.email);
  22 |     await page.getByLabel(/password/i).fill(testUser.password);
  23 |     await page.getByRole("button", { name: /create account/i }).click();
  24 |
  25 |     // Should redirect to dashboard after successful signup
  26 |     await page.waitForURL("/dashboard", { timeout: 10_000 });
  27 |     await expect(page.getByText(/welcome/i)).toBeVisible();
  28 |
  29 |     // 2. Create a collection
  30 |     await page.goto("/collections");
  31 |     await page.getByRole("button", { name: /new collection/i }).click();
  32 |     await page.getByLabel(/name/i).fill("E2E Test Collection");
  33 |     await page.getByLabel(/format/i).selectOption("postman");
  34 |
  35 |     // Paste a minimal Postman collection JSON
  36 |     const minimalCollection = JSON.stringify({
  37 |       info: {
  38 |         name: "Test",
  39 |         schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
  40 |       },
  41 |       item: [
  42 |         {
  43 |           name: "Test Request",
  44 |           request: { method: "GET", url: { raw: "https://api.example.com/test" } },
  45 |         },
  46 |       ],
  47 |     });
  48 |     await page.getByTestId("collection-data-input").fill(minimalCollection);
  49 |     await page.getByRole("button", { name: /create/i }).click();
  50 |
  51 |     // Should show success and redirect to collections list
  52 |     await expect(page.getByText(/collection created/i)).toBeVisible();
  53 |
  54 |     // 3. Start a scan
  55 |     await page.getByRole("button", { name: /scan/i }).first().click();
  56 |     await page.getByLabel(/scan type/i).selectOption("quick");
  57 |     await page.getByRole("button", { name: /start scan/i }).click();
  58 |
  59 |     // Should show scan in progress or queued
  60 |     await expect(page.getByText(/scan (started|queued|in progress)/i)).toBeVisible();
  61 |
  62 |     // 4. View results (may need to wait for scan to complete in CI)
  63 |     await page.goto("/scans");
  64 |     await expect(page.getByText(/e2e test collection/i)).toBeVisible();
  65 |   });
  66 |
  67 |   test("login with existing credentials works", async ({ page }) => {
  68 |     await page.goto("/login");
> 69 |     await page.getByLabel(/email/i).fill(testUser.email);
     |                                     ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  70 |     await page.getByLabel(/password/i).fill(testUser.password);
  71 |     await page.getByRole("button", { name: /sign in/i }).click();
  72 |
  73 |     await page.waitForURL("/dashboard", { timeout: 10_000 });
  74 |     await expect(page.getByText(/welcome/i)).toBeVisible();
  75 |   });
  76 |
  77 |   test("health check endpoint returns healthy status", async ({ request }) => {
  78 |     const response = await request.get("/api/health");
  79 |     expect(response.status()).toBe(200);
  80 |
  81 |     const body = await response.json();
  82 |     expect(body.status).toBe("ok");
  83 |     expect(body.checks).toBeDefined();
  84 |     expect(body.checks.database).toBe("ok");
  85 |     expect(body.checks.redis).toBe("ok");
  86 |     expect(body.checks.memory).toBe("ok");
  87 |     expect(body.memory.heapUsedMB).toBeGreaterThan(0);
  88 |   });
  89 |
  90 |   test("rate-limited MCP registration returns 429", async ({ page, request }) => {
  91 |     // This requires auth; skip if not authenticated in E2E context
  92 |     test.skip(true, "Requires authenticated session — run in authenticated E2E context");
  93 |   });
  94 | });
  95 |
```
