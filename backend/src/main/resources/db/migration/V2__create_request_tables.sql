CREATE TABLE purchase_requests (
    id UUID PRIMARY KEY,
    request_number VARCHAR(50) UNIQUE,
    source_request_id UUID UNIQUE,
    applicant_id UUID NOT NULL,
    created_by UUID NOT NULL,
    submitted_by UUID,
    department_id UUID NOT NULL,
    department_name_snapshot VARCHAR(200),
    requested_supplier_id UUID,
    requested_supplier_name_snapshot VARCHAR(200),
    title VARCHAR(100),
    reason VARCHAR(1000),
    desired_delivery_date DATE,
    note VARCHAR(1000),
    status VARCHAR(32) NOT NULL,
    version BIGINT NOT NULL,
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_purchase_requests_source_request
        FOREIGN KEY (source_request_id)
        REFERENCES purchase_requests (id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_purchase_requests_applicant
        FOREIGN KEY (applicant_id)
        REFERENCES users (id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_purchase_requests_created_by
        FOREIGN KEY (created_by)
        REFERENCES users (id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_purchase_requests_submitted_by
        FOREIGN KEY (submitted_by)
        REFERENCES users (id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_purchase_requests_department
        FOREIGN KEY (department_id)
        REFERENCES departments (id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_purchase_requests_requested_supplier
        FOREIGN KEY (requested_supplier_id)
        REFERENCES suppliers (id)
        ON DELETE RESTRICT,
    CONSTRAINT chk_purchase_requests_status
        CHECK (
            status IN (
                'DRAFT',
                'SUBMITTED',
                'CANCELED',
                'REJECTED',
                'APPROVED',
                'ORDERED',
                'COMPLETED',
                'REAPPLICATION_REQUIRED'
            )
        ),
    CONSTRAINT chk_purchase_requests_version
        CHECK (version >= 0),
    CONSTRAINT chk_purchase_requests_source_not_self
        CHECK (source_request_id IS NULL OR source_request_id <> id)
);

CREATE TABLE request_items (
    id UUID PRIMARY KEY,
    request_id UUID NOT NULL,
    line_number INTEGER NOT NULL,
    product_name VARCHAR(200),
    model_number VARCHAR(100),
    product_url VARCHAR(2048),
    category_id UUID,
    quantity INTEGER,
    planned_unit_price BIGINT,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_request_items_request
        FOREIGN KEY (request_id)
        REFERENCES purchase_requests (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_request_items_category
        FOREIGN KEY (category_id)
        REFERENCES categories (id)
        ON DELETE RESTRICT,
    CONSTRAINT uq_request_items_request_line
        UNIQUE (request_id, line_number),
    CONSTRAINT chk_request_items_line_number
        CHECK (line_number BETWEEN 1 AND 20),
    CONSTRAINT chk_request_items_quantity
        CHECK (quantity IS NULL OR quantity BETWEEN 1 AND 9999),
    CONSTRAINT chk_request_items_planned_unit_price
        CHECK (
            planned_unit_price IS NULL
            OR planned_unit_price BETWEEN 1 AND 99999999
        )
);

CREATE TABLE idempotency_records (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    operation_type VARCHAR(50) NOT NULL,
    idempotency_key VARCHAR(255) NOT NULL,
    request_hash VARCHAR(64) NOT NULL,
    processing_status VARCHAR(32) NOT NULL,
    resource_id UUID,
    response_status INTEGER,
    response_body JSONB,
    created_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_idempotency_records_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE RESTRICT,
    CONSTRAINT uq_idempotency_records_operation
        UNIQUE (user_id, operation_type, idempotency_key),
    CONSTRAINT chk_idempotency_records_processing_status
        CHECK (processing_status IN ('PROCESSING', 'COMPLETED')),
    CONSTRAINT chk_idempotency_records_response_status
        CHECK (
            response_status IS NULL
            OR response_status BETWEEN 100 AND 599
        ),
    CONSTRAINT chk_idempotency_records_expiration
        CHECK (expires_at > created_at)
);

CREATE INDEX idx_purchase_requests_applicant
    ON purchase_requests (applicant_id);

CREATE INDEX idx_purchase_requests_department_status_submitted
    ON purchase_requests (department_id, status, submitted_at, id);

CREATE INDEX idx_idempotency_records_expires_at
    ON idempotency_records (expires_at);
