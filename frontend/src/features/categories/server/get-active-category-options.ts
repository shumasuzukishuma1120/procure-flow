import type { CategoryOption } from "@/features/categories/types";
import "server-only";

export async function getActiveCategoryOptions(): Promise<CategoryOption[]> {
  const categoryOptions: CategoryOption[] = [
    {
      id: "650e8400-e29b-41d4-a716-446655440001",
      name: "文房具・事務用品",
    },
    {
      id: "650e8400-e29b-41d4-a716-446655440002",
      name: "PC・周辺機器",
    },
    {
      id: "650e8400-e29b-41d4-a716-446655440003",
      name: "家具・什器",
    },
    {
      id: "650e8400-e29b-41d4-a716-446655440004",
      name: "書籍・資料",
    },
    {
      id: "650e8400-e29b-41d4-a716-446655440005",
      name: "消耗品",
    },
    {
      id: "650e8400-e29b-41d4-a716-446655440006",
      name: "ソフトウェア・ライセンス",
    },
    {
      id: "650e8400-e29b-41d4-a716-446655440007",
      name: "工具・作業用品",
    },
    {
      id: "650e8400-e29b-41d4-a716-446655440008",
      name: "その他",
    },
  ];

  return categoryOptions;
}
