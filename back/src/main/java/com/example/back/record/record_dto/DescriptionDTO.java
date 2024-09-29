package com.example.back.record.record_dto;

import com.example.back.record.listing.RecordDescription;
import com.example.back.record.listing.RecordTitle;
import jakarta.validation.constraints.NotNull;

public record DescriptionDTO(@NotNull RecordTitle title, @NotNull RecordDescription description) {
}
