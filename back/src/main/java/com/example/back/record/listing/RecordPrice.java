package com.example.back.record.listing;

import jakarta.validation.constraints.NotNull;

public record RecordPrice(@NotNull(message = "Price value missing") int value) {
}
