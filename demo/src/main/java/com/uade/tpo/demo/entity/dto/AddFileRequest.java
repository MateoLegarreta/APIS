package com.uade.tpo.demo.entity.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

// Lo que llega cuando se sube una foto. No es un JSON como los demas pedidos:
// es un formulario multipart, que es la forma de mandar archivos por HTTP
@Data
public class AddFileRequest {
    private MultipartFile file;
}
