"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/contact/actions";

const initial: ContactState = { ok: false, message: "" };

const inputClasses =
  "w-full rounded-lg border border-line-strong bg-bg-elevated px-4 py-3 text-ink placeholder:text-ink-faint outline-none transition-colors hover:border-white/25 focus:border-accent";

interface ContactFormProps {
  budgets: string[];
  consent: string;
}

export function ContactForm({ budgets, consent }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(submitContact, initial);

  if (state.ok) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-line bg-bg-raised p-8">
        <span className="eyebrow text-accent-ink">Wysłane</span>
        <p className="lead">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <Field label="Imię i nazwisko" name="name" error={state.errors?.name} required />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="E-mail" name="email" type="email" error={state.errors?.email} required />
        <Field label="Telefon" name="phone" type="tel" />
      </div>

      <Field
        label="Opis projektu"
        name="message"
        textarea
        error={state.errors?.message}
        required
        placeholder="Co chcesz osiągnąć i gdzie ma to zadziałać?"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="budget">Budżet (opcjonalnie)</Label>
          <select id="budget" name="budget" className={inputClasses} defaultValue="">
            <option value="">Wybierz…</option>
            {budgets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <Field label="Termin (opcjonalnie)" name="deadline" placeholder="np. Q3 2026" />
      </div>

      <label className="flex items-start gap-3 text-sm text-ink-dim">
        <input
          type="checkbox"
          name="consent"
          className="mt-1 h-4 w-4 shrink-0 accent-[#6b79ff]"
        />
        <span>{consent}</span>
      </label>
      {state.errors?.consent && (
        <p className="-mt-2 text-sm text-red-400">{state.errors.consent}</p>
      )}

      {state.message && !state.ok && (
        <p className="text-sm text-red-400">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        data-cursor
        className="group mt-2 inline-flex w-fit items-center gap-3 rounded-full bg-ink px-6 py-3 text-sm font-medium text-bg transition-colors hover:bg-accent-ink disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Wysyłanie…" : "Wyślij wiadomość"}
        <span aria-hidden className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </button>
    </form>
  );
}

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-mono text-xs uppercase tracking-[0.2em] text-ink-dim"
    >
      {children}
    </label>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  required?: boolean;
  placeholder?: string;
  error?: string;
}

function Field({
  label,
  name,
  type = "text",
  textarea,
  required,
  placeholder,
  error,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-accent"> *</span>}
      </Label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={5}
          required={required}
          placeholder={placeholder}
          className={inputClasses + " resize-y"}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
