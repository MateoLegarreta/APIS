package com.uade.tpo.demo.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.demo.entity.Cart;
import com.uade.tpo.demo.entity.CartItem;
import com.uade.tpo.demo.entity.Order;
import com.uade.tpo.demo.entity.OrderItem;
import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.exceptions.CartItemNotFoundException;
import com.uade.tpo.demo.exceptions.CartNotFoundException;
import com.uade.tpo.demo.exceptions.EmptyCartException;
import com.uade.tpo.demo.exceptions.InsufficientStockException;
import com.uade.tpo.demo.exceptions.InvalidQuantityException;
import com.uade.tpo.demo.exceptions.ProductNotFoundException;
import com.uade.tpo.demo.repository.CartRepository;
import com.uade.tpo.demo.repository.OrderRepository;
import com.uade.tpo.demo.repository.ProductRepository;
import com.uade.tpo.demo.repository.UserRepository;

// Maneja todo lo relacionado al carrito: agregar, sacar, modificar productos y confirmar la compra
@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    // Trae el carrito del usuario, y si todavia no tiene uno le crea uno vacio
    @Override
    public Cart getCartByUser(Long userId) {
        return getOrCreateCart(userId);
    }

    // Agrega un producto al carrito, si ya estaba le suma la cantidad
    @Override
    public Cart addProductToCart(Long userId, Long productId, Integer quantity)
            throws ProductNotFoundException, InvalidQuantityException, InsufficientStockException {

        if (quantity == null || quantity <= 0)
            throw new InvalidQuantityException();

        Product product = productRepository.findById(productId)
                .filter(p -> Boolean.TRUE.equals(p.getActive()))
                .orElseThrow(ProductNotFoundException::new);

        Cart cart = getOrCreateCart(userId);

        Optional<CartItem> existing = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        // Si el producto ya esta en el carrito, se suma a la cantidad existente
        int newQuantity = quantity;
        if (existing.isPresent())
            newQuantity += existing.get().getQuantity();

        if (newQuantity > product.getStock())
            throw new InsufficientStockException();

        if (existing.isPresent()) {
            existing.get().setQuantity(newQuantity);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(newQuantity);
            cart.getItems().add(item);
        }

        return cartRepository.save(cart);
    }

    // Cambia la cantidad de un producto que ya esta en el carrito
    @Override
    public Cart updateCartItem(Long userId, Long productId, Integer quantity)
            throws CartNotFoundException, CartItemNotFoundException, InvalidQuantityException,
            InsufficientStockException {

        if (quantity == null || quantity <= 0)
            throw new InvalidQuantityException();

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(CartNotFoundException::new);

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(CartItemNotFoundException::new);

        if (quantity > item.getProduct().getStock())
            throw new InsufficientStockException();

        // Aca se fija la cantidad exacta (no se suma a lo que ya habia)
        item.setQuantity(quantity);

        return cartRepository.save(cart);
    }

    // Saca un producto del carrito
    @Override
    public Cart removeProductFromCart(Long userId, Long productId)
            throws CartNotFoundException, CartItemNotFoundException {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(CartNotFoundException::new);

        boolean removed = cart.getItems().removeIf(i -> i.getProduct().getId().equals(productId));
        if (!removed)
            throw new CartItemNotFoundException();

        return cartRepository.save(cart);
    }

    // Saca todos los productos del carrito, pero el carrito sigue existiendo
    @Override
    public void clearCart(Long userId) throws CartNotFoundException {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(CartNotFoundException::new);

        cart.getItems().clear();
        cartRepository.save(cart);
    }

    // Confirma la compra: valida el stock, descuenta las cantidades, crea el
    // pedido con lo que habia en el carrito, y despues vacia el carrito
    @Override
    @Transactional
    public Order checkout(Long userId)
            throws CartNotFoundException, EmptyCartException, InsufficientStockException {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(CartNotFoundException::new);

        if (cart.getItems().isEmpty())
            throw new EmptyCartException();

        // 1) Chequear que haya stock de TODOS los productos antes de descontar nada
        for (CartItem item : cart.getItems()) {
            if (item.getQuantity() > item.getProduct().getStock())
                throw new InsufficientStockException();
        }

        User user = userRepository.findById(userId).orElseThrow();

        Order order = new Order();
        order.setUser(user);
        order.setDate(LocalDateTime.now());

        // 2) Descontar stock, armar los items del pedido y calcular el total
        double total = 0.0;
        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();

            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setUnitPrice(product.getFinalPrice());
            order.getItems().add(orderItem);

            total += product.getFinalPrice() * item.getQuantity();
        }
        order.setTotal(total);

        Order savedOrder = orderRepository.save(order);

        // 3) Vaciar el carrito luego de confirmar la compra
        cart.getItems().clear();
        cartRepository.save(cart);

        return savedOrder;
    }

    // Busca el carrito del usuario, y si no tiene le crea uno nuevo vacio
    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart newCart = new Cart();
            User user = userRepository.findById(userId).orElseThrow();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });
    }
}
