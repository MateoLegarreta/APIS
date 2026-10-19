package com.uade.tpo.demo.entity.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import com.uade.tpo.demo.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {

    @JsonProperty("access_token")
    private String accessToken;

    // El rol viaja aparte del token. El backend sigue buscandolo en la base
    // en cada pedido; esto es solo para que el front sepa que menu mostrar
    private Role role;
}
