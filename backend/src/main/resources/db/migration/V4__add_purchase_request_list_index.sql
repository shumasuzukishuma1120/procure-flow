CREATE INDEX idx_purchase_requests_applicant_updated
    ON purchase_requests (applicant_id, updated_at DESC, id DESC);
