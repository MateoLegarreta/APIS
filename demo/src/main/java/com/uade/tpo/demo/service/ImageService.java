package com.uade.tpo.demo.service;

import com.uade.tpo.demo.entity.Image;
import com.uade.tpo.demo.exceptions.ImageNotFoundException;

// Todas las operaciones que se pueden hacer con las fotos
public interface ImageService {

    public Image create(Image image);

    public Image getImageById(Long imageId) throws ImageNotFoundException;

}
