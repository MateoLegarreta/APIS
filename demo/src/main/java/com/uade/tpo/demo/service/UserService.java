package com.uade.tpo.demo.service;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.entity.dto.UserRequest;
import com.uade.tpo.demo.exceptions.InvalidUserException;
import com.uade.tpo.demo.exceptions.UserDuplicateException;
import com.uade.tpo.demo.exceptions.UserNotFoundException;

public interface UserService {
    public Page<User> getUsers(PageRequest pageRequest);
    public Optional<User> getUserById(Long userId);
    public User updateUser(Long userId, UserRequest userRequest) throws UserNotFoundException, InvalidUserException, UserDuplicateException;
    public void deleteUser(Long userId) throws UserNotFoundException;
}
