package com.example.back.record.listing;

import jakarta.validation.constraints.NotNull;

public record RecordTitle(@NotNull(message = "Title value missing") String value) {
}
