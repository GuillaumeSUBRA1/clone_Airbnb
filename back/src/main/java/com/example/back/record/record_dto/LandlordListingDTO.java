package com.example.back.record.record_dto;

import jakarta.validation.constraints.NotNull;

public record LandlordListingDTO(@NotNull String firstname, @NotNull String image) {
}
