package com.example.back.service;

import com.example.back.entity.UserEntity;
import com.example.back.infrastructure.config.SecurityUtils;
import com.example.back.mapper.UserMapper;
import com.example.back.record.record_dto.UserDTO;
import com.example.back.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private static final String UPDATED_AT = "updated_at";

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserMapper userMapper;

    @Transactional
    public UserDTO getAuthenticatedUser() {
        OAuth2User u = (OAuth2User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserEntity user = SecurityUtils.mapAuth2ToUser(u.getAttributes());
        return getByEmail(user.getEmail()).orElseThrow();
    }

    @Transactional
    public Optional<UserDTO> getByEmail(String email) {
        Optional<UserEntity> u = userRepository.findOneByEmail(email);
        return u.map(userMapper::entityToDTO);
    }

    @Transactional
    public Optional<UserDTO> getByUid(UUID uuid) {
        Optional<UserEntity> u = userRepository.findOneByPid(uuid);
        return u.map(userMapper::entityToDTO);
    }

    public void syncByIdp(OAuth2User auth2User, boolean forceResync) {
        Map<String, Object> attr = auth2User.getAttributes();
        UserEntity user = SecurityUtils.mapAuth2ToUser(attr);
        Optional<UserEntity> userEntity = userRepository.findOneByEmail(user.getEmail());
        if (userEntity.isPresent()) {
            if (attr.get(UPDATED_AT) != null) {
                Instant last = userEntity.get().getLastModified();
                Instant modified = attr.get(UPDATED_AT) instanceof Instant i ? i : Instant.ofEpochSecond((Integer) attr.get(UPDATED_AT));
                if (modified.isAfter(last) || forceResync) {
                    updateUser(user);
                }
            }
        } else {
            userRepository.saveAndFlush(user);
        }
    }


    private void updateUser(UserEntity user) {
        Optional<UserEntity> userEntity = userRepository.findOneByEmail(user.getEmail());
        if (userEntity.isEmpty()) {
            UserEntity toUpdate = userEntity.get();
            toUpdate.setEmail(user.getEmail());
            toUpdate.setFirstName(user.getFirstName());
            toUpdate.setLastName(user.getLastName());
            toUpdate.setAuthorities(user.getAuthorities());
            toUpdate.setImage(user.getImage());
        }
    }
}
