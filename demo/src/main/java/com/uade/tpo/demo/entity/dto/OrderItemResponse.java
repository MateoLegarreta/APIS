package com.uade.tpo.demo.entity.dto;

import com.uade.tpo.demo.entity.OrderItem;

import lombok.Data;

// Lo que se muestra de cada linea de una compra ya confirmada
@Data
public class OrderItemResponse {

    private Long productId;
    private String name;
    private Double unitPrice;
    private Integer quantity;
    private Double subtotal;

    public static OrderItemResponse from(OrderItem item) {
        OrderItemResponse response = new OrderItemResponse();
        response.setProductId(item.getProduct().getId());
        response.setName(item.getProduct().getName());
        // Aca el precio sale de la orden, no del producto: es el que se pago
        // ese dia y no cambia aunque despues cambie el precio de lista
        response.setUnitPrice(item.getUnitPrice());
        response.setQuantity(item.getQuantity());
        response.setSubtotal(item.getSubtotal());
        return response;
    }
}
