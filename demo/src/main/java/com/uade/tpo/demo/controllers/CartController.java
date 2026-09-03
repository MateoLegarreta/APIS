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
import com.uade.tpo.demo.entity.dto.UpdateCartItemRequest;
import com.uade.tpo.demo.exceptions.CartItemNotFoundException;
import com.uade.tpo.demo.exceptions.CartNotFoundException;
import com.uade.tpo.demo.exceptions.EmptyCartException;
import com.uade.tpo.demo.exceptions.InsufficientStockException;
import com.uade.tpo.demo.exceptions.InvalidQuantityException;
import com.uade.tpo.demo.exceptions.ProductNotFoundException;
import com.uade.tpo.demo.service.CartService;

@RestController
@RequestMapping("cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // GET /cart -> ver el carrito del usuario autenticado
    @GetMapping
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cartService.getCartByUser(user.getId()));
    }

    // POST /cart/items -> agregar un producto al carrito
    @PostMapping("/items")
    public ResponseEntity<Cart> addItem(
            @AuthenticationPrincipal User user,
            @RequestBody AddCartItemRequest request)
            throws ProductNotFoundException, InvalidQuantityException, InsufficientStockException {

        Cart cart = cartService.addProductToCart(user.getId(), request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(cart);
    }

    // PUT /cart/items/{productId} -> modificar la cantidad de un producto
    @PutMapping("/items/{productId}")
    public ResponseEntity<Cart> updateItem(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId,
            @RequestBody UpdateCartItemRequest request)
            throws CartNotFoundException, CartItemNotFoundException, InvalidQuantityException,
            InsufficientStockException {

        Cart cart = cartService.updateCartItem(user.getId(), productId, request.getQuantity());
        return ResponseEntity.ok(cart);
    }

    // DELETE /cart/items/{productId} -> eliminar un producto del carrito
    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Cart> removeItem(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId)
            throws CartNotFoundException, CartItemNotFoundException {

        Cart cart = cartService.removeProductFromCart(user.getId(), productId);
        return ResponseEntity.ok(cart);
    }

    // DELETE /cart -> vaciar el carrito completo
    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal User user)
            throws CartNotFoundException {

        cartService.clearCart(user.getId());
        return ResponseEntity.noContent().build();
    }

    // POST /cart/checkout -> confirmar la compra: calcula el total, valida y
    // descuenta el stock, crea el pedido (Order) y vacía el carrito
    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(@AuthenticationPrincipal User user)
            throws CartNotFoundException, EmptyCartException, InsufficientStockException {

        Order order = cartService.checkout(user.getId());
        return ResponseEntity.ok(order);
    }
}
