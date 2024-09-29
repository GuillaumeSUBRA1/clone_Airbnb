package com.example.back.record.listing;

import jakarta.validation.constraints.NotNull;

public record RecordDescription(@NotNull(message = "Description value missing") String value) {
}
