package com.example.back.service;

import com.example.back.entity.BookingEntity;
import com.example.back.infrastructure.config.SecurityUtils;
import com.example.back.mapper.BookingMapper;
import com.example.back.record.listing.RecordPrice;
import com.example.back.record.record_dto.*;
import com.example.back.repository.BookingRepository;
import com.example.back.sharedKernel.service.State;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BookingService {
    @Autowired
    BookingRepository bookingRepository;

    @Autowired
    BookingMapper bookingMapper;

    @Autowired
    UserService userService;

    @Autowired
    LandlordService landlordService;

    public State<Void, String> create(NewBookingDTO newBookingDTO) {
        BookingEntity b = bookingMapper.newBookingDTOToEntity(newBookingDTO);

        Optional<CreateBookingDTO> bDtoOpt = landlordService.getByPid(newBookingDTO.pid());
        if (bDtoOpt.isEmpty()) {
            return State.<Void, String>builder().forError("Landlord pid not found");
        }

        boolean exists = bookingRepository.existsByInterval(newBookingDTO.start(), newBookingDTO.end(), newBookingDTO.pid());
        if (exists) {
            return State.<Void, String>builder().forError("This booking already exists");
        }

        CreateBookingDTO cbDTO = bDtoOpt.get();
        b.setListing(cbDTO.pid());

        UserDTO u = userService.getAuthenticatedUser();
        b.setTenant(u.pid());
        b.setTravelers(1);

        long nbNights = ChronoUnit.DAYS.between(b.getStart(), b.getEnd());
        b.setTotalPrice((int) (nbNights * cbDTO.price().value()));

        bookingRepository.save(b);

        return State.<Void, String>builder().forSuccess();
    }

    @Transactional
    public List<BookedDateDTO> checkAvailable(UUID pid) {
        return bookingRepository.findAllByListing(pid).stream().map(bookingMapper::entityToCheck).toList();
    }

    @Transactional
    public List<BookedListingDTO> getBookedListing() {
        UserDTO u = userService.getAuthenticatedUser();
        List<BookingEntity> l = bookingRepository.findAllByTenant(u.pid());
        List<UUID> pids = l.stream().map(BookingEntity::getListing).toList();
        List<DisplayCardListingDTO> cards = landlordService.getCardByListPids(pids);

        return mapBookingToBookedListing(l, cards);
    }

    public List<BookedListingDTO> mapBookingToBookedListing(List<BookingEntity> b, List<DisplayCardListingDTO> d) {
        return b.stream().map(booking -> {
            DisplayCardListingDTO card = d.stream().filter(c -> c.pid().equals(booking.getListing())).findFirst().orElseThrow();
            BookedDateDTO dates = bookingMapper.entityToCheck(booking);
            return new BookedListingDTO(
                    card.cover(),
                    card.location(),
                    dates,
                    new RecordPrice(booking.getTotalPrice()),
                    booking.getPid(),
                    card.pid()
            );
        }).toList();
    }

    @Transactional
    public State<UUID, String> cancel(UUID bookingPid, UUID listingPid, boolean isLandlord) {
        UserDTO u = userService.getAuthenticatedUser();
        int deleted = 0;
        if (SecurityUtils.hasCurrentUserAnyAuthority(SecurityUtils.ROLE_LANDLORD) && isLandlord) {
            deleted = deletionByLandlord(bookingPid, listingPid, u, deleted);
        } else {
            deleted = bookingRepository.deleteByTenantAndPid(u.pid(), bookingPid);
        }
        if (deleted > 0) {
            return State.<UUID, String>builder().forSuccess(bookingPid);
        } else {
            return State.<UUID, String>builder().forError("Booking not found");
        }
    }

    public int deletionByLandlord(UUID bookingPid, UUID listingPid, UserDTO u, int deleted) {
        Optional<DisplayCardListingDTO> card = landlordService.getByPidAndLandlordPid(listingPid, u.pid());
        if (card.isPresent()) {
            deleted = bookingRepository.deleteByPidAndListing(bookingPid, card.get().pid());
        }
        return deleted;
    }

    @Transactional
    public List<BookedListingDTO> getBookedListingForLandlord() {
        UserDTO u = userService.getAuthenticatedUser();
        List<DisplayCardListingDTO> properties = landlordService.getAllProperties(u);
        List<UUID> pids = properties.stream().map(DisplayCardListingDTO::pid).toList();
        List<BookingEntity> b = bookingRepository.findAllByListingIn(pids);
        return mapBookingToBookedListing(b, properties);
    }

    public List<UUID> getBookingMatchByListingAndBookingDate(List<UUID> listingPid, BookedDateDTO bookedDateDTO) {
        return bookingRepository.findAllMatchWithDate(listingPid, bookedDateDTO.start(), bookedDateDTO.end())
                .stream().map(BookingEntity::getListing).toList();
    }
}
