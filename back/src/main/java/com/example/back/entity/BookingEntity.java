package com.example.back.entity;

import com.example.back.kernel.AbstractAuditingEntity;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "booking")
public class BookingEntity extends AbstractAuditingEntity<Long> {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "bookingSequenceGenerator")
    @SequenceGenerator(name = "bookingSequenceGenerator", sequenceName = "booking_id", allocationSize = 1)
    private Long id;

    @Column(name = "start_date", nullable = false)
    private OffsetDateTime start;

    @Column(name = "end_date", nullable = false)
    private OffsetDateTime end;

    @Column(nullable = false)
    private Integer total_price;

    @Column(nullable = false)
    private Integer travelers;

    @UuidGenerator
    @Column(nullable = false)
    private UUID pid;

    @Column(nullable = false)
    private UUID listing;

    @Column(nullable = false)
    private UUID tenant;

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public OffsetDateTime getStart() {
        return start;
    }

    public void setStart(OffsetDateTime start) {
        this.start = start;
    }

    public OffsetDateTime getEnd() {
        return end;
    }

    public void setEnd(OffsetDateTime end) {
        this.end = end;
    }

    public Integer getTotalPrice() {
        return total_price;
    }

    public void setTotalPrice(Integer total_price) {
        this.total_price = total_price;
    }

    public Integer getTravelers() {
        return travelers;
    }

    public void setTravelers(Integer travelers) {
        this.travelers = travelers;
    }

    public UUID getPid() {
        return pid;
    }

    public void setPid(UUID pid) {
        this.pid = pid;
    }

    public UUID getListing() {
        return listing;
    }

    public void setListing(UUID listing) {
        this.listing = listing;
    }

    public UUID getTenant() {
        return tenant;
    }

    public void setTenant(UUID tenant) {
        this.tenant = tenant;
    }
}
