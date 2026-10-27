INSERT INTO purchase_orders (
    id, request_id, actual_supplier_id, actual_supplier_name_snapshot,
    purchase_order_number, promised_delivery_date, purchaser_note,
    ordered_by, ordered_at
)
SELECT
    MD5(pr.id::TEXT || ':order')::UUID,
    pr.id,
    pr.requested_supplier_id,
    COALESCE(pr.requested_supplier_name_snapshot, supplier.name),
    'PO-LOCAL-' || RIGHT(pr.request_number, 6),
    pr.desired_delivery_date,
    'ローカル動作確認用の発注データです。',
    '00000000-0000-4000-8000-000000000001'::UUID,
    pr.updated_at - INTERVAL '2 days'
FROM purchase_requests pr
JOIN suppliers supplier ON supplier.id = pr.requested_supplier_id
WHERE pr.status IN ('ORDERED', 'COMPLETED')
  AND NOT EXISTS (SELECT 1 FROM purchase_orders po WHERE po.request_id = pr.id);

INSERT INTO purchase_order_items (id, purchase_order_id, request_item_id, actual_unit_price)
SELECT
    MD5(item.id::TEXT || ':order-item')::UUID,
    po.id,
    item.id,
    item.planned_unit_price + GREATEST(100, item.planned_unit_price / 100)
FROM purchase_orders po
JOIN request_items item ON item.request_id = po.request_id
WHERE NOT EXISTS (
    SELECT 1 FROM purchase_order_items poi WHERE poi.request_item_id = item.id
);

INSERT INTO request_receipts (
    id, purchase_order_id, received_date, receipt_note, received_by, completed_at
)
SELECT
    MD5(po.id::TEXT || ':receipt')::UUID,
    po.id,
    (pr.updated_at AT TIME ZONE 'Asia/Tokyo')::DATE,
    '全商品を受領済みです。',
    '00000000-0000-4000-8000-000000000001'::UUID,
    pr.updated_at
FROM purchase_orders po
JOIN purchase_requests pr ON pr.id = po.request_id
WHERE pr.status = 'COMPLETED'
  AND NOT EXISTS (SELECT 1 FROM request_receipts receipt WHERE receipt.purchase_order_id = po.id);
