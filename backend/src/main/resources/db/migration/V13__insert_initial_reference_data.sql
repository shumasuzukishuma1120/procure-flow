-- Initial reference data shared by local and production environments.
INSERT INTO suppliers (id, code, name, active, created_at, updated_at)
SELECT id::UUID, code, name, active, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM (VALUES
('550e8400-e29b-41d4-a716-446655440001','SUP-001','株式会社オフィスリンク',TRUE),
('550e8400-e29b-41d4-a716-446655440002','SUP-002','株式会社東都文具',TRUE),
('550e8400-e29b-41d4-a716-446655440003','SUP-003','株式会社ネクストサプライ',TRUE),
('550e8400-e29b-41d4-a716-446655440004','SUP-004','株式会社青葉商事',TRUE),
('550e8400-e29b-41d4-a716-446655440005','SUP-005','株式会社中央オフィスサービス',TRUE),
('550e8400-e29b-41d4-a716-446655440006','SUP-006','株式会社日本ビジネス機器',TRUE),
('550e8400-e29b-41d4-a716-446655440007','SUP-007','株式会社みらい事務用品',TRUE),
('550e8400-e29b-41d4-a716-446655440008','SUP-008','株式会社大和ソリューションズ',TRUE),
('550e8400-e29b-41d4-a716-446655440009','SUP-009','株式会社北辰産業',TRUE),
('550e8400-e29b-41d4-a716-446655440010','SUP-010','株式会社さくらサプライ',TRUE),
('550e8400-e29b-41d4-a716-446655440011','SUP-011','株式会社光陽商会',TRUE),
('550e8400-e29b-41d4-a716-446655440012','SUP-012','株式会社プロキュアメントパートナーズ',TRUE),
('550e8400-e29b-41d4-a716-446655440013','SUP-013','株式会社富士オフィステック',TRUE),
('550e8400-e29b-41d4-a716-446655440014','SUP-014','株式会社関東ビジネスサポート',TRUE),
('550e8400-e29b-41d4-a716-446655440015','SUP-015','株式会社エコワークス',TRUE),
('550e8400-e29b-41d4-a716-446655440016','SUP-016','株式会社新星物産',TRUE),
('550e8400-e29b-41d4-a716-446655440017','SUP-017','株式会社アーバンプロダクツ',TRUE),
('550e8400-e29b-41d4-a716-446655440018','SUP-018','株式会社第一商事',TRUE),
('550e8400-e29b-41d4-a716-446655440019','SUP-019','株式会社テクノサプライ',TRUE),
('550e8400-e29b-41d4-a716-446655440020','SUP-020','株式会社グリーンオフィス',TRUE)
) AS seed(id, code, name, active)
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, code, name, active, created_at, updated_at)
SELECT id::UUID, code, name, active, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM (VALUES
('650e8400-e29b-41d4-a716-446655440001','CAT-001','文房具・事務用品',TRUE),
('650e8400-e29b-41d4-a716-446655440002','CAT-002','PC・周辺機器',TRUE),
('650e8400-e29b-41d4-a716-446655440003','CAT-003','家具・什器',TRUE),
('650e8400-e29b-41d4-a716-446655440004','CAT-004','書籍・資料',TRUE),
('650e8400-e29b-41d4-a716-446655440005','CAT-005','消耗品',TRUE),
('650e8400-e29b-41d4-a716-446655440006','CAT-006','ソフトウェア・ライセンス',TRUE),
('650e8400-e29b-41d4-a716-446655440007','CAT-007','工具・作業用品',TRUE),
('650e8400-e29b-41d4-a716-446655440008','CAT-008','その他',TRUE)
) AS seed(id, code, name, active)
ON CONFLICT (id) DO NOTHING;
