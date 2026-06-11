/**
 * Cloudflare Pages Function — Next Call Self-Assessment lead notification.
 * Route: POST /api/assessment-submit
 *
 * Receives the assessment payload from the page form, formats a readable
 * email, and sends it to contact@decisive.finance via Resend.
 *
 * The Reply-To header is set to the prospect's email so when Russ hits
 * Reply in his inbox, the reply goes directly to the prospect. Path A in
 * one click.
 *
 * Environment variables (Cloudflare Pages > Settings > Variables):
 *   RESEND_API_KEY         required. Get one at resend.com.
 *   NOTIFY_TO              optional, default "contact@decisive.finance".
 *   NOTIFY_FROM            optional, default "Decisive Finance <noreply@decisive.finance>".
 *
 * Resend domain setup: verify decisive.finance in Resend (3 DNS records in
 * Cloudflare DNS) before this Function will succeed.
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await safeJson(request);
    if (!data || !data.email) {
      return jsonResponse({ ok: false, error: "missing payload" }, 400);
    }

    const NOTIFY_TO = env.NOTIFY_TO || "contact@decisive.finance";
    const NOTIFY_FROM = env.NOTIFY_FROM || "Decisive Finance <noreply@decisive.finance>";

    if (!env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return jsonResponse({ ok: false, error: "email service not configured" }, 500);
    }

    const subject =
      data._subject ||
      `Next Call Self-Assessment · ${data.tier_chip || data.tier || "unscored"} · ${data.company || "(no company)"}`;

    const text = formatEmailBody(data);
    const html = formatEmailHtml(data);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: [NOTIFY_TO],
        reply_to: data.email,
        subject,
        text,
        html,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Resend error:", res.status, errBody);
      return jsonResponse({ ok: false, error: "send failed" }, 502);
    }

    return jsonResponse({ ok: true });
  } catch (err) {
    console.error("assessment-submit error:", err);
    return jsonResponse({ ok: false, error: "internal" }, 500);
  }
}

/* ---------- helpers ---------- */

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function safeJson(req) {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

function fmtMoney(n) {
  if (n == null || isNaN(n)) return "·";
  if (Math.abs(n) >= 1_000_000) return "$" + (n / 1_000_000).toFixed(1) + "M";
  if (Math.abs(n) >= 1_000) return "$" + Math.round(n / 1000) + "K";
  return "$" + Math.round(n);
}

function formatEmailBody(d) {
  const m = d.metrics || {};
  const i = d.inputs || {};
  const lines = [];

  lines.push("NEW NEXT CALL SELF-ASSESSMENT SUBMISSION");
  lines.push("=".repeat(50));
  lines.push("");
  lines.push(`Name:     ${d.name || "·"}`);
  lines.push(`Company:  ${d.company || "·"}`);
  lines.push(`Email:    ${d.email || "·"}  (click Reply to respond)`);
  lines.push("");
  lines.push(`Tier:     ${d.tier_chip || d.tier || "·"}`);
  lines.push(`DRI:      ${d.wdi != null ? d.wdi : "·"} / 100`);
  lines.push("");

  lines.push("METRICS");
  lines.push("-".repeat(50));
  lines.push(`  Runway:        ${m.runwayMo != null ? m.runwayMo.toFixed(1) + " mo" : "·"}`);
  lines.push(`  Burn multiple: ${m.burnMultiple != null ? m.burnMultiple.toFixed(2) + "x" : "·"}`);
  lines.push(`  Rule of 40:    ${m.rule40 != null ? Math.round(m.rule40) + "%" : "·"}`);
  lines.push(`  ARR / FTE:     ${m.arrPerFTE != null ? "$" + Math.round(m.arrPerFTE / 1000) + "K" : "·"}`);
  lines.push(`  Trapped value: ${fmtMoney(m.trappedLo)} to ${fmtMoney(m.trappedHi)}`);
  lines.push("");

  lines.push("INPUTS");
  lines.push("-".repeat(50));
  lines.push(`  Stage:                ${i.stage || "·"}`);
  lines.push(`  ARR band:             ${i.arrBand || "·"}`);
  lines.push(`  Monthly burn:         ${fmtMoney(i.burnMo)}`);
  lines.push(`  Cash on hand:         ${fmtMoney(i.cash)}`);
  lines.push(`  YoY growth:           ${i.growthYoY != null ? i.growthYoY + "%" : "·"}`);
  lines.push(`  NDR:                  ${i.ndrTrack === "no" ? "not tracked" : (i.ndr != null ? i.ndr + "%" : "·")}`);
  lines.push(`  Revenue model:        ${i.revenueModel || "·"}`);
  lines.push(`  Headcount total:      ${i.hcTotal != null ? i.hcTotal : "·"}`);
  lines.push(`  Headcount GTM:        ${i.hcGTM != null ? i.hcGTM : "(not provided)"}`);
  lines.push(`  Months since close:   ${i.monthsSinceClose != null ? i.monthsSinceClose : "·"}`);
  lines.push(`  Raise status:         ${i.raiseStatus || "·"}`);
  lines.push("");

  const acts = i.activities || {};
  const done = Object.keys(acts).filter((k) => acts[k]);
  const missed = Object.keys(acts).filter((k) => !acts[k]);
  lines.push(`  Activities done:      ${done.length ? done.join(", ") : "(none)"}`);
  lines.push(`  Activities missing:   ${missed.length ? missed.join(", ") : "(none)"}`);
  lines.push("");

  lines.push(`Source:    ${d.source || "assessment/next-call"}`);
  lines.push(`Submitted: ${d.submitted_at || "·"}`);
  lines.push("");
  lines.push("Reply directly to this email to respond to the prospect.");

  return lines.join("\n");
}

function formatEmailHtml(d) {
  const text = formatEmailBody(d);
  // Cheap-and-cheerful HTML wrap so the mail client renders monospaced.
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<pre style="font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:13px;line-height:1.55;color:#182228;background:#f7f9fa;border-radius:8px;padding:18px 20px;white-space:pre-wrap">${escaped}</pre>`;
}

/* CORS preflight — same-origin in production but harmless if added */
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
