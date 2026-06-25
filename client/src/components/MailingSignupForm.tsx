// src/components/MailingSignupForm.tsx
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { MailingListDto, MailingListField, SubscribePayload, MailingContactDto } from "@/lib/constants";

interface MailingSignupFormProps {
  slug: string;
  extraFields?: MailingListField[];
}

type ApiErrors = Record<string, string[]>;

export default function MailingSignupForm({ slug, extraFields = [] }: MailingSignupFormProps) {
  const listQuery = useQuery<MailingListDto>({
    queryKey: ["/mailing-lists", slug],
  });

  const [form, setForm] = useState<SubscribePayload>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    fields: extraFields.reduce<Record<string, string>>((acc, f) => ({ ...acc, [f.name]: "" }), {}),
  });

  const subscribeMutation = useMutation<MailingContactDto, Error & { errors?: ApiErrors }, SubscribePayload>({
    mutationFn: async (payload) => {
      const res = await apiRequest("POST", `/mailing-lists/${slug}/subscribe`, payload);
      const json = await res.json();
      return json.data as MailingContactDto;
    },
  });

  const handleChange = (key: keyof Omit<SubscribePayload, "fields">, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleFieldChange = (name: string, value: string) =>
    setForm((prev) => ({ ...prev, fields: { ...prev.fields, [name]: value } }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    subscribeMutation.mutate(form);
  };

  if (listQuery.isLoading) {
    return <p className="text-center text-sm text-gray-500">Loading…</p>;
  }

  if (listQuery.isError || !listQuery.data?.is_active) {
    return <p className="text-center text-sm text-red-600">This mailing list is unavailable.</p>;
  }

  if (subscribeMutation.isSuccess) {
    return (
      <div className="max-w-md mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center">
        <p className="text-emerald-700 font-medium">You're subscribed! 🎉</p>
      </div>
    );
  }

  const errors = subscribeMutation.error?.errors ?? {};

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white shadow-sm border border-gray-200 rounded-2xl p-6 space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-900">{listQuery.data.name}</h2>
      {listQuery.data.description && (
        <p className="text-sm text-gray-500">{listQuery.data.description}</p>
      )}

      <Field
        label="First name"
        value={form.first_name}
        onChange={(v) => handleChange("first_name", v)}
        error={errors.first_name}
        required
      />
      <Field
        label="Last name"
        value={form.last_name ?? ""}
        onChange={(v) => handleChange("last_name", v)}
        error={errors.last_name}
      />
      <Field
        label="Email"
        type="email"
        value={form.email}
        onChange={(v) => handleChange("email", v)}
        error={errors.email}
        required
      />
      <Field
        label="Phone"
        value={form.phone ?? ""}
        onChange={(v) => handleChange("phone", v)}
        error={errors.phone}
      />

      {extraFields.map((f) => (
        <Field
          key={f.name}
          label={f.label}
          type={f.type ?? "text"}
          value={form.fields?.[f.name] ?? ""}
          onChange={(v) => handleFieldChange(f.name, v)}
          error={errors[`fields.${f.name}`]}
          required={f.required}
        />
      ))}

      <button
        type="submit"
        disabled={subscribeMutation.isPending}
        className="w-full rounded-xl bg-indigo-600 text-white font-medium py-2.5 hover:bg-indigo-700 disabled:opacity-50 transition"
      >
        {subscribeMutation.isPending ? "Submitting…" : "Subscribe"}
      </button>

      {subscribeMutation.isError && Object.keys(errors).length === 0 && (
        <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string[];
  type?: string;
  required?: boolean;
}

function Field({ label, value, onChange, error, type = "text", required }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          error ? "border-red-400" : "border-gray-300"
        }`}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error[0]}</p>}
    </div>
  );
}