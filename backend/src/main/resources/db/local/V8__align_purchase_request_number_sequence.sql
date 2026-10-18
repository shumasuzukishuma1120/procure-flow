SELECT setval(
    'purchase_request_number_seq',
    COALESCE(MAX(SUBSTRING(request_number FROM '([0-9]+)$')::BIGINT), 1),
    COUNT(request_number) > 0
)
FROM purchase_requests
WHERE request_number IS NOT NULL;
