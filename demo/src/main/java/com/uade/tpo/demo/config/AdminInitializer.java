package com.uade.tpo.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.uade.tpo.demo.entity.Role;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.repository.UserRepository;

// Crea el usuario administrador al arrancar la aplicacion. Hace falta porque el
// registro solo da de alta compradores, asi que no hay otra forma de tener un admin
@Configuration
public class AdminInitializer {

    @Value("${application.admin.email}")
    private String adminEmail;

    @Value("${application.admin.password}")
    private String adminPassword;

    // Corre una sola vez cuando arranca la app. Si el admin ya existe no hace nada
    @Bean
    public CommandLineRunner createAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.existsByEmail(adminEmail))
                return;

            User admin = User.builder()
                    .name("Admin")
                    .surname("Tienda")
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(Role.ADMIN)
                    .build();

            userRepository.save(admin);
        };
    }
}
