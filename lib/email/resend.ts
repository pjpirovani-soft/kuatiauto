// lib/email/resend.ts
// Cliente de email con fallback mock. Sin RESEND_API_KEY: no llama a red.
// Interfaz estable: sendEmail({ to, subject, html, text?, idempotencyKey }).

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  idempotencyKey: string;
};

export type SendEmailResult =
  | { ok: true; id: string; mock: boolean }
  | { ok: false; error: string; mock: boolean };

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function getApiKey(): string | undefined {
  const k = process.env.RESEND_API_KEY;
  return k && k.trim().length > 0 ? k.trim() : undefined;
}

function getFrom(): string {
  return process.env.RESEND_FROM?.trim() || "KuatiAuto <no-reply@kuatiauto.local>";
}

function mockId(idempotencyKey: string): string {
  const hash = Array.from(idempotencyKey).reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return `mock-${hash.toString(16).padStart(8, "0")}`;
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.info("[email:mock] sendEmail", {
      to: input.to,
      subject: input.subject,
      idempotencyKey: input.idempotencyKey,
    });
    return { ok: true, id: mockId(input.idempotencyKey), mock: true };
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": input.idempotencyKey,
      },
      body: JSON.stringify({
        from: getFrom(),
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, error: `Resend ${res.status}: ${body.slice(0, 200)}`, mock: false };
    }

    const json = (await res.json()) as { id?: string };
    return { ok: true, id: json.id ?? "(sin id)", mock: false };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `Resend fetch: ${msg}`, mock: false };
  }
}