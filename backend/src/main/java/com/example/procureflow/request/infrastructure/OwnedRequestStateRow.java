package com.example.procureflow.request.infrastructure;

import java.util.UUID;

public record OwnedRequestStateRow(
        UUID id,
        String status,
        long version
) {
}
