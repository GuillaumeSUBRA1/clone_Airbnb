package com.example.back.mapper;

import com.example.back.entity.AuthorityEntity;
import com.example.back.entity.UserEntity;
import com.example.back.record.record_dto.UserDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDTO entityToDTO(UserEntity user);

    default String authorithyToString(AuthorityEntity authority) {
        return authority.getName();
    }
}
