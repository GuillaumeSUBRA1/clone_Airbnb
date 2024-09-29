package com.example.back.record.record_dto;

import java.util.Set;
import java.util.UUID;

public record UserDTO(UUID pid, String firstname, String lastName, String email, String image,
                      Set<String> authorities) {
}