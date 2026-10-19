package com.uade.tpo.demo.entity.dto;

import lombok.Builder;
import lombok.Data;

// Lo que devuelve la API. El campo file es la foto convertida a texto Base64
@Data
@Builder
public class ImageResponse {
    private Long id;
    private String file;
}
