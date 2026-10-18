import { Field, FieldDescription, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  MAX_PLANNED_UNIT_PRICE,
  MAX_QUANTITY,
} from "@/features/requests/constants/request-constraints";
import { type DraftRequestFormValues } from "@/features/requests/schemas/request-form-schema";
import { calculateRequestItemAmount } from "@/features/requests/utils/calculate-request-item-amount";

type RequestItemCardProps = {
  index: number;
  categorySelectItems: {
    value: string;
    label: string;
  }[];
  canRemove: boolean;
  onRemove: () => void;
};

function toOptionalNumber(value: unknown): number | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return Number(value);
}

export default function RequestItemCard({
  index,
  categorySelectItems,
  canRemove,
  onRemove,
}: RequestItemCardProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<DraftRequestFormValues>();

  const watchedItem = useWatch({
    control,
    name: `items.${index}` as const,
  });

  const quantity = watchedItem?.quantity;
  const plannedUnitPrice = watchedItem?.plannedUnitPrice;

  const itemAmount = calculateRequestItemAmount(quantity, plannedUnitPrice);

  const itemErrors = errors.items?.[index];

  const productNameError = itemErrors?.productName;
  const modelNumberError = itemErrors?.modelNumber;
  const productUrlError = itemErrors?.productUrl;
  const quantityError = itemErrors?.quantity;
  const plannedUnitPriceError = itemErrors?.plannedUnitPrice;

  const productNameId = `items-${index}-productName`;
  const productNameErrorId = `${productNameId}-error`;
  const productNameDescriptionId = `${productNameId}-description`;

  const modelNumberId = `items-${index}-modelNumber`;
  const modelNumberErrorId = `${modelNumberId}-error`;
  const modelNumberDescriptionId = `${modelNumberId}-description`;

  const productUrlId = `items-${index}-productUrl`;
  const productUrlErrorId = `${productUrlId}-error`;
  const productUrlDescriptionId = `${productUrlId}-description`;

  const categoryId = `items-${index}-categoryId`;
  const categoryErrorId = `${categoryId}-error`;
  const categoryDescriptionId = `${categoryId}-description`;

  const quantityId = `items-${index}-quantity`;
  const quantityErrorId = `${quantityId}-error`;
  const quantityDescriptionId = `${quantityId}-description`;

  const plannedUnitPriceId = `items-${index}-plannedUnitPrice`;
  const plannedUnitPriceErrorId = `${plannedUnitPriceId}-error`;
  const plannedUnitPriceDescriptionId = `${plannedUnitPriceId}-description`;

  const itemAmountId = `items-${index}-amount`;

  return (
    <Card className="min-w-0 shadow">
      <CardContent>
        <FieldGroup>
          <div className="flex items-center justify-between">
            <h3 className="font-bold">明細 {index + 1}</h3>

            <AlertDialog>
              <AlertDialogTrigger
                type="button"
                disabled={!canRemove}
                aria-label={`明細${index + 1}を削除`}
                render={<Button variant="destructive" />}
              >
                <Trash />
                削除
              </AlertDialogTrigger>
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogTitle>明細 {index + 1} を削除しますか？</AlertDialogTitle>
                  <AlertDialogDescription>
                    入力した明細情報は破棄されます。
                    <br />
                    この操作は元に戻せません。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction
                    type="button"
                    variant="destructive"
                    aria-label={`明細${index + 1}を削除`}
                    onClick={onRemove}
                  >
                    <Trash />
                    削除する
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <Field data-invalid={!!productNameError}>
            <FieldLabel htmlFor={productNameId}>商品名</FieldLabel>
            <Input
              id={productNameId}
              type="text"
              {...register(`items.${index}.productName` as const)}
              aria-invalid={!!productNameError}
              aria-describedby={
                !!productNameError
                  ? `${productNameDescriptionId} ${productNameErrorId}`
                  : productNameDescriptionId
              }
            />
            <FieldDescription id={productNameDescriptionId}>
              200文字以内で入力してください
            </FieldDescription>
            <FieldError id={productNameErrorId} errors={[productNameError]} />
          </Field>

          <Field data-invalid={!!modelNumberError}>
            <FieldLabel htmlFor={modelNumberId}>型番（任意）</FieldLabel>
            <Input
              id={modelNumberId}
              type="text"
              {...register(`items.${index}.modelNumber` as const)}
              aria-invalid={!!modelNumberError}
              aria-describedby={
                !!modelNumberError
                  ? `${modelNumberDescriptionId} ${modelNumberErrorId}`
                  : modelNumberDescriptionId
              }
            />
            <FieldDescription id={modelNumberDescriptionId}>
              100文字以内で入力してください
            </FieldDescription>
            <FieldError id={modelNumberErrorId} errors={[modelNumberError]} />
          </Field>

          <Field data-invalid={!!productUrlError}>
            <FieldLabel htmlFor={productUrlId}>商品URL（任意）</FieldLabel>
            <Input
              id={productUrlId}
              type="url"
              {...register(`items.${index}.productUrl` as const)}
              aria-invalid={!!productUrlError}
              aria-describedby={
                !!productUrlError
                  ? `${productUrlDescriptionId} ${productUrlErrorId}`
                  : productUrlDescriptionId
              }
            />
            <FieldDescription id={productUrlDescriptionId}>
              2,048文字以内で入力してください
            </FieldDescription>
            <FieldError id={productUrlErrorId} errors={[productUrlError]} />
          </Field>

          <Controller
            name={`items.${index}.categoryId` as const}
            control={control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={categoryId}>カテゴリ</FieldLabel>

                  <Select
                    name={field.name}
                    items={categorySelectItems}
                    value={field.value || null}
                    onValueChange={(value) => {
                      field.onChange(value ?? "");
                    }}
                  >
                    <SelectTrigger
                      className="w-full"
                      id={categoryId}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      aria-invalid={fieldState.invalid}
                      aria-describedby={
                        fieldState.error
                          ? `${categoryDescriptionId} ${categoryErrorId}`
                          : categoryDescriptionId
                      }
                    >
                      <SelectValue placeholder="カテゴリを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categorySelectItems.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <FieldDescription id={categoryDescriptionId}>
                    カテゴリを選択してください
                  </FieldDescription>
                  <FieldError id={categoryErrorId} errors={[fieldState.error]} />
                </Field>
              );
            }}
          />

          <Field data-invalid={!!quantityError}>
            <FieldLabel htmlFor={quantityId}>数量</FieldLabel>
            <Input
              id={quantityId}
              type="number"
              min={1}
              max={MAX_QUANTITY}
              step={1}
              {...register(`items.${index}.quantity` as const, {
                setValueAs: toOptionalNumber,
              })}
              aria-invalid={!!quantityError}
              aria-describedby={
                !!quantityError
                  ? `${quantityDescriptionId} ${quantityErrorId}`
                  : quantityDescriptionId
              }
            />
            <FieldDescription id={quantityDescriptionId}>
              {`1から${MAX_QUANTITY.toLocaleString("ja-JP")}の整数を入力してください`}
            </FieldDescription>
            <FieldError id={quantityErrorId} errors={[quantityError]} />
          </Field>

          <Field data-invalid={!!plannedUnitPriceError}>
            <FieldLabel htmlFor={plannedUnitPriceId}>予定単価（税込）</FieldLabel>
            <Input
              id={plannedUnitPriceId}
              type="number"
              min={1}
              max={MAX_PLANNED_UNIT_PRICE}
              step={1}
              {...register(`items.${index}.plannedUnitPrice` as const, {
                setValueAs: toOptionalNumber,
              })}
              aria-invalid={!!plannedUnitPriceError}
              aria-describedby={
                !!plannedUnitPriceError
                  ? `${plannedUnitPriceDescriptionId} ${plannedUnitPriceErrorId}`
                  : plannedUnitPriceDescriptionId
              }
            />
            <FieldDescription id={plannedUnitPriceDescriptionId}>
              {`1から${MAX_PLANNED_UNIT_PRICE.toLocaleString("ja-JP")}の整数を入力してください`}
            </FieldDescription>
            <FieldError id={plannedUnitPriceErrorId} errors={[plannedUnitPriceError]} />
          </Field>

          <Field>
            <FieldLabel htmlFor={itemAmountId}>明細金額（税込）</FieldLabel>
            <output
              id={itemAmountId}
              htmlFor={`${quantityId} ${plannedUnitPriceId}`}
              className="block rounded bg-muted px-3 py-2 text-lg font-semibold tabular-nums"
            >
              {itemAmount === undefined ? "-" : `￥${itemAmount.toLocaleString("ja-JP")}`}
            </output>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
