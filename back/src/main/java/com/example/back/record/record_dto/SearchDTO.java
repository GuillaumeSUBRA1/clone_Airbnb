package com.example.back.record.record_dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

public record SearchDTO(
        @Valid BookedDateDTO dates,
        @Valid ListingInfoDTO infos,
        @NotEmpty String location
) {
}
