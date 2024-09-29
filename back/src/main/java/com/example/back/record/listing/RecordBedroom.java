package com.example.back.record.listing;

import jakarta.validation.constraints.NotNull;

public record RecordBedroom(@NotNull(message = "Bedroom value missing") int value) {
}
