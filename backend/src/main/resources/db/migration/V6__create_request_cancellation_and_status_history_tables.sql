CREATE TABLE request_cancellations (
    id UUID PRIMARY KEY,
    request_id UUID UNIQUE NOT NULL,
    canceled_by UUID NOT NULL,
    cancel_reason VARCHAR(500) NOT NULL,
    canceled_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_request_cancellations_request
        FOREIGN KEY (request_id)
        REFERENCES purchase_requests (id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_request_cancellations_user
        FOREIGN KEY (canceled_by)
        REFERENCES users (id)
        ON DELETE RESTRICT,
    CONSTRAINT chk_request_cancellations_reason
        CHECK (BTRIM(cancel_reason) <> '')
);

CREATE TABLE request_status_histories (
    id UUID PRIMARY KEY,
    request_id UUID NOT NULL,
    from_status VARCHAR(32) NOT NULL,
    to_status VARCHAR(32) NOT NULL,
    request_version BIGINT NOT NULL,
    changed_by UUID NOT NULL,
    actor_role VARCHAR(16) NOT NULL,
    changed_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_request_status_histories_request
        FOREIGN KEY (request_id)
        REFERENCES purchase_requests (id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_request_status_histories_user
        FOREIGN KEY (changed_by)
        REFERENCES users (id)
        ON DELETE RESTRICT,
    CONSTRAINT uq_request_status_histories_version
        UNIQUE (request_id, request_version),
    CONSTRAINT chk_request_status_histories_transition
        CHECK (from_status <> to_status),
    CONSTRAINT chk_request_status_histories_version
        CHECK (request_version > 0)
);

CREATE INDEX idx_request_status_histories_request_version
    ON request_status_histories (request_id, request_version);
