package com.cts.controller;
 
import com.cts.entity.CartItem;
import com.cts.entity.WishlistItem;
import com.cts.service.CartService;
import com.cts.service.WishlistService;
import com.cts.security.JwtUtil;
import com.cts.client.UserClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
 
@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {
 
    private final WishlistService wishlistService;
    private final CartService cartService;
    private final JwtUtil jwtUtil;
    private final UserClient userClient;
 
    @Autowired
    public WishlistController(WishlistService wishlistService, CartService cartService, JwtUtil jwtUtil, UserClient userClient) {
        this.wishlistService = wishlistService;
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
    public ResponseEntity<List<WishlistItem>> getWishlistItems(HttpServletRequest request) {
        Integer userId = getUserIdFromRequest(request);
        return ResponseEntity.ok(wishlistService.getAllWishlistItems(userId));
    }
 
    @PostMapping
    public ResponseEntity<WishlistItem> addWishlistItem(@RequestBody WishlistItem item, HttpServletRequest request) {
        Integer userId = getUserIdFromRequest(request);
        item.setUserId(userId);
        // Remove from cart if exists
        CartItem existingCartItem = cartService.getCartItemByProductAttributes(userId, item.getProductId(), item.getSize(), item.getColor());
        if (existingCartItem != null) {
            cartService.removeFromCart(existingCartItem.getId(), userId);
        }
        return ResponseEntity.ok(wishlistService.addToWishlist(item));
    }
 
    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeWishlistItem(@PathVariable Integer id, HttpServletRequest request) {
        Integer userId = getUserIdFromRequest(request);
        wishlistService.removeFromWishlist(id, userId);
        return ResponseEntity.ok().build();
    }
 
    @PostMapping("/move-to-cart/{id}")
    public ResponseEntity<?> moveToCart(@PathVariable Integer id, HttpServletRequest request) {
        Integer userId = getUserIdFromRequest(request);
        wishlistService.moveToCart(id, userId);
        return ResponseEntity.ok("Item moved to cart successfully");
    }
 
    @PostMapping("/move-to-wishlist/{cartItemId}")
    public ResponseEntity<?> moveToWishlist(@PathVariable Integer cartItemId, HttpServletRequest request) {
        Integer userId = getUserIdFromRequest(request);
        CartItem cartItem = cartService.getCartItemById(cartItemId, userId);
        if (cartItem == null) return ResponseEntity.notFound().build();
 
        WishlistItem wishlistItem = new WishlistItem();
        wishlistItem.setProductId(cartItem.getProductId());
        wishlistItem.setName(cartItem.getName());
        wishlistItem.setOriginalPrice(cartItem.getOriginalPrice());
        wishlistItem.setDiscount(cartItem.getDiscount());
        wishlistItem.setImage(cartItem.getImage());
        wishlistItem.setCategory(cartItem.getCategory());
        wishlistItem.setBrand(cartItem.getBrand());
        wishlistItem.setSize(cartItem.getSize());
        wishlistItem.setColor(cartItem.getColor());
        wishlistItem.setInstock(cartItem.getInstock());
        wishlistItem.setQuantity(cartItem.getQuantity());
        wishlistItem.setUserId(userId);
 
        wishlistService.addToWishlist(wishlistItem);
        cartService.removeFromCart(cartItemId, userId);
 
        return ResponseEntity.ok("Item moved to wishlist successfully");
    }
}