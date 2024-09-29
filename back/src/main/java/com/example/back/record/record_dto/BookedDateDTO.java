package com.example.back.record.record_dto;

import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;

public record BookedDateDTO(
        @NotNull OffsetDateTime start,
        @NotNull OffsetDateTime end
) {
}
