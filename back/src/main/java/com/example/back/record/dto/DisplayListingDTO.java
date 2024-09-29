package com.example.back.record.dto;

import com.example.back.record.listing.RecordPrice;
import com.example.back.record.record_dto.DescriptionDTO;
import com.example.back.record.record_dto.LandlordListingDTO;
import com.example.back.record.record_dto.ListingInfoDTO;
import com.example.back.record.record_dto.PictureDTO;
import com.example.back.utils.enumeration.BookingCategoryEnum;

import java.util.List;

public class DisplayListingDTO {
    DescriptionDTO description;
    List<PictureDTO> pictures;
    ListingInfoDTO infos;
    RecordPrice price;
    BookingCategoryEnum category;
    String location;
    LandlordListingDTO landlord;

    public DescriptionDTO getDescription() {
        return description;
    }

    public void setDescription(DescriptionDTO description) {
        this.description = description;
    }

    public List<PictureDTO> getPictures() {
        return pictures;
    }

    public void setPictures(List<PictureDTO> pictures) {
        this.pictures = pictures;
    }

    public ListingInfoDTO getInfos() {
        return infos;
    }

    public void setInfos(ListingInfoDTO infos) {
        this.infos = infos;
    }

    public RecordPrice getPrice() {
        return price;
    }

    public void setPrice(RecordPrice price) {
        this.price = price;
    }

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

    public LandlordListingDTO getLandlord() {
        return landlord;
    }

    public void setLandlord(LandlordListingDTO landlord) {
        this.landlord = landlord;
    }
}
