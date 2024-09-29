package com.example.back.entity;

import com.example.back.kernel.AbstractAuditingEntity;
import com.example.back.utils.enumeration.BookingCategoryEnum;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "listing")
public class ListingEntity extends AbstractAuditingEntity<Long> {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "listingSequenceGenerator")
    @SequenceGenerator(name = "listingSequenceGenerator", sequenceName = "listing_id", allocationSize = 1)
    private Long id;

    @UuidGenerator
    @Column(nullable = false)
    private UUID pid;
    private String title;
    private String description;
    private Integer guest;
    private Integer bedroom;
    private Integer bed;
    private Integer bathroom;
    private Integer price;
    private String location;
    @Column(name = "landlord_pid")
    private UUID landlordPid;

    @OneToMany(mappedBy = "listing", cascade = CascadeType.REMOVE)
    private Set<PictureEntity> pictures = new HashSet<>();

    @Enumerated(EnumType.STRING)
    private BookingCategoryEnum category;

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UUID getPid() {
        return pid;
    }

    public void setPid(UUID pid) {
        this.pid = pid;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getGuest() {
        return guest;
    }

    public void setGuest(Integer guest) {
        this.guest = guest;
    }

    public Integer getBedroom() {
        return bedroom;
    }

    public void setBedroom(Integer bedroom) {
        this.bedroom = bedroom;
    }

    public Integer getBed() {
        return bed;
    }

    public void setBed(Integer bed) {
        this.bed = bed;
    }

    public Integer getBathroom() {
        return bathroom;
    }

    public void setBathroom(Integer bathroom) {
        this.bathroom = bathroom;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public UUID getLandlordPid() {
        return landlordPid;
    }

    public void setLandlordPid(UUID landlordPid) {
        this.landlordPid = landlordPid;
    }

    public Set<PictureEntity> getPictures() {
        return pictures;
    }

    public void setPictures(Set<PictureEntity> pictures) {
        this.pictures = pictures;
    }

    public BookingCategoryEnum getCategory() {
        return category;
    }

    public void setCategory(BookingCategoryEnum category) {
        this.category = category;
    }
}
