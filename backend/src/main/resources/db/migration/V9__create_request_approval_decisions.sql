CREATE TABLE request_approval_decisions (
    id UUID PRIMARY KEY,
    request_id UUID NOT NULL UNIQUE,
    approver_id UUID NOT NULL,
    decision VARCHAR(32) NOT NULL,
    reason VARCHAR(500),
    request_version BIGINT NOT NULL,
    decided_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_request_approval_decisions_request
        FOREIGN KEY (request_id)
        REFERENCES purchase_requests (id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_request_approval_decisions_approver
        FOREIGN KEY (approver_id)
        REFERENCES users (id)
        ON DELETE RESTRICT,
    CONSTRAINT chk_request_approval_decisions_decision
        CHECK (decision IN ('APPROVED', 'REJECTED')),
    CONSTRAINT chk_request_approval_decisions_reason
        CHECK (
            (decision = 'APPROVED' AND reason IS NULL)
            OR (decision = 'REJECTED' AND reason IS NOT NULL AND BTRIM(reason) <> '')
        ),
    CONSTRAINT chk_request_approval_decisions_version
        CHECK (request_version > 0)
);

CREATE INDEX idx_request_approval_decisions_approver_decided
    ON request_approval_decisions (approver_id, decided_at DESC);
