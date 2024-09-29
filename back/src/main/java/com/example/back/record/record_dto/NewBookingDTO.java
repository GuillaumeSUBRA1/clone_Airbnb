package com.example.back.record.record_dto;

import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;
import java.util.UUID;

public record NewBookingDTO(
        @NotNull OffsetDateTime start,
        @NotNull OffsetDateTime end,
        @NotNull UUID pid
) {
}
