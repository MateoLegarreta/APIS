package com.uade.tpo.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.entity.Cart;
import com.uade.tpo.demo.entity.Order;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.entity.dto.AddCartItemRequest;
import com.uade.tpo.demo.entity.dto.CartResponse;
import com.uade.tpo.demo.entity.dto.MessageResponse;
import com.uade.tpo.demo.entity.dto.OrderResponse;
import com.uade.tpo.demo.entity.dto.UpdateCartItemRequest;
import com.uade.tpo.demo.exceptions.CartItemNotFoundException;
import com.uade.tpo.demo.exceptions.CartNotFoundException;
import com.uade.tpo.demo.exceptions.EmptyCartException;
import com.uade.tpo.demo.exceptions.InsufficientStockException;
import com.uade.tpo.demo.exceptions.InvalidQuantityException;
import com.uade.tpo.demo.exceptions.ProductNotFoundException;
import com.uade.tpo.demo.service.CartService;

// Rutas para manejar el carrito de compras del usuario logueado
@RestController
@RequestMapping("cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // Muestra el carrito del usuario logueado
    @GetMapping
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(CartResponse.from(cartService.getCartByUser(user.getId())));
    }

    // Agrega un producto al carrito
    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(
            @AuthenticationPrincipal User user,
            @RequestBody AddCartItemRequest request)
            throws ProductNotFoundException, InvalidQuantityException, InsufficientStockException {

        Cart cart = cartService.addProductToCart(user.getId(), request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(CartResponse.from(cart));
    }

    // Cambia la cantidad de un producto que ya esta en el carrito
    @PutMapping("/items/{productId}")
    public ResponseEntity<CartResponse> updateItem(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId,
            @RequestBody UpdateCartItemRequest request)
            throws CartNotFoundException, CartItemNotFoundException, InvalidQuantityException,
            InsufficientStockException {

        Cart cart = cartService.updateCartItem(user.getId(), productId, request.getQuantity());
        return ResponseEntity.ok(CartResponse.from(cart));
    }

    // Saca un producto del carrito
    @DeleteMapping("/items/{productId}")
    public ResponseEntity<CartResponse> removeItem(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId)
            throws CartNotFoundException, CartItemNotFoundException {

        Cart cart = cartService.removeProductFromCart(user.getId(), productId);
        return ResponseEntity.ok(CartResponse.from(cart));
    }

    // Vacia el carrito completo
    @DeleteMapping
    public ResponseEntity<MessageResponse> clearCart(@AuthenticationPrincipal User user)
            throws CartNotFoundException {

        cartService.clearCart(user.getId());
        return ResponseEntity.ok(new MessageResponse("Carrito vaciado"));
    }

    // Confirma la compra: crea el pedido con lo que hay en el carrito y despues lo vacia
    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(@AuthenticationPrincipal User user)
            throws CartNotFoundException, EmptyCartException, InsufficientStockException {

        Order order = cartService.checkout(user.getId());
        return ResponseEntity.ok(OrderResponse.from(order));
    }
}
