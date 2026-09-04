package com.uade.tpo.demo.service;

import java.util.List;

import com.uade.tpo.demo.entity.Order;
import com.uade.tpo.demo.exceptions.NotOrderOwnerException;
import com.uade.tpo.demo.exceptions.OrderNotFoundException;

// Todas las operaciones que se pueden hacer con los pedidos ya confirmados
public interface OrderService {

    public List<Order> getMyOrders();

    public Order getMyOrderById(Long orderId)
            throws OrderNotFoundException, NotOrderOwnerException;
}
