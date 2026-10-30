import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendEmail } from "./resend";

describe("sendEmail", () => {
  const OLD_ENV = { ...process.env };
  const fetchSpy = vi.fn();

  beforeEach(() => {
    process.env = { ...OLD_ENV };
    delete process.env.RESEND_API_KEY;
    delete process.env.RESEND_FROM;
    fetchSpy.mockReset();
    vi.stubGlobal("fetch", fetchSpy);
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = OLD_ENV;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const input = {
    to: "x@example.com",
    subject: "Hola",
    html: "<p>Hola</p>",
    text: "Hola",
    idempotencyKey: "bienvenida:abc:2026-10-30",
  };

  it("sin RESEND_API_KEY: no llama a fetch, retorna mock", async () => {
    const r = await sendEmail(input);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.mock).toBe(true);
      expect(r.id.startsWith("mock-")).toBe(true);
    }
  });

  it("con RESEND_API_KEY y respuesta OK: llama fetch, retorna id real", async () => {
    process.env.RESEND_API_KEY = "re_test_123";
    fetchSpy.mockResolvedValue({
      ok: true,
      json: async () => ({ id: "real-id-abc" }),
    });
    const r = await sendEmail(input);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, opts] = fetchSpy.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect((opts as RequestInit).method).toBe("POST");
    const headers = (opts as RequestInit).headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer re_test_123");
    expect(headers["Idempotency-Key"]).toBe(input.idempotencyKey);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.id).toBe("real-id-abc");
      expect(r.mock).toBe(false);
    }
  });

  it("con RESEND_API_KEY y HTTP no-OK: retorna error", async () => {
    process.env.RESEND_API_KEY = "re_test_123";
    fetchSpy.mockResolvedValue({
      ok: false,
      status: 422,
      text: async () => "invalid from",
    });
    const r = await sendEmail(input);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error).toContain("422");
      expect(r.error).toContain("invalid from");
    }
  });

  it("con RESEND_API_KEY y fetch rechaza: retorna error", async () => {
    process.env.RESEND_API_KEY = "re_test_123";
    fetchSpy.mockRejectedValue(new Error("network down"));
    const r = await sendEmail(input);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("network down");
  });
});