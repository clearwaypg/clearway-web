import {Resend} from 'resend';

/* =========================================================
   CLUB ENQUIRY → EMAIL (Resend)

   Server-only route for the five-step "Let us find your player" modal on
   /for-clubs. The form posts here and this handler sends the email, so the
   Resend API key never reaches the browser.

   Everything is configured through environment variables — nothing about the
   account, the sending domain or the destination inbox is hardcoded:
     RESEND_API_KEY  the Resend API key (server only, never NEXT_PUBLIC_*)
     EMAIL_FROM      the From address, on a domain verified in Resend
     EMAIL_TO        where enquiries land (comma-separated for several inboxes)

   While the sending domain is still unverified, Resend rejects the send and
   this route answers 502 with a generic message: the modal shows a friendly
   error and the real reason is written to the server logs.
   ========================================================= */

/* Always run per-request: it reads env vars and posts to a third party. */
export const dynamic = 'force-dynamic';

type EnquiryPayload = {
  club?: unknown;
  region?: unknown;
  profile?: unknown;
  timeline?: unknown;
  name?: unknown;
  email?: unknown;
  locale?: unknown;
};

/* The five steps, in the order the club answered them. The labels travel with
   the email (not with the form) so the inbox always reads in English however
   the site was localised. */
const FIELDS = [
  {key: 'club', label: 'Club'},
  {key: 'region', label: 'Country and league'},
  {key: 'profile', label: 'Player profile'},
  {key: 'timeline', label: 'Timeline'},
  {key: 'name', label: 'Contact name'},
  {key: 'email', label: 'Contact email'}
] as const;

const MAX_LEN = 2000;

/* Accept only strings, trimmed and length-capped, so nothing unbounded or
   unexpected reaches the email body. */
function str(value: unknown): string {
  return typeof value === 'string' ? value.trim().slice(0, MAX_LEN) : '';
}

/* Minimal escaping for the HTML part — answers are free text typed by the
   club and must never be interpreted as markup. */
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const EMPTY = '—';

export async function POST(request: Request) {
  let body: EnquiryPayload;
  try {
    body = (await request.json()) as EnquiryPayload;
  } catch {
    return Response.json({error: 'invalid_body'}, {status: 400});
  }

  const answers = FIELDS.map((f) => ({
    label: f.label,
    value: str(body[f.key])
  }));
  const values = Object.fromEntries(
    FIELDS.map((f) => [f.key, str(body[f.key])])
  ) as Record<(typeof FIELDS)[number]['key'], string>;

  /* Same required fields the modal validates on the client — re-checked here
     because the client can be bypassed. */
  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email);
  if (!values.club || !values.region || !values.name || !emailOk) {
    return Response.json({error: 'invalid_fields'}, {status: 400});
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  /* EMAIL_TO may hold several comma-separated addresses. */
  const to = (process.env.EMAIL_TO ?? '')
    .split(',')
    .map((a) => a.trim())
    .filter(Boolean);

  if (!apiKey || !from || to.length === 0) {
    console.error(
      '[enquiry] Missing email configuration. Set RESEND_API_KEY, EMAIL_FROM and EMAIL_TO.',
      {
        hasApiKey: Boolean(apiKey),
        hasFrom: Boolean(from),
        recipients: to.length
      }
    );
    return Response.json({error: 'not_configured'}, {status: 500});
  }

  const locale = str(body.locale) || 'en';
  const subject = `New Clearway enquiry — ${values.club} (${values.name})`;

  const text = [
    'New enquiry from the Clearway website (For clubs form).',
    '',
    ...answers.map((a) => `${a.label}: ${a.value || EMPTY}`),
    '',
    `Locale: ${locale}`
  ].join('\n');

  const rows = answers
    .map(
      (a) => `<tr>
        <td style="padding:10px 16px;border-bottom:1px solid #e6e8ec;font:600 12px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6b7482;white-space:nowrap;vertical-align:top;">${esc(a.label)}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #e6e8ec;font:400 15px/1.5 Arial,Helvetica,sans-serif;color:#12161c;">${esc(a.value) || EMPTY}</td>
      </tr>`
    )
    .join('');

  const html = `<div style="background:#f3f3f3;padding:24px;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e6e8ec;border-radius:12px;overflow:hidden;">
      <div style="background:#072c68;padding:20px 24px;">
        <div style="font:700 11px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#d0d8e2;">Clearway Performance Group</div>
        <div style="font:700 20px/1.3 Arial,Helvetica,sans-serif;color:#ffffff;margin-top:6px;">New enquiry from the website</div>
      </div>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">${rows}</table>
      <div style="padding:14px 16px;font:400 12px/1.5 Arial,Helvetica,sans-serif;color:#6b7482;">Sent from the “For clubs” form · locale: ${esc(locale)}</div>
    </div>
  </div>`;

  try {
    const resend = new Resend(apiKey);
    const {data, error} = await resend.emails.send({
      from,
      to,
      subject,
      text,
      html,
      /* Replying in the inbox answers the club directly. */
      replyTo: values.email
    });

    if (error) {
      /* Typical while the domain is pending verification — log the real
         reason, hand the client a generic failure. */
      console.error('[enquiry] Resend rejected the send:', error);
      return Response.json({error: 'send_failed'}, {status: 502});
    }

    return Response.json({ok: true, id: data?.id ?? null});
  } catch (err) {
    console.error('[enquiry] Unexpected error sending the enquiry email:', err);
    return Response.json({error: 'send_failed'}, {status: 502});
  }
}
