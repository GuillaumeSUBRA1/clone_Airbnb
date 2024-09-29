package com.example.back.repository;

import com.example.back.entity.ListingEntity;
import com.example.back.utils.enumeration.BookingCategoryEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ListingRepository extends JpaRepository<ListingEntity, Long> {

    @Query("SELECT l FROM ListingEntity l LEFT JOIN FETCH l.pictures p WHERE l.landlordPid = :landlordPid AND p.isCover = true")
    List<ListingEntity> findAllByLandlordPidFetchCoverPicture(UUID landlordPid);

    Long deleteByPidAndLandlordPid(UUID pid, UUID landlord_pid);

    @Query("SELECT l FROM ListingEntity l LEFT JOIN FETCH l.pictures p WHERE p.isCover = true AND l.category = :b")
    Page<ListingEntity> findAllByBookingCategoryWithCoverOnly(Pageable p, BookingCategoryEnum b);

    @Query("SELECT l FROM ListingEntity l LEFT JOIN FETCH l.pictures p WHERE p.isCover = true")
    Page<ListingEntity> findAllCoverOnly(Pageable p);

    Optional<ListingEntity> findByPid(UUID pid);

    List<ListingEntity> findAllByPidIn(List<UUID> pids);

    Optional<ListingEntity> findOneByPidAndLandlordPid(UUID listingPid, UUID landlordPid);

    Page<ListingEntity> findAllByLocationAndBathroomAndBedroomAndGuestAndBed(
            Pageable pageable, String location, int bathroom, int bedroom, int guest, int bed);
}
