package com.example.back.record.listing;

import jakarta.validation.constraints.NotNull;

public record RecordBath(@NotNull(message = "Bath value missing") int value) {
}
