"use client";

import { FormEvent, useId, useState } from "react";
import { CONTACT_EMAIL } from "./contact-info";

const initialForm = {
  name: "",
  email: "",
  organization: "",
  message: "",
};

export function ContactForm() {
  const id = useId();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = `Contato Vozzi - ${form.name || "a ser incluido"}`;
    const body = [
      `Nome: ${form.name || "a ser incluido"}`,
      `Email: ${form.email || "a ser incluido"}`,
      `Organização: ${form.organization || "a ser incluido"}`,
      "",
      "Mensagem:",
      form.message || "a ser incluido",
    ].join("\n");

    setStatus("Abrindo email para envio...");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor={`${id}-name`}>Nome</label>
        <input
          id={`${id}-name`}
          name="name"
          required
          type="text"
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor={`${id}-email`}>Email</label>
        <input
          id={`${id}-email`}
          name="email"
          required
          type="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor={`${id}-organization`}>Organização</label>
        <input
          id={`${id}-organization`}
          name="organization"
          type="text"
          value={form.organization}
          onChange={(event) =>
            updateField("organization", event.target.value)
          }
        />
      </div>

      <div className="form-field">
        <label htmlFor={`${id}-message`}>Mensagem</label>
        <textarea
          id={`${id}-message`}
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
        />
      </div>

      <button className="button button-primary" type="submit">
        Enviar mensagem
        <span aria-hidden="true">→</span>
      </button>
      <p aria-live="polite" className="form-status">
        {status}
      </p>
    </form>
  );
}
