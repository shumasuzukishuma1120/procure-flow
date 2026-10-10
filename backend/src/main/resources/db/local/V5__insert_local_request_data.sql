WITH request_seed (
    sequence_number,
    employee_number,
    title,
    status,
    supplier_code,
    version
) AS (
    VALUES
        (1,  'EMP-0001', '開発用ノートPC購入（入力途中）',       'DRAFT',                  'SUP-003', 0),
        (2,  'EMP-0001', 'リモート会議用機材の購入',             'DRAFT',                  'SUP-006', 2),
        (3,  'EMP-0001', '新入社員向けPCセットの購入',           'SUBMITTED',              'SUP-003', 1),
        (4,  'EMP-0001', '開発チーム用4Kモニターの追加',         'SUBMITTED',              'SUP-019', 1),
        (5,  'EMP-0001', '共有スペース用文房具の補充',           'CANCELED',               'SUP-002', 2),
        (6,  'EMP-0001', '高機能ワークチェアの購入',             'REJECTED',               'SUP-005', 2),
        (7,  'EMP-0001', 'CI用小型サーバーの購入',               'APPROVED',               'SUP-008', 3),
        (8,  'EMP-0001', 'デザイン確認用タブレットの購入',       'APPROVED',               'SUP-019', 3),
        (9,  'EMP-0001', 'USB-Cドッキングステーションの購入',   'ORDERED',                'SUP-003', 4),
        (10, 'EMP-0001', '開発端末用キーボードの更新',           'ORDERED',                'SUP-006', 4),
        (11, 'EMP-0001', '技術書・設計資料の購入',               'SUBMITTED',              'SUP-012', 1),
        (12, 'EMP-0001', 'ホワイトボード用品の補充',             'COMPLETED',              'SUP-007', 5),
        (13, 'EMP-0001', 'LANケーブルと配線用品の購入',          'COMPLETED',              'SUP-011', 5),
        (14, 'EMP-0001', '検証用スマートフォンの購入',           'REAPPLICATION_REQUIRED', 'SUP-019', 4),
        (15, 'EMP-0001', 'クラウド設計ツール年間ライセンス',     'APPROVED',               'SUP-012', 3),
        (16, 'EMP-0001', 'Web会議用ヘッドセットの追加',          'ORDERED',                'SUP-008', 4),
        (17, 'EMP-0001', 'プリンター用トナーの補充',             'COMPLETED',              'SUP-013', 5),
        (18, 'EMP-0001', '検証環境用ネットワーク機器',           'DRAFT',                  'SUP-009', 1),
        (19, 'EMP-0001', '負荷試験用端末の追加購入',             'REAPPLICATION_REQUIRED', 'SUP-003', 4),
        (20, 'EMP-0001', 'デスク周辺収納用品の購入',             'COMPLETED',              'SUP-017', 5),
        (21, 'EMP-0001', 'モバイルモニターの購入',               'SUBMITTED',              'SUP-010', 1),
        (22, 'EMP-0001', '検証用無線アクセスポイントの購入',     'REAPPLICATION_REQUIRED', 'SUP-009', 4),
        (23, 'EMP-0001', 'セキュリティキーの全員配布',           'ORDERED',                'SUP-014', 4),
        (24, 'EMP-0001', 'コピー用紙とラベル用紙の補充',         'COMPLETED',              'SUP-002', 5),
        (25, 'EMP-0001', '開発用デスクトップPCの増設',           'REAPPLICATION_REQUIRED', 'SUP-008', 4),
        (26, 'EMP-0002', '品質管理チーム用モニターの購入',       'SUBMITTED',              'SUP-019', 1),
        (27, 'EMP-0003', '営業部用モバイル端末の購入',           'APPROVED',               'SUP-003', 3),
        (28, 'EMP-0005', '総務部用シュレッダーの購入',           'ORDERED',                'SUP-005', 4)
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
    ('10000000-0000-4000-8000-' || LPAD(seed.sequence_number::TEXT, 12, '0'))::UUID,
    CASE
        WHEN seed.status = 'DRAFT' THEN NULL
        ELSE 'REQ-2026-' || LPAD((100 + seed.sequence_number)::TEXT, 6, '0')
    END,
    NULL,
    application_user.id,
    application_user.id,
    CASE WHEN seed.status = 'DRAFT' THEN NULL ELSE application_user.id END,
    application_user.department_id,
    CASE WHEN seed.status = 'DRAFT' THEN NULL ELSE department.name END,
    supplier.id,
    CASE WHEN seed.status = 'DRAFT' THEN NULL ELSE supplier.name END,
    seed.title,
    '業務に必要な備品・サービスを調達するためのローカル動作確認用申請です。',
    DATE '2026-10-15' + seed.sequence_number,
    CASE
        WHEN seed.sequence_number % 3 = 0 THEN '納品前に担当者へ連絡してください。'
        ELSE NULL
    END,
    seed.status,
    seed.version,
    CASE
        WHEN seed.status = 'DRAFT' THEN NULL
        ELSE TIMESTAMPTZ '2026-09-01 00:00:00+00'
             + MAKE_INTERVAL(days => seed.sequence_number, hours => 1)
    END,
    TIMESTAMPTZ '2026-09-01 00:00:00+00'
        + MAKE_INTERVAL(days => seed.sequence_number),
    TIMESTAMPTZ '2026-09-01 00:00:00+00'
        + MAKE_INTERVAL(days => seed.sequence_number, hours => seed.version)
FROM request_seed seed
JOIN users application_user
  ON application_user.employee_number = seed.employee_number
JOIN departments department
  ON department.id = application_user.department_id
JOIN suppliers supplier
  ON supplier.code = seed.supplier_code;

WITH item_seed (
    request_sequence_number,
    product_name,
    category_code,
    quantity,
    planned_unit_price,
    item_count
) AS (
    VALUES
        (2,  'Web会議用カメラ',                 'CAT-002', 2,  18000::BIGINT, 2),
        (3,  '14インチ業務用ノートPC',          'CAT-002', 3, 145000::BIGINT, 3),
        (4,  '27インチ4Kモニター',              'CAT-002', 4,  52000::BIGINT, 2),
        (5,  '油性ボールペン 黒 10本組',        'CAT-001', 5,    980::BIGINT, 2),
        (6,  'エルゴノミクスワークチェア',       'CAT-003', 2,  78000::BIGINT, 1),
        (7,  'ラックマウント小型サーバー',       'CAT-002', 1, 480000::BIGINT, 3),
        (8,  '12.9インチ業務用タブレット',       'CAT-002', 2, 128000::BIGINT, 2),
        (9,  'USB-Cドッキングステーション',     'CAT-002', 5,  24000::BIGINT, 2),
        (10, '静音メカニカルキーボード',         'CAT-002', 6,  16000::BIGINT, 1),
        (11, 'ドメイン駆動設計 実践ガイド',       'CAT-004', 4,   4200::BIGINT, 3),
        (12, 'マグネット式ホワイトボード',       'CAT-003', 2,  12000::BIGINT, 2),
        (13, 'CAT6A LANケーブル 5m',            'CAT-002', 10,   1800::BIGINT, 3),
        (14, 'Android検証用スマートフォン',      'CAT-002', 3,  86000::BIGINT, 2),
        (15, 'UIデザインツール年間ライセンス',   'CAT-006', 8,  24000::BIGINT, 1),
        (16, 'ノイズキャンセリングヘッドセット', 'CAT-002', 6,  21000::BIGINT, 2),
        (17, 'レーザープリンター用トナー',       'CAT-005', 4,  13500::BIGINT, 1),
        (18, 'マネージドスイッチ 24ポート',      'CAT-002', 2,  68000::BIGINT, 3),
        (19, '負荷試験用ミニPC',                 'CAT-002', 6,  92000::BIGINT, 2),
        (20, 'デスクワゴン',                     'CAT-003', 4,  19000::BIGINT, 1),
        (21, '15.6インチモバイルモニター',       'CAT-002', 3,  34000::BIGINT, 2),
        (22, 'Wi-Fi 6対応アクセスポイント',      'CAT-002', 4,  47000::BIGINT, 2),
        (23, 'FIDO2対応セキュリティキー',        'CAT-002', 15,  6800::BIGINT, 1),
        (24, 'コピー用紙 A4 500枚',              'CAT-005', 20,   620::BIGINT, 2),
        (25, '開発用デスクトップPC',             'CAT-002', 4, 220000::BIGINT, 3),
        (26, '24インチフルHDモニター',           'CAT-002', 3,  28000::BIGINT, 1),
        (27, '営業用タブレット端末',             'CAT-002', 5,  74000::BIGINT, 2),
        (28, 'オフィス用シュレッダー',           'CAT-003', 1,  98000::BIGINT, 1)
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
    (
        '20000000-0000-4000-8000-'
        || LPAD((seed.request_sequence_number * 10 + item_number)::TEXT, 12, '0')
    )::UUID,
    (
        '10000000-0000-4000-8000-'
        || LPAD(seed.request_sequence_number::TEXT, 12, '0')
    )::UUID,
    item_number,
    CASE item_number
        WHEN 1 THEN seed.product_name
        WHEN 2 THEN seed.product_name || '用アクセサリ'
        ELSE seed.product_name || '用予備品'
    END,
    CASE
        WHEN item_number = 1 THEN 'LOCAL-' || LPAD(seed.request_sequence_number::TEXT, 3, '0')
        ELSE NULL
    END,
    CASE
        WHEN item_number = 1
            THEN 'https://example.invalid/products/' || seed.request_sequence_number
        ELSE NULL
    END,
    category.id,
    CASE WHEN item_number = 1 THEN seed.quantity ELSE 1 END,
    CASE WHEN item_number = 1 THEN seed.planned_unit_price ELSE 1500 * item_number END,
    TIMESTAMPTZ '2026-09-01 00:00:00+00'
        + MAKE_INTERVAL(days => seed.request_sequence_number),
    TIMESTAMPTZ '2026-09-01 00:00:00+00'
        + MAKE_INTERVAL(days => seed.request_sequence_number)
FROM item_seed seed
CROSS JOIN LATERAL GENERATE_SERIES(1, seed.item_count) AS generated(item_number)
JOIN categories category
  ON category.code = seed.category_code;
