'use client'

import {
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
// import { DraftRequestItemFormValues } from "@/features/requests/schemas/request-item-form-schema";

// const defaultRequestItemValues:DraftRequestItemFormValues = {
//   title:""
// } 

export default function CreateRequestForm() {
  return (
    <form className="p-5">
      <FieldTitle className="text-lg">新規申請フォーム</FieldTitle>
      <FieldSet>

      </FieldSet>
    </form>
  );
}
