package com.example.back.repository;

import com.example.back.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findOneByEmail(String email);

    Optional<UserEntity> findOneByPid(UUID pid);
}
