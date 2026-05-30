# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: team-invite-flow.spec.ts >> Critical Path 2: Team Invite Flow >> Login → Invite team member → Verify invite sent and member appears
- Location: e2e/team-invite-flow.spec.ts:95:3

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
                        - generic [ref=e14]: 27m
                        - generic [ref=e15]: ":"
                        - generic [ref=e16]: 37s
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
  1   | import { test, expect } from "@playwright/test";
  2   |
  3   | /**
  4   |  * Critical Path 2: Team Invite Flow
  5   |  *
  6   |  * All backend calls are stubbed via page.route so no real SMTP,
  7   |  * MySQL, or Redis is required. The flow exercises:
  8   |  *   1. Login (stubbed) → redirect to dashboard
  9   |  *   2. Navigate to /team → view team page
  10  |  *   3. Invite a team member → verify UI updates
  11  |  *   4. Verify the invited member appears in the member list
  12  |  */
  13  | test.describe("Critical Path 2: Team Invite Flow", () => {
  14  |   test.beforeEach(async ({ page }) => {
  15  |     // Seed a session cookie so the app treats us as authenticated
  16  |     await page.context().addCookies([
  17  |       {
  18  |         name: "dp_session",
  19  |         value: "test-session-inviter",
  20  |         url: "http://localhost:3000",
  21  |       },
  22  |     ]);
  23  |
  24  |     // Stub tRPC responses
  25  |     await page.route("**/api/trpc/**", async route => {
  26  |       const url = route.request().url();
  27  |       const json = (data: unknown) => ({ result: { data } });
  28  |
  29  |       if (url.includes("auth.me")) {
  30  |         return route.fulfill({
  31  |           status: 200,
  32  |           body: JSON.stringify(
  33  |             json({
  34  |               id: 1,
  35  |               email: "inviter@example.com",
  36  |               name: "Inviter User",
  37  |               plan: "pro",
  38  |             })
  39  |           ),
  40  |           contentType: "application/json",
  41  |         });
  42  |       }
  43  |
  44  |       if (url.includes("auth.login")) {
  45  |         return route.fulfill({
  46  |           status: 200,
  47  |           body: JSON.stringify(
  48  |             json({
  49  |               id: 1,
  50  |               email: "inviter@example.com",
  51  |               name: "Inviter User",
  52  |             })
  53  |           ),
  54  |           contentType: "application/json",
  55  |         });
  56  |       }
  57  |
  58  |       if (url.includes("team.list")) {
  59  |         return route.fulfill({
  60  |           status: 200,
  61  |           body: JSON.stringify(
  62  |             json({
  63  |               members: [
  64  |                 {
  65  |                   id: "m1",
  66  |                   email: "inviter@example.com",
  67  |                   role: "admin",
  68  |                   status: "active",
  69  |                 },
  70  |               ],
  71  |             })
  72  |           ),
  73  |           contentType: "application/json",
  74  |         });
  75  |       }
  76  |
  77  |       if (url.includes("team.invite")) {
  78  |         return route.fulfill({
  79  |           status: 200,
  80  |           body: JSON.stringify(
  81  |             json({
  82  |               success: true,
  83  |               memberId: "m2",
  84  |             })
  85  |           ),
  86  |           contentType: "application/json",
  87  |         });
  88  |       }
  89  |
  90  |       // Let other requests pass through
  91  |       return route.continue();
  92  |     });
  93  |   });
  94  |
  95  |   test("Login → Invite team member → Verify invite sent and member appears", async ({
  96  |     page,
  97  |   }) => {
  98  |     // Step 1: Login
  99  |     await page.goto("/login");
> 100 |     await page.getByLabel(/email/i).fill("inviter@example.com");
      |                                     ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  101 |     await page.getByLabel(/password/i).fill("password123");
  102 |     await page
  103 |       .getByRole("button", { name: /login|sign in/i, exact: false })
  104 |       .click();
  105 |
  106 |     // With stubbed login the app should push to /dashboard
  107 |     await expect(page).toHaveURL(/.*dashboard.*/, { timeout: 10_000 });
  108 |
  109 |     // Step 2: Navigate to team page
  110 |     await page.goto("/team");
  111 |     await expect(
  112 |       page.getByRole("heading", { name: /team/i })
  113 |     ).toBeVisible();
  114 |
  115 |     // Verify the invite form is present
  116 |     await expect(page.getByLabel(/email/i)).toBeVisible();
  117 |     await expect(
  118 |       page.getByRole("button", { name: /send invite/i })
  119 |     ).toBeVisible();
  120 |
  121 |     // Step 3: Fill invite form and send
  122 |     await page.getByLabel(/email/i).fill("invitee@example.com");
  123 |     await page.getByRole("button", { name: /send invite/i }).click();
  124 |
  125 |     // Step 4: Verify the invited member appears in the list
  126 |     // After invite, the team.list query is invalidated and re-fetched.
  127 |     // Our stub always returns the inviter, but the UI clears the email
  128 |     // input on successful invite — assert that as proof the mutation ran.
  129 |     await expect(page.getByLabel(/email/i)).toHaveValue("", { timeout: 5_000 });
  130 |   });
  131 |
  132 |   test("team page route does not 500 when unauthenticated", async ({
  133 |     page,
  134 |   }) => {
  135 |     const response = await page.goto("/team");
  136 |     expect(response).toBeTruthy();
  137 |     expect(response!.status()).toBeLessThan(500);
  138 |   });
  139 | });
  140 |
```
