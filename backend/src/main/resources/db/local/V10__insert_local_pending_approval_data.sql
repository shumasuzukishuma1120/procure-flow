WITH approval_request_seed (
    seed_number,
    employee_number,
    request_number,
    title,
    supplier_code,
    desired_delivery_date,
    submitted_at
) AS (
    VALUES
        (1, 'EMP-0001', 'REQ-LOCAL-APPROVAL-001', '開発用クラウド検証環境の年間契約', 'SUP-012', DATE '2026-10-12', TIMESTAMPTZ '2026-10-08 01:00:00+00'),
        (2, 'EMP-0002', 'REQ-LOCAL-APPROVAL-002', '障害解析用ノートPCの追加購入',       'SUP-008', DATE '2026-10-16', TIMESTAMPTZ '2026-10-10 03:00:00+00'),
        (3, 'EMP-0002', 'REQ-LOCAL-APPROVAL-003', '開発フロア用無停電電源装置の購入',   'SUP-009', DATE '2026-10-19', TIMESTAMPTZ '2026-10-13 05:30:00+00'),
        (4, 'EMP-0001', 'REQ-LOCAL-APPROVAL-004', 'API負荷試験環境の増強',              'SUP-003', DATE '2026-10-28', TIMESTAMPTZ '2026-10-16 02:00:00+00'),
        (5, 'EMP-0002', 'REQ-LOCAL-APPROVAL-005', '品質検証用タブレット端末の購入',     'SUP-019', DATE '2026-11-05', TIMESTAMPTZ '2026-10-17 06:00:00+00'),
        (6, 'EMP-0001', 'REQ-LOCAL-APPROVAL-006', 'チーム共有ソフトウェアライセンス更新', 'SUP-012', DATE '2026-11-15', TIMESTAMPTZ '2026-10-18 04:00:00+00')
)
INSERT INTO purchase_requests (
    id,
    request_number,
    source_request_id,
    applicant_id,
    created_by,
    submitted_by,
    department_id,
    department_name_snapshot,
    requested_supplier_id,
    requested_supplier_name_snapshot,
    title,
    reason,
    desired_delivery_date,
    note,
    status,
    version,
    submitted_at,
    created_at,
    updated_at
)
SELECT
    ('30000000-0000-4000-8000-' || LPAD(seed.seed_number::TEXT, 12, '0'))::UUID,
    seed.request_number,
    NULL,
    applicant.id,
    applicant.id,
    applicant.id,
    applicant.department_id,
    department.name,
    supplier.id,
    supplier.name,
    seed.title,
    '承認待ち一覧と期限超過フィルターを確認するためのローカル動作確認用申請です。',
    seed.desired_delivery_date,
    CASE
        WHEN seed.desired_delivery_date < DATE '2026-10-20'
            THEN '希望納期を超過しているため、優先して確認してください。'
        ELSE '希望納期までに承認をお願いします。'
    END,
    'SUBMITTED',
    1,
    seed.submitted_at,
    seed.submitted_at - INTERVAL '1 day',
    seed.submitted_at
FROM approval_request_seed seed
JOIN users applicant
  ON applicant.employee_number = seed.employee_number
JOIN departments department
  ON department.id = applicant.department_id
JOIN suppliers supplier
  ON supplier.code = seed.supplier_code;

WITH approval_item_seed (
    seed_number,
    product_name,
    model_number,
    category_code,
    quantity,
    planned_unit_price
) AS (
    VALUES
        (1, 'クラウド検証環境 年間利用料',       'CLOUD-DEV-ANNUAL', 'CAT-006', 1, 360000::BIGINT),
        (2, '障害解析用ノートPC',                'DEBUG-NB-14',      'CAT-002', 2, 185000::BIGINT),
        (3, 'ラインインタラクティブUPS',          'UPS-1500VA',       'CAT-002', 2,  72000::BIGINT),
        (4, '負荷試験用ミニPC',                  'LOAD-MINI-32',     'CAT-002', 6,  98000::BIGINT),
        (5, '品質検証用タブレット端末',           'QA-TABLET-11',     'CAT-002', 3,  89000::BIGINT),
        (6, '開発チーム向けソフトウェアライセンス', 'DEV-TEAM-LIC',     'CAT-006', 12, 18000::BIGINT)
)
INSERT INTO request_items (
    id,
    request_id,
    line_number,
    product_name,
    model_number,
    product_url,
    category_id,
    quantity,
    planned_unit_price,
    created_at,
    updated_at
)
SELECT
    ('31000000-0000-4000-8000-' || LPAD(seed.seed_number::TEXT, 12, '0'))::UUID,
    ('30000000-0000-4000-8000-' || LPAD(seed.seed_number::TEXT, 12, '0'))::UUID,
    1,
    seed.product_name,
    seed.model_number,
    'https://example.invalid/approval-items/' || seed.seed_number,
    category.id,
    seed.quantity,
    seed.planned_unit_price,
    TIMESTAMPTZ '2026-10-07 00:00:00+00' + MAKE_INTERVAL(days => seed.seed_number),
    TIMESTAMPTZ '2026-10-07 00:00:00+00' + MAKE_INTERVAL(days => seed.seed_number)
FROM approval_item_seed seed
JOIN categories category
  ON category.code = seed.category_code;
