"use server";

export interface ContactState {
  ok: boolean;
  message: string;
  errors?: Partial<Record<"name" | "email" | "message" | "consent", string>>;
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Contact form handler. Validates on the server and (for now) logs the
 * enquiry. To actually receive messages, plug in an email provider where
 * marked below and set the env vars from `.env.example`.
 */
export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const budget = String(formData.get("budget") ?? "").trim();
  const deadline = String(formData.get("deadline") ?? "").trim();
  const consent = formData.get("consent") === "on";

  const errors: ContactState["errors"] = {};
  if (name.length < 2) errors.name = "Podaj imię i nazwisko.";
  if (!EMAIL_RE.test(email)) errors.email = "Podaj poprawny adres e-mail.";
  if (message.length < 10) errors.message = "Napisz kilka słów o projekcie.";
  if (!consent) errors.consent = "Zgoda jest wymagana, żebyśmy mogli odpowiedzieć.";

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      message: "Sprawdź zaznaczone pola i spróbuj ponownie.",
      errors,
    };
  }

  // ── Deliver the message ──────────────────────────────────────────────
  // Plug in an email provider here, e.g. Resend:
  //   import { Resend } from "resend";
  //   const resend = new Resend(process.env.RESEND_API_KEY);
  //   await resend.emails.send({
  //     to: process.env.CONTACT_TO_EMAIL!, from: "web@ctrlstudio.pl",
  //     subject: `Nowe zapytanie: ${name}`, replyTo: email,
  //     text: `${name} <${email}> ${phone}\nBudżet: ${budget}\nTermin: ${deadline}\n\n${message}`,
  //   });
  // Until then we log on the server so nothing is lost during development.
  console.info("[contact] new enquiry", {
    name,
    email,
    phone,
    budget,
    deadline,
    message,
  });

  return {
    ok: true,
    message: "Dziękujemy! Odezwiemy się najszybciej, jak to możliwe.",
  };
}
