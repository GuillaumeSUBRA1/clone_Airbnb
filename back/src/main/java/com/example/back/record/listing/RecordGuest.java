package com.example.back.record.listing;

import jakarta.validation.constraints.NotNull;

public record RecordGuest(@NotNull(message = "Guest value missing") int value) {
}
