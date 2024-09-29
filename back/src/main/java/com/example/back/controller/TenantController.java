package com.example.back.controller;

import com.example.back.record.dto.DisplayListingDTO;
import com.example.back.record.record_dto.DisplayCardListingDTO;
import com.example.back.record.record_dto.SearchDTO;
import com.example.back.service.TenantService;
import com.example.back.sharedKernel.service.State;
import com.example.back.utils.enumeration.BookingCategoryEnum;
import com.example.back.utils.enumeration.StatusNotificationEnum;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Controller
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/tenant")
public class TenantController {

    @Autowired
    TenantService tenantService;

    @GetMapping("/get-all-by-category")
    public ResponseEntity<Page<DisplayCardListingDTO>> findAllByCategory(Pageable pageable, @RequestParam BookingCategoryEnum category) {
        return ResponseEntity.ok(tenantService.getAllByCategory(pageable, category));
    }

    @GetMapping("/get-one")
    public ResponseEntity<DisplayListingDTO> getOne(@RequestParam UUID pid) {
        State<DisplayListingDTO, String> dState = tenantService.getOne(pid);
        if (dState.getStatus().equals(StatusNotificationEnum.OK)) {
            return ResponseEntity.ok(dState.getValue());

        } else {
            ProblemDetail p = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, dState.getError());
            return ResponseEntity.of(p).build();
        }
    }

    @PostMapping("/search")
    public ResponseEntity<Page<DisplayCardListingDTO>> search(Pageable pageable, @Valid @RequestBody SearchDTO search) {
        return ResponseEntity.ok(tenantService.search(pageable, search));
    }
}
