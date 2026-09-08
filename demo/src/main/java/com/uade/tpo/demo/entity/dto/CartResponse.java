package com.uade.tpo.demo.entity.dto;

import java.util.List;

import com.uade.tpo.demo.entity.Cart;

import lombok.Data;

// El carrito como lo ve el cliente: las lineas y el total. No expone el id del
// carrito ni el usuario, porque el carrito se identifica por el token
@Data
public class CartResponse {

    private List<CartItemResponse> items;
    private Double total;

    public static CartResponse from(Cart cart) {
        CartResponse response = new CartResponse();
        response.setItems(cart.getItems().stream()
                .map(CartItemResponse::from)
                .toList());
        response.setTotal(cart.getTotal());
        return response;
    }
}
