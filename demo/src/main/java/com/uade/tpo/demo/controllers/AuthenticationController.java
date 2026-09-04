package com.uade.tpo.demo.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.uade.tpo.demo.exceptions.InvalidUserException;
import com.uade.tpo.demo.exceptions.UserDuplicateException;
import com.uade.tpo.demo.entity.dto.AuthenticationRequest;
import com.uade.tpo.demo.entity.dto.AuthenticationResponse;
import com.uade.tpo.demo.entity.dto.RegisterRequest;
import com.uade.tpo.demo.service.AuthenticationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) 
            throws UserDuplicateException, InvalidUserException{
                return ResponseEntity.ok(service.register(request));
                }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }
}