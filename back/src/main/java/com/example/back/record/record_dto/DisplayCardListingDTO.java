package com.example.back.record.record_dto;

import com.example.back.record.listing.RecordPrice;
import com.example.back.utils.enumeration.BookingCategoryEnum;

import java.util.UUID;

public record DisplayCardListingDTO(
        RecordPrice price, String location, PictureDTO cover, BookingCategoryEnum category, UUID pid
) {
}
