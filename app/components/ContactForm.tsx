"use client";

import { useId, useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { site, whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "./icons";

// Campos iguais aos do formulário original: nome, e-mail, telefone, mensagem.
// PENDÊNCIA: destino do envio. Por ora abre o WhatsApp com a mensagem preenchida.

// Assuntos: serviços reais da empresa (ver CLAUDE.md).
const SUBJECTS = [
  "Película automotiva",
  "Película arquitetônica",
  "Som e acessórios",
  "Envelopamento",
  "Outro",
] as const;
type Subject = (typeof SUBJECTS)[number];

type FieldName = "nome" | "telefone" | "email" | "mensagem";
type Values = Record<FieldName, string>;
type Errors = Partial<Record<FieldName, string>>;

const MESSAGE_MAX = 600;

const EMPTY: Values = { nome: "", telefone: "", email: "", mensagem: "" };

/** Máscara leve: (24) 98816-7547 ou (24) 2243-3449. Aceita só dígitos, até 11. */
function maskPhone(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function validateField(name: FieldName, value: string): string | undefined {
  const v = value.trim();
  switch (name) {
    case "nome":
      if (!v) return "Informe seu nome.";
      if (v.length < 2) return "Nome muito curto.";
      return;
    case "telefone": {
      const digits = v.replace(/\D/g, "");
      if (!digits) return "Informe um telefone com DDD.";
      if (digits.length < 10) return "Telefone incompleto. Use DDD + número.";
      return;
    }
    case "email":
      if (!v) return "Informe seu e-mail.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "E-mail inválido.";
      return;
    case "mensagem":
      if (!v) return "Conte o que você precisa.";
      if (v.length > MESSAGE_MAX) return `Máximo de ${MESSAGE_MAX} caracteres.`;
      return;
  }
}

export function ContactForm() {
  const reduce = useReducedMotion();
  const uid = useId();

  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [subject, setSubject] = useState<Subject | null>(null);
  const [status, setStatus] = useState<"idle" | "opening" | "sent">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const name = e.target.name as FieldName;
    let value = e.target.value;
    if (name === "telefone") value = maskPhone(value);
    if (name === "mensagem") value = value.slice(0, MESSAGE_MAX);
    setValues((v) => ({ ...v, [name]: value }));
    // Revalida em tempo real só depois do primeiro blur, pra não gritar cedo demais.
    if (touched[name]) setErrors((er) => ({ ...er, [name]: validateField(name, value) }));
    if (status === "sent") setStatus("idle");
  }

  function onBlur(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const name = e.target.name as FieldName;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((er) => ({ ...er, [name]: validateField(name, e.target.value) }));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: Errors = {};
    (Object.keys(values) as FieldName[]).forEach((k) => {
      const err = validateField(k, values[k]);
      if (err) next[k] = err;
    });
    setErrors(next);
    setTouched({ nome: true, telefone: true, email: true, mensagem: true });

    const firstInvalid = (Object.keys(next) as FieldName[])[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    const text = [
      `Olá! Vim pelo site da ${site.shortName}.`,
      subject ? `Assunto: ${subject}` : null,
      `Nome: ${values.nome.trim()}`,
      `E-mail: ${values.email.trim()}`,
      `Telefone: ${values.telefone}`,
      "",
      values.mensagem.trim(),
    ]
      .filter((l): l is string => l !== null)
      .join("\n");

    setStatus("opening");
    window.setTimeout(
      () => {
        window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
        setStatus("sent");
      },
      reduce ? 0 : 450,
    );
  }

  // `hidden` é fixo (sem ramificar por reduced-motion) para o HTML do servidor
  // bater com o do cliente; o <MotionConfig reducedMotion="user"> global cuida do resto.
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } },
  };

  const opening = status === "opening";

  return (
    <motion.form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      variants={stagger}
      initial="hidden"
      animate="show"
      className="grid gap-9"
      aria-describedby={`${uid}-status`}
    >
      {/* Assunto */}
      <motion.fieldset variants={item} className="m-0 min-w-0 border-0 p-0">
        <legend className="eyebrow mb-3 block">Assunto</legend>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Assunto">
          {SUBJECTS.map((s) => {
            const active = subject === s;
            return (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSubject(active ? null : s)}
                className={[
                  "relative isolate min-h-11 rounded-full border px-4 py-2 text-sm transition-[color,border-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                  active
                    ? "border-red text-white"
                    : "border-line-strong text-fg-2 hover:border-fg-3 hover:text-fg",
                ].join(" ")}
              >
                {active && (
                  <motion.span
                    layoutId={`${uid}-chip`}
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-full bg-red"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                {s}
              </button>
            );
          })}
        </div>
      </motion.fieldset>

      <div className="grid gap-9 sm:grid-cols-2">
        <Field
          variants={item}
          uid={uid}
          name="nome"
          label="Nome"
          value={values.nome}
          error={touched.nome ? errors.nome : undefined}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete="name"
        />
        <Field
          variants={item}
          uid={uid}
          name="telefone"
          label="Telefone"
          type="tel"
          inputMode="tel"
          placeholder="(24) 9 0000-0000"
          value={values.telefone}
          error={touched.telefone ? errors.telefone : undefined}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete="tel"
        />
      </div>

      <Field
        variants={item}
        uid={uid}
        name="email"
        label="E-mail"
        type="email"
        inputMode="email"
        value={values.email}
        error={touched.email ? errors.email : undefined}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete="email"
      />

      <Field
        variants={item}
        uid={uid}
        name="mensagem"
        label="Mensagem"
        multiline
        value={values.mensagem}
        error={touched.mensagem ? errors.mensagem : undefined}
        onChange={onChange}
        onBlur={onBlur}
        hint={
          <span
            className={[
              "tabular-nums transition-colors",
              values.mensagem.length >= MESSAGE_MAX ? "text-red-2" : "text-fg-3",
            ].join(" ")}
            aria-live="polite"
          >
            {values.mensagem.length}/{MESSAGE_MAX}
          </span>
        }
      />

      {/* Ação */}
      <motion.div variants={item} className="grid gap-4">
        <motion.button
          type="submit"
          disabled={opening}
          whileHover={reduce || opening ? undefined : { y: -2 }}
          whileTap={reduce || opening ? undefined : { scale: 0.98 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          aria-busy={opening}
          className={[
            "group relative isolate inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-4 sm:w-auto sm:min-w-72",
            "font-display text-lg font-semibold uppercase tracking-[0.14em] text-white",
            "bg-red transition-colors duration-300 hover:bg-red-2 disabled:cursor-wait",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          ].join(" ")}
        >
          {/* brilho que atravessa no hover */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/3 -z-10 w-1/3 -skew-x-12 bg-white/15 opacity-0 transition-[transform,opacity] duration-700 ease-out group-hover:translate-x-[400%] group-hover:opacity-100 motion-reduce:hidden"
          />
          <AnimatePresence mode="wait" initial={false}>
            {opening ? (
              <motion.span
                key="opening"
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center gap-3"
              >
                <span
                  aria-hidden
                  className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                />
                Abrindo WhatsApp…
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center gap-3"
              >
                <WhatsAppIcon className="size-5 transition-transform duration-300 group-hover:-rotate-12" />
                Enviar pelo WhatsApp
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <p id={`${uid}-status`} role="status" aria-live="polite" className="min-h-5 text-sm text-fg-2">
          <AnimatePresence mode="wait">
            {status === "sent" ? (
              <motion.span
                key="sent"
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="inline-flex flex-wrap items-center gap-x-1.5"
              >
                <span aria-hidden className="inline-block size-1.5 rounded-full bg-[#25D366]" />
                Abrimos o WhatsApp com sua mensagem. Se não abriu, chame direto em{" "}
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg underline underline-offset-4 hover:text-red-2"
                >
                  {site.whatsapp.label}
                </a>
                .
              </motion.span>
            ) : (
              <motion.span key="idle" initial={false} exit={{ opacity: 0 }} className="text-fg-3">
                Sem cadastro, sem espera: a mensagem vai direto pro nosso WhatsApp.
              </motion.span>
            )}
          </AnimatePresence>
        </p>
      </motion.div>
    </motion.form>
  );
}

/* ---------- Campo ---------- */

type FieldProps = {
  uid: string;
  name: FieldName;
  label: string;
  value: string;
  error?: string;
  hint?: React.ReactNode;
  multiline?: boolean;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
  autoComplete?: string;
  variants: React.ComponentProps<typeof motion.div>["variants"];
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

function Field({
  uid,
  name,
  label,
  value,
  error,
  hint,
  multiline,
  type = "text",
  inputMode,
  placeholder,
  autoComplete,
  variants,
  onChange,
  onBlur,
}: FieldProps) {
  const reduce = useReducedMotion();
  const [focused, setFocused] = useState(false);
  const id = `${uid}-${name}`;
  const errId = `${id}-err`;
  const invalid = Boolean(error);
  const filled = value.length > 0;
  const raised = focused || filled;

  const common = {
    id,
    name,
    value,
    onChange,
    onBlur: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFocused(false);
      onBlur(e);
    },
    onFocus: () => setFocused(true),
    "aria-invalid": invalid || undefined,
    "aria-describedby": invalid ? errId : undefined,
    autoComplete,
    // placeholder só aparece com o label já flutuando, senão os dois se sobrepõem
    placeholder: focused ? placeholder : undefined,
    className: [
      "peer block w-full min-w-0 bg-transparent px-0 pt-6 pb-3 text-[1.0625rem] text-fg",
      "placeholder:text-fg-3/70 outline-none caret-red-2",
      multiline ? "min-h-36 resize-y leading-relaxed" : "",
    ].join(" "),
  };

  return (
    <motion.div variants={variants} className="relative min-w-0">
      <div className="relative">
        {multiline ? <textarea {...common} rows={5} /> : <input {...common} type={type} inputMode={inputMode} />}

        {/* Label flutuante */}
        <label
          htmlFor={id}
          className={[
            "pointer-events-none absolute left-0 origin-left font-display uppercase transition-all duration-300 ease-out",
            raised
              ? "top-0 translate-y-0 text-[0.7rem] tracking-[0.22em]"
              : "top-6 -translate-y-0.5 text-lg tracking-[0.04em]",
            invalid ? "text-red-2" : focused ? "text-fg" : "text-fg-3",
          ].join(" ")}
        >
          {label}
        </label>

        {/* Linha base + linha vermelha que cresce no foco */}
        <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-line-strong" />
        <span
          aria-hidden
          className={[
            "pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left",
            invalid ? "bg-red-2" : "bg-red",
            reduce ? "" : "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            focused || invalid ? "scale-x-100" : "scale-x-0",
          ].join(" ")}
        />
      </div>

      <div className="mt-2 flex min-h-5 items-start justify-between gap-3 text-xs">
        <AnimatePresence initial={false}>
          {invalid && (
            <motion.p
              key="err"
              id={errId}
              initial={reduce ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-red-2"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        {hint && <span className="ml-auto">{hint}</span>}
      </div>
    </motion.div>
  );
}
