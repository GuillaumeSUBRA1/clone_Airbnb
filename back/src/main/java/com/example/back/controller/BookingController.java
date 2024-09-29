package com.example.back.controller;

import com.example.back.infrastructure.config.SecurityUtils;
import com.example.back.record.record_dto.BookedDateDTO;
import com.example.back.record.record_dto.BookedListingDTO;
import com.example.back.record.record_dto.NewBookingDTO;
import com.example.back.service.BookingService;
import com.example.back.sharedKernel.service.State;
import com.example.back.utils.enumeration.StatusNotificationEnum;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Controller
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/booking")
public class BookingController {

    @Autowired
    BookingService bookingService;

    @PostMapping("/create")
    public ResponseEntity<Boolean> create(@Valid @RequestBody NewBookingDTO newBookingDTO) {
        State<Void, String> state = bookingService.create(newBookingDTO);
        if (state.getStatus().equals(StatusNotificationEnum.ERROR)) {
            ProblemDetail p = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, state.getError());
            return ResponseEntity.of(p).build();
        }
        return ResponseEntity.ok(true);
    }

    @GetMapping("/check-available")
    public ResponseEntity<List<BookedDateDTO>> checkAvailable(@RequestParam UUID listingPid) {
        return ResponseEntity.ok(bookingService.checkAvailable(listingPid));
    }

    @GetMapping("/get")
    public ResponseEntity<List<BookedListingDTO>> getBooked() {
        return ResponseEntity.ok(bookingService.getBookedListing());
    }

    @DeleteMapping("/cancel")
    public ResponseEntity<UUID> cancel(@RequestParam UUID bookingPid,
                                       @RequestParam UUID listingPid,
                                       @RequestParam boolean isLandlord) {
        State<UUID, String> state = bookingService.cancel(bookingPid, listingPid, isLandlord);
        if (state.getStatus().equals(StatusNotificationEnum.ERROR)) {
            ProblemDetail p = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, state.getError());
            return ResponseEntity.of(p).build();
        } else {
            return ResponseEntity.ok(bookingPid);
        }
    }

    @GetMapping("/get-landlord")
    @PreAuthorize("hasAnyRole('" + SecurityUtils.ROLE_LANDLORD + "')")
    public ResponseEntity<List<BookedListingDTO>> getLanlordBooked() {
        return ResponseEntity.ok(bookingService.getBookedListingForLandlord());
    }
}
