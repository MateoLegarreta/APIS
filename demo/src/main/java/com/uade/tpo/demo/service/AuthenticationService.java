package com.uade.tpo.demo.service;

import com.uade.tpo.demo.entity.Role;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.uade.tpo.demo.exceptions.UserDuplicateException;
import com.uade.tpo.demo.exceptions.InvalidUserException;
import com.uade.tpo.demo.config.JwtService;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.entity.dto.AuthenticationRequest;
import com.uade.tpo.demo.entity.dto.AuthenticationResponse;
import com.uade.tpo.demo.entity.dto.RegisterRequest;
import com.uade.tpo.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

// Se encarga del registro y el login de usuarios
@Service
@RequiredArgsConstructor
public class AuthenticationService {
        private final UserRepository repository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        // Crea un usuario nuevo y le devuelve un token para que quede logueado.
        // No permite emails repetidos ni registrarse directamente como admin
        public AuthenticationResponse register(RegisterRequest request)
                        throws UserDuplicateException, InvalidUserException {

                if (repository.existsByEmail(request.getEmail()))
                        throw new UserDuplicateException();

                Role role = request.getRole();
                if (role == null)
                        role = Role.BUYER;
                if (role == Role.ADMIN)
                        throw new InvalidUserException();

                var user = User.builder()
                                .name(request.getName())
                                .surname(request.getSurname())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(role)
                                .build();

                        repository.save(user);
                        var jwtToken = jwtService.generateToken(user);
                        return AuthenticationResponse.builder()
                                        .accessToken(jwtToken)
                                        .build();
        } 

        // Revisa que el email y la contraseña sean correctos y devuelve un token
        public AuthenticationResponse authenticate(AuthenticationRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));
                var user = repository.findByEmail(request.getEmail())
                                .orElseThrow();
                var jwtToken = jwtService.generateToken(user);
                return AuthenticationResponse.builder()
                                .accessToken(jwtToken)
                                .build();
        }
}
