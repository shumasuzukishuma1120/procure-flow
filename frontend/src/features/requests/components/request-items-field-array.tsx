import { FieldSet } from "@/components/ui/field";
import { createEmptyRequestItemFormValues } from "@/features/requests/forms/request-form-default-values";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { CategoryOption } from "@/features/categories/types";
import { Plus } from "lucide-react";
import { MAX_REQUEST_ITEM_COUNT } from "@/features/requests/constants/request-constraints";
import RequestItemCard from "@/features/requests/components/request-item-card";
import { useFieldArray, useFormContext } from "react-hook-form";
import { type DraftRequestFormValues } from "@/features/requests/schemas/request-form-schema";

type RequestItemsFieldArrayProps = {
  categoryOptions: CategoryOption[];
};

export default function RequestItemsFieldArray({ categoryOptions }: RequestItemsFieldArrayProps) {
  const { control } = useFormContext<DraftRequestFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const categorySelectItems = categoryOptions.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <Card className="mt-5">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-baseline gap-0.5">
            <h2 id="request-items-heading" className="text-base font-bold">
              申請明細
            </h2>
            <span className="text-xs text-muted-foreground">{`${fields.length} / ${MAX_REQUEST_ITEM_COUNT}件`}</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              hidden={fields.length < MAX_REQUEST_ITEM_COUNT}
              className="text-red-600 text-base font-medium"
            >
              {`明細は最大${MAX_REQUEST_ITEM_COUNT}件までです`}
            </span>
            <Button
              variant="outline"
              type="button"
              disabled={fields.length >= MAX_REQUEST_ITEM_COUNT}
              onClick={() => append(createEmptyRequestItemFormValues())}
            >
              <Plus />
              明細を追加
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <FieldSet
          aria-labelledby="request-items-heading"
          className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,25rem),1fr))] items-start gap-5"
        >
          {fields.map((requestItemField, index) => {
            return (
              <RequestItemCard
                key={requestItemField.id}
                index={index}
                categorySelectItems={categorySelectItems}
                canRemove={fields.length > 1}
                onRemove={() => remove(index)}
              />
            );
          })}
        </FieldSet>
      </CardContent>
    </Card>
  );
}
