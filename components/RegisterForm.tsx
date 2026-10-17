"use client";

import { useActionState, useRef, useState } from "react";
import { submitRegistration } from "@/lib/actions/registration";
import { initialRegistrationState } from "@/lib/registration-form";
import type { Dictionary, ErrorCode, Locale } from "@/lib/i18n";
import { MAX_CHILDREN } from "@/lib/validation";

type TextField =
  | "parentName"
  | "address"
  | "postalCode"
  | "city"
  | "phone"
  | "email"
  | "notes";

type ChildRow = {
  id: number;
  fullName: string;
  birthDate: string;
  gender: "" | "male" | "female";
};

const emptyValues: Record<TextField, string> = {
  parentName: "",
  address: "",
  postalCode: "",
  city: "",
  phone: "",
  email: "",
  notes: "",
};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-base text-foreground outline-none transition placeholder:text-foreground/35 focus:border-brand focus:ring-2 focus:ring-brand/20";
const inputErrorClass =
  "border-red-400 focus:border-red-500 focus:ring-red-200";
const labelClass = "block text-sm font-medium text-navy";

export default function RegisterForm({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const [attempt, setAttempt] = useState(0);
  return (
    <RegistrationFields
      key={attempt}
      dict={dict}
      locale={locale}
      onReset={() => setAttempt((value) => value + 1)}
    />
  );
}

function RegistrationFields({
  dict,
  locale,
  onReset,
}: {
  dict: Dictionary;
  locale: Locale;
  onReset: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    submitRegistration,
    initialRegistrationState
  );
  const [values, setValues] =
    useState<Record<TextField, string>>(emptyValues);
  const [rows, setRows] = useState<ChildRow[]>([
    { id: 1, fullName: "", birthDate: "", gender: "" },
  ]);
  const nextRowId = useRef(2);
  const [consent, setConsent] = useState({
    regulationsAccepted: false,
    attendanceCommitment: false,
  });

  const messages = dict.register.errors;

  function errorText(code?: ErrorCode) {
    return code ? messages[code] : undefined;
  }

  function setValue(field: TextField, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
  }

  function updateRow(id: number, patch: Partial<ChildRow>) {
    setRows((previous) =>
      previous.map((row) => (row.id === id ? { ...row, ...patch } : row))
    );
  }

  function addRow() {
    if (rows.length >= MAX_CHILDREN) return;
    setRows((previous) => [
      ...previous,
      { id: nextRowId.current++, fullName: "", birthDate: "", gender: "" },
    ]);
  }

  function removeRow(id: number) {
    setRows((previous) =>
      previous.length <= 1 ? previous : previous.filter((row) => row.id !== id)
    );
  }

  if (state.status === "success") {
    return (
      <div className="rounded-3xl border border-brand/20 bg-white p-8 text-center sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-2xl text-brand-dark">
          ✓
        </div>
        <h2 className="mt-5 text-2xl font-bold text-navy">
          {dict.register.success.title}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-foreground/70">
          {dict.register.success.message}
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-7 inline-flex items-center rounded-full bg-brand px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-dark"
        >
          {dict.register.success.again}
        </button>
      </div>
    );
  }

  const formError = errorText(state.fieldErrors.form);

  return (
    <form action={formAction} noValidate className="space-y-8">
      <input type="hidden" name="locale" value={locale} />
      {/* Honeypot: hidden from humans, filled only by bots. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {formError ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {formError}
        </p>
      ) : null}

      {/* Parent details */}
      <fieldset className="rounded-3xl border border-black/5 bg-white p-6 sm:p-8">
        <legend className="px-1 text-lg font-semibold text-navy">
          {dict.register.sectionParent}
        </legend>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className={labelClass}>{dict.register.fields.parentName}</span>
            <input
              type="text"
              name="parentName"
              value={values.parentName}
              onChange={(event) => setValue("parentName", event.target.value)}
              placeholder={dict.register.fields.parentNamePh}
              autoComplete="name"
              aria-invalid={Boolean(state.fieldErrors.parentName)}
              className={`${inputClass} ${
                state.fieldErrors.parentName ? inputErrorClass : ""
              }`}
            />
            {errorText(state.fieldErrors.parentName) ? (
              <span className="mt-1 block text-sm text-red-600">
                {errorText(state.fieldErrors.parentName)}
              </span>
            ) : null}
          </label>

          <label>
            <span className={labelClass}>{dict.register.fields.phone}</span>
            <input
              type="tel"
              name="phone"
              value={values.phone}
              onChange={(event) => setValue("phone", event.target.value)}
              placeholder={dict.register.fields.phonePh}
              autoComplete="tel"
              dir="ltr"
              aria-invalid={Boolean(state.fieldErrors.phone)}
              className={`${inputClass} ${
                state.fieldErrors.phone ? inputErrorClass : ""
              }`}
            />
            {errorText(state.fieldErrors.phone) ? (
              <span className="mt-1 block text-sm text-red-600">
                {errorText(state.fieldErrors.phone)}
              </span>
            ) : null}
          </label>

          <label>
            <span className={labelClass}>{dict.register.fields.email}</span>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={(event) => setValue("email", event.target.value)}
              placeholder={dict.register.fields.emailPh}
              autoComplete="email"
              dir="ltr"
              aria-invalid={Boolean(state.fieldErrors.email)}
              className={`${inputClass} ${
                state.fieldErrors.email ? inputErrorClass : ""
              }`}
            />
            {errorText(state.fieldErrors.email) ? (
              <span className="mt-1 block text-sm text-red-600">
                {errorText(state.fieldErrors.email)}
              </span>
            ) : null}
          </label>
        </div>
      </fieldset>

      {/* Address */}
      <fieldset className="rounded-3xl border border-black/5 bg-white p-6 sm:p-8">
        <legend className="px-1 text-lg font-semibold text-navy">
          {dict.register.sectionAddress}
        </legend>
        <div className="mt-5 grid gap-5 sm:grid-cols-6">
          <label className="sm:col-span-4">
            <span className={labelClass}>{dict.register.fields.address}</span>
            <input
              type="text"
              name="address"
              value={values.address}
              onChange={(event) => setValue("address", event.target.value)}
              placeholder={dict.register.fields.addressPh}
              autoComplete="street-address"
              aria-invalid={Boolean(state.fieldErrors.address)}
              className={`${inputClass} ${
                state.fieldErrors.address ? inputErrorClass : ""
              }`}
            />
            {errorText(state.fieldErrors.address) ? (
              <span className="mt-1 block text-sm text-red-600">
                {errorText(state.fieldErrors.address)}
              </span>
            ) : null}
          </label>

          <label className="sm:col-span-2">
            <span className={labelClass}>
              {dict.register.fields.postalCode}
            </span>
            <input
              type="text"
              name="postalCode"
              value={values.postalCode}
              onChange={(event) => setValue("postalCode", event.target.value)}
              placeholder={dict.register.fields.postalCodePh}
              autoComplete="postal-code"
              dir="ltr"
              aria-invalid={Boolean(state.fieldErrors.postalCode)}
              className={`${inputClass} ${
                state.fieldErrors.postalCode ? inputErrorClass : ""
              }`}
            />
            {errorText(state.fieldErrors.postalCode) ? (
              <span className="mt-1 block text-sm text-red-600">
                {errorText(state.fieldErrors.postalCode)}
              </span>
            ) : null}
          </label>

          <label className="sm:col-span-3">
            <span className={labelClass}>{dict.register.fields.city}</span>
            <input
              type="text"
              name="city"
              value={values.city}
              onChange={(event) => setValue("city", event.target.value)}
              placeholder={dict.register.fields.cityPh}
              autoComplete="address-level2"
              aria-invalid={Boolean(state.fieldErrors.city)}
              className={`${inputClass} ${
                state.fieldErrors.city ? inputErrorClass : ""
              }`}
            />
            {errorText(state.fieldErrors.city) ? (
              <span className="mt-1 block text-sm text-red-600">
                {errorText(state.fieldErrors.city)}
              </span>
            ) : null}
          </label>
        </div>
      </fieldset>

      {/* Children */}
      <fieldset className="rounded-3xl border border-black/5 bg-white p-6 sm:p-8">
        <legend className="px-1 text-lg font-semibold text-navy">
          {dict.register.sectionChildren}
        </legend>
        <p className="mt-2 text-sm text-foreground/60">
          {dict.register.subtitle}
        </p>

        {state.fieldErrors.children ? (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
            {errorText(state.fieldErrors.children)}
          </p>
        ) : null}

        <div className="mt-5 space-y-5">
          {rows.map((row, index) => {
            const childErrors = state.childErrors[index] ?? {};
            return (
              <div
                key={row.id}
                className="rounded-2xl border border-black/5 bg-background p-4 sm:p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-navy">
                    {dict.register.childNumber} {index + 1}
                  </p>
                  {rows.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className="rounded-full px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
                    >
                      {dict.register.removeChild}
                    </button>
                  ) : null}
                </div>

                <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <label className="sm:col-span-2 lg:col-span-1">
                    <span className={labelClass}>
                      {dict.register.fields.childName}
                    </span>
                    <input
                      type="text"
                      name="child_name"
                      value={row.fullName}
                      onChange={(event) =>
                        updateRow(row.id, { fullName: event.target.value })
                      }
                      placeholder={dict.register.fields.childNamePh}
                      aria-invalid={Boolean(childErrors.fullName)}
                      className={`${inputClass} ${
                        childErrors.fullName ? inputErrorClass : ""
                      }`}
                    />
                    {errorText(childErrors.fullName) ? (
                      <span className="mt-1 block text-sm text-red-600">
                        {errorText(childErrors.fullName)}
                      </span>
                    ) : null}
                  </label>

                  <label>
                    <span className={labelClass}>
                      {dict.register.fields.birthDate}
                    </span>
                    <input
                      type="date"
                      name="child_birth_date"
                      value={row.birthDate}
                      onChange={(event) =>
                        updateRow(row.id, { birthDate: event.target.value })
                      }
                      aria-invalid={Boolean(childErrors.birthDate)}
                      className={`${inputClass} ${
                        childErrors.birthDate ? inputErrorClass : ""
                      }`}
                    />
                    {errorText(childErrors.birthDate) ? (
                      <span className="mt-1 block text-sm text-red-600">
                        {errorText(childErrors.birthDate)}
                      </span>
                    ) : null}
                  </label>

                  <label>
                    <span className={labelClass}>
                      {dict.register.fields.gender}
                    </span>
                    <select
                      name="child_gender"
                      value={row.gender}
                      onChange={(event) =>
                        updateRow(row.id, {
                          gender: event.target.value as ChildRow["gender"],
                        })
                      }
                      aria-invalid={Boolean(childErrors.gender)}
                      className={`${inputClass} ${
                        childErrors.gender ? inputErrorClass : ""
                      }`}
                    >
                      <option value="">—</option>
                      <option value="male">
                        {dict.register.fields.genderMale}
                      </option>
                      <option value="female">
                        {dict.register.fields.genderFemale}
                      </option>
                    </select>
                    {errorText(childErrors.gender) ? (
                      <span className="mt-1 block text-sm text-red-600">
                        {errorText(childErrors.gender)}
                      </span>
                    ) : null}
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        {rows.length < MAX_CHILDREN ? (
          <button
            type="button"
            onClick={addRow}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand/10"
          >
            + {dict.register.addChild}
          </button>
        ) : null}
      </fieldset>

      {/* Notes + consent */}
      <fieldset className="rounded-3xl border border-black/5 bg-white p-6 sm:p-8">
        <legend className="px-1 text-lg font-semibold text-navy">
          {dict.register.sectionConsent}
        </legend>

        <label className="mt-5 block">
          <span className={labelClass}>{dict.register.fields.notes}</span>
          <textarea
            name="notes"
            rows={3}
            value={values.notes}
            onChange={(event) => setValue("notes", event.target.value)}
            placeholder={dict.register.fields.notesPh}
            className={`${inputClass} ${
              state.fieldErrors.notes ? inputErrorClass : ""
            }`}
          />
          {errorText(state.fieldErrors.notes) ? (
            <span className="mt-1 block text-sm text-red-600">
              {errorText(state.fieldErrors.notes)}
            </span>
          ) : null}
        </label>

        <div className="mt-6 space-y-4">
          <div>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="regulationsAccepted"
                checked={consent.regulationsAccepted}
                onChange={(event) =>
                  setConsent((previous) => ({
                    ...previous,
                    regulationsAccepted: event.target.checked,
                  }))
                }
                className="mt-0.5 h-5 w-5 shrink-0 rounded border-black/20 text-brand accent-brand"
              />
              <span className="text-sm leading-relaxed text-foreground/80">
                {dict.register.consentRegulations}
              </span>
            </label>
            {errorText(state.fieldErrors.regulationsAccepted) ? (
              <p className="mt-1 text-sm text-red-600">
                {errorText(state.fieldErrors.regulationsAccepted)}
              </p>
            ) : null}
          </div>

          <div>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="attendanceCommitment"
                checked={consent.attendanceCommitment}
                onChange={(event) =>
                  setConsent((previous) => ({
                    ...previous,
                    attendanceCommitment: event.target.checked,
                  }))
                }
                className="mt-0.5 h-5 w-5 shrink-0 rounded border-black/20 text-brand accent-brand"
              />
              <span className="text-sm leading-relaxed text-foreground/80">
                {dict.register.consentAttendance}
              </span>
            </label>
            {errorText(state.fieldErrors.attendanceCommitment) ? (
              <p className="mt-1 text-sm text-red-600">
                {errorText(state.fieldErrors.attendanceCommitment)}
              </p>
            ) : null}
          </div>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-foreground/50">
          {dict.register.privacy}
        </p>

        <button
          type="submit"
          disabled={pending}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {pending ? dict.register.submitting : dict.register.submit}
        </button>
      </fieldset>
    </form>
  );
}
