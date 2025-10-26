package com.cts.controller;
 
import com.cts.entity.CartItem;
import com.cts.service.CartService;
import com.cts.security.JwtUtil;
import com.cts.client.UserClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
 
@RestController
@RequestMapping("/api/cart")
public class CartController {
 
	private final CartService cartService;
	private final JwtUtil jwtUtil;
	private final UserClient userClient;
 
	public CartController(CartService cartService, JwtUtil jwtUtil, UserClient userClient) {
	    this.cartService = cartService;
	    this.jwtUtil = jwtUtil;
	    this.userClient = userClient;
	}
 
	private Integer getUserIdFromRequest(HttpServletRequest request) {
	    String token = jwtUtil.extractToken(request);
	    String email = jwtUtil.extractUsername(token);
	    return userClient.getUserIdByEmail(email);
	}
 
	@GetMapping
	public List<CartItem> getCartItems(HttpServletRequest request) {
	    Integer userId = getUserIdFromRequest(request);
	    return cartService.getAllCartItems(userId);
	}
 
	@PostMapping
	public CartItem addCartItem(@RequestBody CartItem item, HttpServletRequest request) {
	    Integer userId = getUserIdFromRequest(request);
	    item.setUserId(userId);
	    return cartService.addToCart(item);
	}
 
	@PutMapping("/{id}")
	public CartItem updateQuantity(@PathVariable Integer id, @RequestParam Integer quantity, HttpServletRequest request) {
	    Integer userId = getUserIdFromRequest(request);
	    return cartService.updateQuantity(id, quantity, userId);
	}

	@PutMapping("/variant")
	public ResponseEntity<CartItem> updateVariantQuantity(
	        @RequestParam Integer productId,
	        @RequestParam String size,
	        @RequestParam String color,
	        @RequestParam Integer quantity,
	        HttpServletRequest request) {
	    Integer userId = getUserIdFromRequest(request);
	    CartItem item = cartService.getCartItemByProductAttributes(userId, productId, size, color);
	    if (item == null) {
	        return ResponseEntity.notFound().build();
	    }
	    CartItem updated = cartService.updateQuantity(item.getId(), quantity, userId);
	    return ResponseEntity.ok(updated);
	}
 
	@GetMapping("/{id}")
	public ResponseEntity<CartItem> getCartItem(@PathVariable Integer id, HttpServletRequest request) {
	    Integer userId = getUserIdFromRequest(request);
	    CartItem item = cartService.getCartItemById(id, userId);
	    if (item == null) {
	        return ResponseEntity.notFound().build();
	    }
	    return ResponseEntity.ok(item);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteCartItem(@PathVariable Integer id, HttpServletRequest request) {
	    Integer userId = getUserIdFromRequest(request);
	    cartService.removeFromCart(id, userId);
	    return ResponseEntity.ok().build();
	}
}