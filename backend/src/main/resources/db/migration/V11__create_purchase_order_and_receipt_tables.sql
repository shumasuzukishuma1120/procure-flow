CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY,
    request_id UUID NOT NULL UNIQUE,
    actual_supplier_id UUID NOT NULL,
    actual_supplier_name_snapshot VARCHAR(200) NOT NULL,
    purchase_order_number VARCHAR(100) NOT NULL,
    promised_delivery_date DATE NOT NULL,
    purchaser_note VARCHAR(1000),
    ordered_by UUID NOT NULL,
    ordered_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_purchase_orders_request
        FOREIGN KEY (request_id)
        REFERENCES purchase_requests (id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_purchase_orders_supplier
        FOREIGN KEY (actual_supplier_id)
        REFERENCES suppliers (id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_purchase_orders_ordered_by
        FOREIGN KEY (ordered_by)
        REFERENCES users (id)
        ON DELETE RESTRICT,
    CONSTRAINT chk_purchase_orders_supplier_name
        CHECK (BTRIM(actual_supplier_name_snapshot) <> ''),
    CONSTRAINT chk_purchase_orders_order_number
        CHECK (BTRIM(purchase_order_number) <> '')
);

CREATE TABLE purchase_order_items (
    id UUID PRIMARY KEY,
    purchase_order_id UUID NOT NULL,
    request_item_id UUID NOT NULL UNIQUE,
    actual_unit_price BIGINT NOT NULL,
    CONSTRAINT fk_purchase_order_items_order
        FOREIGN KEY (purchase_order_id)
        REFERENCES purchase_orders (id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_purchase_order_items_request_item
        FOREIGN KEY (request_item_id)
        REFERENCES request_items (id)
        ON DELETE RESTRICT,
    CONSTRAINT chk_purchase_order_items_unit_price
        CHECK (actual_unit_price BETWEEN 1 AND 99999999)
);

CREATE TABLE request_receipts (
    id UUID PRIMARY KEY,
    purchase_order_id UUID NOT NULL UNIQUE,
    received_date DATE NOT NULL,
    receipt_note VARCHAR(1000),
    received_by UUID NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_request_receipts_order
        FOREIGN KEY (purchase_order_id)
        REFERENCES purchase_orders (id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_request_receipts_received_by
        FOREIGN KEY (received_by)
        REFERENCES users (id)
        ON DELETE RESTRICT
);

CREATE INDEX idx_purchase_orders_supplier
    ON purchase_orders (actual_supplier_id);

CREATE INDEX idx_purchase_orders_ordered_at
    ON purchase_orders (ordered_at DESC);

CREATE INDEX idx_purchase_order_items_order
    ON purchase_order_items (purchase_order_id);

CREATE INDEX idx_purchase_requests_purchase_queue
    ON purchase_requests (status, desired_delivery_date, id)
    WHERE status IN ('APPROVED', 'ORDERED', 'COMPLETED');
