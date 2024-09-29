package com.example.back.service;

import com.example.back.entity.ListingEntity;
import com.example.back.entity.PictureEntity;
import com.example.back.mapper.PictureMapper;
import com.example.back.record.record_dto.PictureDTO;
import com.example.back.repository.PictureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class PictureService {
    @Autowired
    PictureRepository pictureRepository;
    @Autowired
    PictureMapper pictureMapper;

    public List<PictureDTO> saveAll(List<PictureDTO> pics, ListingEntity l) {
        Set<PictureEntity> pictures = pictureMapper.pictureDTOToPictureEntity(pics);
        boolean first = true;
        for (PictureEntity pic : pictures) {
            pic.setCover(first);
            pic.setListing(l);
            first = false;
        }
        pictureRepository.saveAll(pictures);
        return pictureMapper.listOfPictureEntityToListOfPictureDTO(pictures.stream().toList());
    }
}
