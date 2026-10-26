import { test, expect } from "@playwright/test";
import type { Page, Route } from "@playwright/test";
import {
  MOCK_TOKENS,
  SUPERVISOR_USER,
  MECHANIC_USER,
  USERS,
  EQUIPMENT_ITEM,
  REPAIR_REQUEST,
  NOTIFICATIONS,
} from "./fixtures";

const API = "https://mock-backend.test";

/** Wires every backend call the dashboard makes to canned, schema-accurate JSON. */
async function mockBackend(page: Page, currentUser: typeof SUPERVISOR_USER | typeof MECHANIC_USER) {
  let request = { ...REPAIR_REQUEST };

  await page.route(`${API}/**`, async (route: Route) => {
    const req = route.request();
    const url = new URL(req.url());
    const path = url.pathname;
    const method = req.method();

    if (path === "/api/v1/auth/login" && method === "POST") {
      return route.fulfill({ json: MOCK_TOKENS });
    }
    if (path === "/api/v1/auth/refresh" && method === "POST") {
      return route.fulfill({ json: MOCK_TOKENS });
    }
    if (path === "/api/v1/auth/me" && method === "GET") {
      return route.fulfill({ json: currentUser });
    }
    if (path === "/api/v1/equipment" && method === "GET") {
      return route.fulfill({ json: [EQUIPMENT_ITEM] });
    }
    if (path === "/api/v1/repair-requests" && method === "GET") {
      return route.fulfill({ json: [request] });
    }
    if (path === `/api/v1/repair-requests/${REPAIR_REQUEST.id}` && method === "GET") {
      return route.fulfill({
        json: { ...request, attachments: [], repair_actions: [], approvals: [], audit_trail: [], total_repair_cost: 0 },
      });
    }
    if (path === "/api/v1/approval-queue" && method === "GET") {
      return route.fulfill({ json: currentUser.role === "supervisor" ? [request] : [] });
    }
    if (path === "/api/v1/users" && method === "GET") {
      return route.fulfill({ json: USERS });
    }
    if (path === "/api/v1/notifications" && method === "GET") {
      return route.fulfill({ json: NOTIFICATIONS });
    }
    if (path === `/api/v1/repair-requests/${REPAIR_REQUEST.id}/supervisor-decision` && method === "POST") {
      request = { ...request, status: "pending_md_approval", updated_at: new Date().toISOString() };
      return route.fulfill({ json: request });
    }

    return route.fulfill({ status: 404, json: { detail: `Unmocked request: ${method} ${path}` } });
  });
}

async function login(page: Page, email: string) {
  await page.goto("/dashboard/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("whatever-password");
  await page.getByRole("button", { name: "Sign In" }).click();
}

test("supervisor can sign in, see the approval queue, and approve a repair request", async ({ page }) => {
  await mockBackend(page, SUPERVISOR_USER);
  await login(page, SUPERVISOR_USER.email);

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: `Welcome, ${SUPERVISOR_USER.full_name.split(" ")[0]}` })).toBeVisible();

  await page.goto("/dashboard/approvals");
  await expect(page.getByText(REPAIR_REQUEST.request_number)).toBeVisible();

  await page.getByText(REPAIR_REQUEST.request_number).click();
  await expect(page).toHaveURL(new RegExp(`/dashboard/repair-requests/${REPAIR_REQUEST.id}`));

  // Approving re-fetches the request's detail, which immediately reflects
  // the new backend status — moving the request past the supervisor's own
  // decision panel (which unmounts once they can no longer act on it) to
  // show "Pending MD Approval" as the new, authoritative status.
  await page.getByRole("button", { name: "Approve Repair" }).click();
  await expect(page.getByText("Pending MD Approval")).toBeVisible();
  await expect(page.getByRole("button", { name: "Approve Repair" })).toHaveCount(0);
});

test("mechanic can sign in and see their dashboard", async ({ page }) => {
  await mockBackend(page, MECHANIC_USER);
  await login(page, MECHANIC_USER.email);

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText(EQUIPMENT_ITEM.name)).toBeVisible();
});

test("a page reload keeps the session (silent refresh) instead of bouncing to login", async ({ page }) => {
  await mockBackend(page, SUPERVISOR_USER);
  await login(page, SUPERVISOR_USER.email);
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.reload();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: `Welcome, ${SUPERVISOR_USER.full_name.split(" ")[0]}` })).toBeVisible();
});
