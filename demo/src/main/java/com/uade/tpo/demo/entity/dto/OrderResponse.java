package com.uade.tpo.demo.entity.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.uade.tpo.demo.entity.Order;
import com.uade.tpo.demo.entity.User;

import lombok.Data;

// Una compra como la ve el cliente. Del comprador solo muestra nombre y email,
// que es lo que la tienda necesita para preparar el pedido
@Data
public class OrderResponse {

    private Long id;
    private LocalDateTime date;
    private String buyerName;
    private String buyerEmail;
    private List<OrderItemResponse> items;
    private Double total;

    public static OrderResponse from(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setDate(order.getDate());

        User buyer = order.getUser();
        if (buyer != null) {
            response.setBuyerName(nombreCompleto(buyer));
            response.setBuyerEmail(buyer.getEmail());
        }

        response.setItems(order.getItems().stream()
                .map(OrderItemResponse::from)
                .toList());
        response.setTotal(order.getTotal());
        return response;
    }

    // Junta nombre y apellido salteando los que puedan venir vacios
    private static String nombreCompleto(User user) {
        String nombre = user.getName() == null ? "" : user.getName();
        String apellido = user.getSurname() == null ? "" : user.getSurname();
        return (nombre + " " + apellido).trim();
    }
}
