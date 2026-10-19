package com.uade.tpo.demo.controllers;

import java.io.IOException;
import java.net.URI;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.Base64;

import javax.sql.rowset.serial.SerialBlob;
import javax.sql.rowset.serial.SerialException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.entity.Image;
import com.uade.tpo.demo.entity.dto.AddFileRequest;
import com.uade.tpo.demo.entity.dto.ImageResponse;
import com.uade.tpo.demo.exceptions.ImageNotFoundException;
import com.uade.tpo.demo.service.ImageService;

// Rutas para subir y ver las fotos de los productos
@RestController
@RequestMapping("images")
public class ImagesController {

    @Autowired
    private ImageService imageService;

    // Devuelve la foto pasada a texto Base64, para que el front la pueda poner
    // directo en un <img src="data:image/jpeg;base64,..."> sin pedir nada mas.
    // Es publico porque el catalogo se puede ver sin iniciar sesion
    @GetMapping("/{imageId}")
    public ResponseEntity<ImageResponse> getImageById(@PathVariable Long imageId)
            throws ImageNotFoundException, SQLException {
        Image image = imageService.getImageById(imageId);
        Blob blob = image.getImage();

        // getBytes arranca en 1 y no en 0 porque es la numeracion de SQL
        String enTexto = Base64.getEncoder()
                .encodeToString(blob.getBytes(1, (int) blob.length()));

        return ResponseEntity.ok(ImageResponse.builder()
                .id(image.getId())
                .file(enTexto)
                .build());
    }

    // Recibe el archivo y lo guarda en la base como Blob.
    // Solo el admin puede subir fotos
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ResponseEntity<ImageResponse> addImage(AddFileRequest request)
            throws IOException, SerialException, SQLException {
        byte[] bytes = request.getFile().getBytes();
        Blob blob = new SerialBlob(bytes);
        Image guardada = imageService.create(Image.builder().image(blob).build());

        // Devuelve el id, que es lo que despues hay que guardar en el producto
        return ResponseEntity.created(URI.create("/images/" + guardada.getId()))
                .body(ImageResponse.builder().id(guardada.getId()).build());
    }
}
