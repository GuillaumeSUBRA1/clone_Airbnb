package com.example.back.record.listing;

import jakarta.validation.constraints.NotNull;

public record RecordBed(@NotNull(message = "Bed value missing") int value) {
}
