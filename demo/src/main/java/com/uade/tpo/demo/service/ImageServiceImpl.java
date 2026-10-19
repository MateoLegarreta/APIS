package com.uade.tpo.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.entity.Image;
import com.uade.tpo.demo.exceptions.ImageNotFoundException;
import com.uade.tpo.demo.repository.ImageRepository;

@Service
public class ImageServiceImpl implements ImageService {

    @Autowired
    private ImageRepository imageRepository;

    @Override
    public Image create(Image image) {
        return imageRepository.save(image);
    }

    // Si el id no existe avisa con un 404 en vez de romper con un error 500
    @Override
    public Image getImageById(Long imageId) throws ImageNotFoundException {
        return imageRepository.findById(imageId)
                .orElseThrow(ImageNotFoundException::new);
    }
}
