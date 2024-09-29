package com.example.back.service;

import com.example.back.entity.ListingEntity;
import com.example.back.mapper.ListingMapper;
import com.example.back.record.dto.SaveListingDTO;
import com.example.back.record.record_dto.CreateBookingDTO;
import com.example.back.record.record_dto.CreatedListingDTO;
import com.example.back.record.record_dto.DisplayCardListingDTO;
import com.example.back.record.record_dto.UserDTO;
import com.example.back.repository.ListingRepository;
import com.example.back.sharedKernel.service.State;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LandlordService {

    @Autowired
    ListingRepository listingRepository;

    @Autowired
    ListingMapper listingMapper;

    @Autowired
    UserService userService;

    @Autowired
    Auth0Service auth0Service;

    @Autowired
    PictureService pictureService;

    public CreatedListingDTO create(SaveListingDTO saveListingDTO) {
        ListingEntity l = listingMapper.saveListingDTOToListing(saveListingDTO);
        UserDTO uConnected = userService.getAuthenticatedUser();
        l.setLandlordPid(uConnected.pid());
        ListingEntity savedListing = listingRepository.saveAndFlush(l);
        pictureService.saveAll(saveListingDTO.getPictures(), savedListing);
        auth0Service.addLandlordRoleToUser(uConnected);
        return listingMapper.listingToCreatedListingDTO(savedListing);
    }

    @Transactional
    public List<DisplayCardListingDTO> getAllProperties(UserDTO u) {
        List<ListingEntity> p = listingRepository.findAllByLandlordPidFetchCoverPicture(u.pid());
        return listingMapper.entityListToDisplayCardListingDTOList(p);
    }

    @Transactional
    public State<UUID, String> delete(UUID pid, UserDTO u) {
        Long deleted = listingRepository.deleteByPidAndLandlordPid(pid, u.pid());
        if (deleted > 0) {
            return State.<UUID, String>builder().forSuccess(pid);
        } else {
            return State.<UUID, String>builder().forUnauthorized("User is not authorized to delete this listing");
        }
    }

    public Optional<CreateBookingDTO> getByPid(UUID pid) {
        return listingRepository.findByPid(pid).map(listingMapper::listingToCreateBookingDTO);
    }

    public List<DisplayCardListingDTO> getCardByListPids(List<UUID> pids) {
        return listingRepository.findAllByPidIn(pids).stream()
                .map(listingMapper::entityToDisplayCardListingDTO).toList();
    }

    @Transactional
    public Optional<DisplayCardListingDTO> getByPidAndLandlordPid(UUID listingPid, UUID landlordPid) {
        return listingRepository.findOneByPidAndLandlordPid(listingPid, landlordPid).map(listingMapper::entityToDisplayCardListingDTO);
    }
}
