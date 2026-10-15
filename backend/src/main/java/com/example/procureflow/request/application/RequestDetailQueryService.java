package com.example.procureflow.request.application;

import com.example.procureflow.common.error.ApiException;
import com.example.procureflow.request.infrastructure.PurchaseRequestMapper;
import com.example.procureflow.request.infrastructure.RequestDetailRow;
import com.example.procureflow.request.infrastructure.RequestItemMapper;
import com.example.procureflow.request.presentation.dto.RequestDetailResponse;
import com.example.procureflow.request.presentation.dto.RequestItemResponse;
import com.example.procureflow.security.CurrentUser;
import com.example.procureflow.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RequestDetailQueryService {

    private final CurrentUserProvider currentUserProvider;
    private final PurchaseRequestMapper purchaseRequestMapper;
    private final RequestItemMapper requestItemMapper;

    @Transactional(readOnly = true)
    public RequestDetailResponse findById(UUID requestId) {
        CurrentUser currentUser = currentUserProvider.getCurrentUser();
        RequestDetailRow request = purchaseRequestMapper.findOwnedRequest(
                requestId,
                currentUser.id()
        );

        if (request == null) {
            throw new ApiException(
                    HttpStatus.NOT_FOUND,
                    "REQUEST_NOT_FOUND",
                    "対象の申請が見つかりません。"
            );
        }

        List<RequestItemResponse> items = requestItemMapper.findByRequestId(requestId).stream()
                .map(item -> new RequestItemResponse(
                        item.productName(),
                        item.modelNumber(),
                        item.productUrl(),
                        item.categoryId(),
                        item.quantity(),
                        item.plannedUnitPrice()
                ))
                .toList();

        return new RequestDetailResponse(
                request.requestId(),
                request.requestNumber(),
                request.status(),
                request.title(),
                request.reason(),
                request.desiredDeliveryDate(),
                request.requestedSupplierId(),
                request.note(),
                items,
                calculateTotalAmount(items),
                request.version(),
                request.createdAt(),
                request.updatedAt()
        );
    }

    private long calculateTotalAmount(List<RequestItemResponse> items) {
        long total = 0;
        for (RequestItemResponse item : items) {
            if (item.quantity() != null && item.plannedUnitPrice() != null) {
                long itemAmount = Math.multiplyExact(item.quantity().longValue(), item.plannedUnitPrice());
                total = Math.addExact(total, itemAmount);
            }
        }
        return total;
    }
}
