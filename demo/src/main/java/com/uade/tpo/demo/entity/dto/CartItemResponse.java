package com.uade.tpo.demo.entity.dto;

import com.uade.tpo.demo.entity.CartItem;

import lombok.Data;

// Lo que se muestra de cada linea del carrito. Devuelve solo lo que el front
// necesita para dibujarla, en vez del producto entero con stock y categoria
@Data
public class CartItemResponse {

    private Long productId;
    private String name;
    private Double unitPrice;
    private Integer quantity;
    private Double subtotal;

    public static CartItemResponse from(CartItem item) {
        CartItemResponse response = new CartItemResponse();
        response.setProductId(item.getProduct().getId());
        response.setName(item.getProduct().getName());
        // El precio que se muestra es el que se va a cobrar, ya con el descuento
        response.setUnitPrice(item.getProduct().getFinalPrice());
        response.setQuantity(item.getQuantity());
        response.setSubtotal(item.getSubtotal());
        return response;
    }
}
