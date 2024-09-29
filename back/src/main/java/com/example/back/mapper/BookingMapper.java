package com.example.back.mapper;

import com.example.back.entity.BookingEntity;
import com.example.back.record.record_dto.BookedDateDTO;
import com.example.back.record.record_dto.NewBookingDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BookingMapper {

    BookingEntity newBookingDTOToEntity(NewBookingDTO booking);


    BookedDateDTO entityToCheck(BookingEntity booking);
}
