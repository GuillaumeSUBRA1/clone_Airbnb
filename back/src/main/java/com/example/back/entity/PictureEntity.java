package com.example.back.entity;


import com.example.back.kernel.AbstractAuditingEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "picture")
public class PictureEntity extends AbstractAuditingEntity<Long> {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "pictureSequenceGenerator")
    @SequenceGenerator(name = "pictureSequenceGenerator", sequenceName = "picture_id", allocationSize = 1)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "listing", referencedColumnName = "id")
    private ListingEntity listing;

    @Lob
    @Column(nullable = false)
    private byte[] file;

    private Boolean isCover;
    private String fileContentType;

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ListingEntity getListing() {
        return listing;
    }

    public void setListing(ListingEntity listing) {
        this.listing = listing;
    }

    public byte[] getFile() {
        return file;
    }

    public void setFile(byte[] file) {
        this.file = file;
    }

    public Boolean getCover() {
        return isCover;
    }

    public void setCover(Boolean cover) {
        isCover = cover;
    }

    public String getFileContentType() {
        return fileContentType;
    }

    public void setFileContentType(String fileContentType) {
        this.fileContentType = fileContentType;
    }
}
