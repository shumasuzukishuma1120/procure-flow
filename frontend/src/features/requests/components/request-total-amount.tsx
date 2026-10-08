type RequestTotalAmountProps = {
  amount: number | undefined;
};

export default function RequestTotalAmount({ amount }: RequestTotalAmountProps) {
  return (
    <div className="flex items-center justify-end border-t mt-6 gap-4 pt-4">
      <span className="font-medium">申請合計金額（税込）</span>
      <output className="text-xl font-bold tabular-nums">
        {amount === undefined ? "-" : `￥${amount.toLocaleString("ja-JP")}`}
      </output>
    </div>
  );
}
