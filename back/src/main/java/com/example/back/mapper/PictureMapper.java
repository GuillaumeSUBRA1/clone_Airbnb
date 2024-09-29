package com.example.back.mapper;

import com.example.back.entity.PictureEntity;
import com.example.back.record.record_dto.PictureDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface PictureMapper {

    Set<PictureEntity> pictureDTOToPictureEntity(List<PictureDTO> picturesDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "created", ignore = true)
    @Mapping(target = "lastModified", ignore = true)
    @Mapping(target = "listing", ignore = true)
    @Mapping(target = "cover", ignore = true)
    PictureEntity dtoToEntity(PictureDTO pictureDTO);

    List<PictureDTO> listOfPictureEntityToListOfPictureDTO(List<PictureEntity> pictures);

    @Mapping(target = "isCover", source = "cover")
    PictureDTO entityToDTO(PictureEntity pictureEntity);

    @Named("get-cover")
    default PictureDTO getCover(Set<PictureEntity> p) {
        return p.stream().findFirst().map(this::entityToDTO).orElseThrow();
    }
}
