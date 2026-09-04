package com.uade.tpo.demo.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.uade.tpo.demo.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Dice si ya existe un usuario con ese email
    boolean existsByEmail(String email);

    // Dice si otro usuario (distinto al indicado) ya tiene ese email, para validar ediciones
    boolean existsByEmailAndIdNot(String email, Long id);

    Optional<User> findByEmail(String email);
}
