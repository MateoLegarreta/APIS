package com.uade.tpo.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.entity.Order;
import com.uade.tpo.demo.entity.Role;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.exceptions.NotOrderOwnerException;
import com.uade.tpo.demo.exceptions.OrderNotFoundException;
import com.uade.tpo.demo.repository.OrderRepository;

// Maneja las consultas de pedidos del usuario logueado
@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    // Devuelve los pedidos del usuario logueado, del mas nuevo al mas viejo
    public List<Order> getMyOrders() {
        return orderRepository.findByUserIdOrderByDateDesc(getLoggedUser().getId());
    }

    // Busca un pedido puntual, solo si es del usuario logueado (o si es admin)
    public Order getMyOrderById(Long orderId)
            throws OrderNotFoundException, NotOrderOwnerException {

        Optional<Order> result = orderRepository.findById(orderId);
        if (result.isEmpty())
            throw new OrderNotFoundException();

        Order order = result.get();
        User loggedUser = getLoggedUser();

        // El admin puede ver el pedido de cualquiera
        if (loggedUser.getRole() == Role.ADMIN)
            return order;

        // Si no es admin, solo puede ver sus propios pedidos
        if (!order.getUser().getId().equals(loggedUser.getId()))
            throw new NotOrderOwnerException();

        return order;
    }

    // Obtiene el usuario que esta logueado en este momento
    private User getLoggedUser() {
        return (User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }
}
