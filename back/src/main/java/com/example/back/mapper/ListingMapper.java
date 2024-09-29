package com.example.back.mapper;

import com.example.back.entity.ListingEntity;
import com.example.back.record.dto.DisplayListingDTO;
import com.example.back.record.dto.SaveListingDTO;
import com.example.back.record.listing.RecordPrice;
import com.example.back.record.record_dto.CreateBookingDTO;
import com.example.back.record.record_dto.CreatedListingDTO;
import com.example.back.record.record_dto.DisplayCardListingDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {PictureMapper.class})
public interface ListingMapper {

    @Mapping(target = "landlordPid", ignore = true)
    @Mapping(target = "pid", ignore = true)
    @Mapping(target = "lastModified", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "created", ignore = true)
    @Mapping(target = "pictures", ignore = true)
    @Mapping(target = "category", source = "category")
    @Mapping(target = "title", source = "description.title.value")
    @Mapping(target = "description", source = "description.description.value")
    @Mapping(target = "guest", source = "infos.guest.value")
    @Mapping(target = "bedroom", source = "infos.bedroom.value")
    @Mapping(target = "bed", source = "infos.bed.value")
    @Mapping(target = "bathroom", source = "infos.bath.value")
    @Mapping(target = "price", source = "price.value")
    ListingEntity saveListingDTOToListing(SaveListingDTO saveListingDTO);

    CreatedListingDTO listingToCreatedListingDTO(ListingEntity listing);

    @Mapping(target = "cover", source = "pictures")
    List<DisplayCardListingDTO> entityListToDisplayCardListingDTOList(List<ListingEntity> listing);

    @Mapping(target = "cover", source = "pictures", qualifiedByName = "get-cover")
    DisplayCardListingDTO entityToDisplayCardListingDTO(ListingEntity listing);

    @Mapping(target = "landlord", ignore = true)
    @Mapping(target = "description.title.value", source = "title")
    @Mapping(target = "description.description.value", source = "description")
    @Mapping(target = "infos.bedroom.value", source = "bedroom")
    @Mapping(target = "infos.bed.value", source = "bed")
    @Mapping(target = "infos.bath.value", source = "bathroom")
    @Mapping(target = "infos.guest.value", source = "guest")
    @Mapping(target = "category", source = "category")
    @Mapping(target = "price.value", source = "price")
    DisplayListingDTO listingToDisplayListingDTO(ListingEntity listing);

    CreateBookingDTO listingToCreateBookingDTO(ListingEntity listing);

    default RecordPrice mapPriceToRecordPrice(int p) {
        return new RecordPrice(p);
    }
}
