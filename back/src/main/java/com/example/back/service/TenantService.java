package com.example.back.service;

import com.example.back.entity.ListingEntity;
import com.example.back.mapper.ListingMapper;
import com.example.back.record.dto.DisplayListingDTO;
import com.example.back.record.record_dto.DisplayCardListingDTO;
import com.example.back.record.record_dto.LandlordListingDTO;
import com.example.back.record.record_dto.SearchDTO;
import com.example.back.record.record_dto.UserDTO;
import com.example.back.repository.ListingRepository;
import com.example.back.sharedKernel.service.State;
import com.example.back.utils.enumeration.BookingCategoryEnum;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TenantService {

    @Autowired
    ListingRepository listingRepository;

    @Autowired
    ListingMapper listingMapper;

    @Autowired
    UserService userService;

    @Autowired
    BookingService bookingService;

    public Page<DisplayCardListingDTO> getAllByCategory(Pageable p, BookingCategoryEnum c) {
        Page<ListingEntity> page;
        if (c == BookingCategoryEnum.ALL) {
            page = listingRepository.findAllCoverOnly(p);
        } else {
            page = listingRepository.findAllByBookingCategoryWithCoverOnly(p, c);
        }
        return page.map(listingMapper::entityToDisplayCardListingDTO);
    }

    @Transactional
    public State<DisplayListingDTO, String> getOne(UUID pid) {
        Optional<ListingEntity> lOpt = listingRepository.findByPid(pid);

        if (lOpt.isEmpty()) {
            return State.<DisplayListingDTO, String>builder().forError(String.format("Listing doesn't exist for pid : %s", pid));
        }

        DisplayListingDTO d = listingMapper.listingToDisplayListingDTO(lOpt.get());
        UserDTO u = userService.getByUid(lOpt.get().getLandlordPid()).orElseThrow();
        LandlordListingDTO landlordListingDTO = new LandlordListingDTO(u.firstname(), u.image());

        d.setLandlord(landlordListingDTO);

        return State.<DisplayListingDTO, String>builder().forSuccess(d);
    }

    @Transactional
    public Page<DisplayCardListingDTO> search(Pageable pageable, SearchDTO search) {
        Page<ListingEntity> p = listingRepository.findAllByLocationAndBathroomAndBedroomAndGuestAndBed(
                pageable,
                search.location(),
                search.infos().bath().value(),
                search.infos().bedroom().value(),
                search.infos().guest().value(),
                search.infos().bed().value()
        );
        List<UUID> l = p.stream().map(ListingEntity::getPid).toList();
        List<UUID> b = bookingService.getBookingMatchByListingAndBookingDate(l, search.dates());

        List<DisplayCardListingDTO> listings = p.stream().filter(listing -> !b.contains(listing.getPid())).
                map(listingMapper::entityToDisplayCardListingDTO).toList();

        return new PageImpl<>(listings, pageable, listings.size());
    }
}
