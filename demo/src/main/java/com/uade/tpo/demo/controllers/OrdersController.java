package com.uade.tpo.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.uade.tpo.demo.entity.Order;
import com.uade.tpo.demo.exceptions.NotOrderOwnerException;
import com.uade.tpo.demo.exceptions.OrderNotFoundException;
import com.uade.tpo.demo.service.OrderService;

@RestController
@RequestMapping("orders")
public class OrdersController {

    @Autowired
    private OrderService orderService;

    // Trae todas las ordenes del usuario logueado
    @GetMapping
    public ResponseEntity<List<Order>> getMyOrders() {
        return ResponseEntity.ok(orderService.getMyOrders());
    }

    // Trae una orden puntual, si es del usuario logueado (o si es admin)
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getMyOrderById(@PathVariable Long orderId)
            throws OrderNotFoundException, NotOrderOwnerException {
        return ResponseEntity.ok(orderService.getMyOrderById(orderId));
    }

    // Trae todas las ordenes de la tienda, solo para el admin
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
}
