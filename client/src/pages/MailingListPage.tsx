// src/pages/MailingListPage.tsx
import { useParams } from "wouter";
import MailingSignupForm from "@/components/MailingSignupForm";
import type { MailingListField } from "@/types/mailing";

// Define whatever extra fields this particular list's form needs.
// In a more dynamic setup, this could come from the API response itself
// (e.g. the backend returns a `fields` schema alongside the list).
const extraFields: MailingListField[] = [
  { name: "company_name", label: "Company name" },
  { name: "job_title", label: "Job title", required: false },
];

export default function MailingListPage() {
  const { slug } = useParams<{ slug?: string }>();

  if (!slug) {
    // /lists with no slug — show a picker, or redirect, your call
    return <MailingListsIndex />;
  }

  return (
    <div className="py-10">
      <MailingSignupForm slug={slug} extraFields={extraFields} />
    </div>
  );
}

function MailingListsIndex() {
  // see note below on listing all mailing lists
  return <p className="text-center text-sm text-gray-500">Select a mailing list to view.</p>;
}