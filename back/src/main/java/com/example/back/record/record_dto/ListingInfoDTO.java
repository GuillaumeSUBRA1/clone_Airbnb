package com.example.back.record.record_dto;

import com.example.back.record.listing.RecordBath;
import com.example.back.record.listing.RecordBed;
import com.example.back.record.listing.RecordBedroom;
import com.example.back.record.listing.RecordGuest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record ListingInfoDTO(@NotNull @Valid RecordGuest guest,
                             @NotNull @Valid RecordBedroom bedroom,
                             @NotNull @Valid RecordBed bed,
                             @NotNull @Valid RecordBath bath) {
}
