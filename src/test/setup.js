// Runs before every test file: stubs server-only and clears the CMS and EmailJS env vars, so a
// test only sees the fake values it stubs itself and never the real ones from .env.local.
import { beforeEach, vi } from "vitest";

// The real server-only module throws when imported outside a Next.js server build.
vi.mock("server-only", () => ({}));

beforeEach(() => {
  vi.stubEnv("HEADLESS_CMS_API_URL", undefined);
  vi.stubEnv("HEADLESS_CMS_API_KEY", undefined);
  vi.stubEnv("HEADLESS_CMS_WEBHOOK_SECRET", undefined);
  vi.stubEnv("EMAILJS_SERVICE_ID", undefined);
  vi.stubEnv("EMAILJS_TEMPLATE_ID", undefined);
  vi.stubEnv("EMAILJS_PUBLIC_KEY", undefined);
  vi.stubEnv("EMAILJS_PRIVATE_KEY", undefined);
});
