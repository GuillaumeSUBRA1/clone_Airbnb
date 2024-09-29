package com.example.back.controller;

import com.example.back.infrastructure.config.SecurityUtils;
import com.example.back.record.dto.SaveListingDTO;
import com.example.back.record.record_dto.CreatedListingDTO;
import com.example.back.record.record_dto.DisplayCardListingDTO;
import com.example.back.record.record_dto.PictureDTO;
import com.example.back.record.record_dto.UserDTO;
import com.example.back.service.LandlordService;
import com.example.back.service.UserService;
import com.example.back.sharedKernel.service.State;
import com.example.back.utils.enumeration.StatusNotificationEnum;
import com.example.back.utils.exception.UserException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Controller
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/landlord")
public class LandlordController {
    private final Validator validator;
    private final ObjectMapper objectMapper;
    @Autowired
    LandlordService landlordService;
    @Autowired
    UserService userService;

    public LandlordController(Validator validator, ObjectMapper objectMapper) {
        this.validator = validator;
        this.objectMapper = objectMapper;
    }

    private static Function<MultipartFile, PictureDTO> mapMultiPartFileToPictureDTO() {
        return multipartFile -> {
            try {
                return new PictureDTO((multipartFile.getBytes()), multipartFile.getContentType(), false);
            } catch (IOException e) {
                throw new UserException(String.format("Can't parse multipart file : %s", multipartFile.getOriginalFilename()));
            }
        };
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CreatedListingDTO> create(MultipartHttpServletRequest req, @RequestPart(name = "dto") String saveListingDTOString) throws IOException {
        List<PictureDTO> pics = req.getFileMap().values().stream().map(mapMultiPartFileToPictureDTO()).toList();
        SaveListingDTO saveListingDTO = objectMapper.readValue(saveListingDTOString, SaveListingDTO.class);
        saveListingDTO.setPictures(pics);

        Set<ConstraintViolation<SaveListingDTO>> violations = validator.validate(saveListingDTO);
        if (!violations.isEmpty()) {
            String v = violations.stream().map(vio -> vio.getPropertyPath() + " " + vio.getMessage()).collect(Collectors.joining());
            ProblemDetail p = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, v);
            return ResponseEntity.of(p).build();
        }
        return ResponseEntity.ok(landlordService.create(saveListingDTO));
    }

    @GetMapping("/get-all")
    @PreAuthorize("hasAnyRole('" + SecurityUtils.ROLE_LANDLORD + "')")
    public ResponseEntity<List<DisplayCardListingDTO>> getAll() {
        UserDTO connected = userService.getAuthenticatedUser();
        List<DisplayCardListingDTO> properties = landlordService.getAllProperties(connected);
        return ResponseEntity.ok(properties);
    }

    @DeleteMapping("/delete")
    @PreAuthorize("hasAnyRole('" + SecurityUtils.ROLE_LANDLORD + "')")
    public ResponseEntity<UUID> delete(@RequestParam UUID pid) {
        UserDTO connected = userService.getAuthenticatedUser();
        State<UUID, String> deleteState = landlordService.delete(pid, connected);
        if (deleteState.getStatus().equals(StatusNotificationEnum.OK)) {
            return ResponseEntity.ok(deleteState.getValue());
        }
        if (deleteState.getStatus().equals(StatusNotificationEnum.UNAUTHORIZED)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
