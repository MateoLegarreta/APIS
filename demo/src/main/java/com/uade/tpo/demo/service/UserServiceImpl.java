package com.uade.tpo.demo.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.entity.dto.UserRequest;
import com.uade.tpo.demo.exceptions.InvalidUserException;
import com.uade.tpo.demo.exceptions.UserDuplicateException;
import com.uade.tpo.demo.exceptions.UserNotFoundException;
import com.uade.tpo.demo.repository.UserRepository;

// Maneja la administracion de usuarios: listarlos, editarlos y borrarlos
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    public Page<User> getUsers(PageRequest pageRequest) {

        return userRepository.findAll(pageRequest);
    }

    public Optional<User> getUserById(Long userId) {

        return userRepository.findById(userId);
    }

    // Edita los datos de un usuario, si el email nuevo no esta usado por otro
    public User updateUser(Long userId, UserRequest userRequest)
            throws UserNotFoundException, InvalidUserException, UserDuplicateException {

        Optional<User> result = userRepository.findById(userId);
        if (result.isEmpty())
            throw new UserNotFoundException();

        validateUser(userRequest);

        if (userRepository.existsByEmailAndIdNot(userRequest.getEmail(), userId))
            throw new UserDuplicateException();

        User user = result.get();
        user.setEmail(userRequest.getEmail());
        user.setName(userRequest.getName());
        user.setSurname(userRequest.getSurname());

        return userRepository.save(user);
    }

    // Borra un usuario
    public void deleteUser(Long userId) throws UserNotFoundException {
        if(!userRepository.existsById(userId))
            throw new UserNotFoundException();

        userRepository.deleteById(userId);
    }

    // Revisa que los datos del usuario tengan sentido antes de guardarlos
    private void validateUser(UserRequest userRequest) throws InvalidUserException {
        if (userRequest.getEmail() == null || userRequest.getEmail().isBlank())
            throw new InvalidUserException();

        if (userRequest.getName() == null || userRequest.getName().isBlank())
            throw new InvalidUserException();

        if (userRequest.getSurname() == null || userRequest.getSurname().isBlank())
            throw new InvalidUserException();
    }
    
}
