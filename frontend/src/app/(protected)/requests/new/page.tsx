import CreateRequestForm from "@/features/requests/components/create-request-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "新規申請",
};

export default function NewRequestPage() {
  return (
    <CreateRequestForm/>
  );
}
