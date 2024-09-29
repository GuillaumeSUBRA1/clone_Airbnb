package com.example.back.record.dto;

import com.example.back.record.listing.RecordPrice;
import com.example.back.record.record_dto.DescriptionDTO;
import com.example.back.record.record_dto.ListingInfoDTO;
import com.example.back.record.record_dto.PictureDTO;
import com.example.back.utils.enumeration.BookingCategoryEnum;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class SaveListingDTO {
    @NotNull BookingCategoryEnum category;
    @NotNull String location;
    @NotNull @Valid ListingInfoDTO infos;
    @NotNull @Valid DescriptionDTO description;
    @NotNull @Valid RecordPrice price;
    @NotNull List<PictureDTO> pictures;

    public BookingCategoryEnum getCategory() {
        return category;
    }

    public void setCategory(BookingCategoryEnum category) {
        this.category = category;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public ListingInfoDTO getInfos() {
        return infos;
    }

    public void setInfos(ListingInfoDTO infos) {
        this.infos = infos;
    }

    public DescriptionDTO getDescription() {
        return description;
    }

    public void setDescription(DescriptionDTO description) {
        this.description = description;
    }

    public RecordPrice getPrice() {
        return price;
    }

    public void setPrice(RecordPrice price) {
        this.price = price;
    }

    public List<PictureDTO> getPictures() {
        return pictures;
    }

    public void setPictures(List<PictureDTO> pictures) {
        this.pictures = pictures;
    }
}
