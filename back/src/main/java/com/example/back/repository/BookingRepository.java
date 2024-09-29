package com.example.back.repository;

import com.example.back.entity.BookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<BookingEntity, Long> {

    @Query("SELECT CASE WHEN COUNT(b)>0 THEN true ELSE false END " +
            "FROM BookingEntity b WHERE NOT (b.end <= :start or b.start>=:end) " +
            "AND b.listing =:pid")
    boolean existsByInterval(OffsetDateTime start, OffsetDateTime end, UUID pid);

    List<BookingEntity> findAllByListing(UUID listing);

    List<BookingEntity> findAllByTenant(UUID tenant);

    Integer deleteByTenantAndPid(UUID tenant, UUID pid);

    int deleteByPidAndListing(UUID pid, UUID listingPid);

    List<BookingEntity> findAllByListingIn(List<UUID> pids);

    @Query("SELECT b FROM BookingEntity b WHERE NOT (b.end <= :start or b.start>=:end) AND b.listing IN :listing")
    List<BookingEntity> findAllMatchWithDate(List<UUID> listing, OffsetDateTime start, OffsetDateTime end);
}
