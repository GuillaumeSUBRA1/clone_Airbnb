package com.example.back.record.record_dto;

import com.example.back.record.listing.RecordPrice;

import java.util.UUID;

public record CreateBookingDTO(
        UUID pid,
        RecordPrice price
) {
}
