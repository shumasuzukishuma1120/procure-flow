"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import type { SupplierOption } from "@/features/suppliers/types";
import { useRouter, useSearchParams } from "next/navigation";

type MyRequestSupplierFilterProps = {
  supplierId?: string;
  supplierOptions: SupplierOption[];
};

export function MyRequestSupplierFilter({
  supplierId,
  supplierOptions,
}: MyRequestSupplierFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedSupplier =
    supplierOptions.find((supplier) => supplier.id === supplierId) ?? null;

  const handleValueChange = (supplier: SupplierOption | null) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    if (supplier === null) {
      nextSearchParams.delete("supplierId");
    } else if (supplierOptions.some((option) => option.id === supplier.id)) {
      nextSearchParams.set("supplierId", supplier.id);
    } else {
      return;
    }

    nextSearchParams.set("page", "0");
    router.replace(`/requests?${nextSearchParams.toString()}`);
  };

  return (
    <div className="w-full md:w-72">
      <Label htmlFor="my-request-supplier-filter" className="sr-only">
        仕入先
      </Label>
      <Combobox
        items={supplierOptions}
        value={selectedSupplier}
        onValueChange={handleValueChange}
        itemToStringLabel={(supplier) => supplier.name}
        itemToStringValue={(supplier) => supplier.id}
        isItemEqualToValue={(supplier, value) => supplier.id === value.id}
        autoHighlight
      >
        <ComboboxInput
          id="my-request-supplier-filter"
          placeholder="仕入先で絞り込み"
          showClear
        />
        <ComboboxContent>
          <ComboboxEmpty>仕入先が見つかりません</ComboboxEmpty>
          <ComboboxList>
            {(supplier) => (
              <ComboboxItem key={supplier.id} value={supplier}>
                {supplier.name}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
