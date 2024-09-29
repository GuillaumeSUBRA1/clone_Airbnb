package com.example.back.record.record_dto;

import com.example.back.record.listing.RecordPrice;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record BookedListingDTO(
        @Valid PictureDTO cover,
        @NotEmpty String location,
        @Valid BookedDateDTO dates,
        @Valid RecordPrice totalPrice,
        @NotNull UUID bookingPid,
        @NotNull UUID listingPid) {
}
