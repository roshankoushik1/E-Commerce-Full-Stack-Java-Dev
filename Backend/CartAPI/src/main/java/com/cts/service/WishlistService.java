package com.cts.service;
 
import com.cts.entity.CartItem;
import com.cts.entity.WishlistItem;
import com.cts.repository.WishlistItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
 
@Service
public class WishlistService {
 
    private final WishlistItemRepository wishlistRepo;
    private final CartService cartService;
 
    @Autowired
    public WishlistService(WishlistItemRepository wishlistRepo, CartService cartService) {
        this.wishlistRepo = wishlistRepo;
        this.cartService = cartService;
    }
 
    // Get all wishlist items for a user
    public List<WishlistItem> getAllWishlistItems(Integer userId) {
        return wishlistRepo.findByUserId(userId);
    }
 
    // Add item to wishlist (user-specific)
    public WishlistItem addToWishlist(WishlistItem item) {
        

       List<WishlistItem> existingItems = wishlistRepo.findByUserId(item.getUserId());
       boolean isDuplicate = existingItems.stream()
        .anyMatch(existing -> existing.getProductId().equals(item.getProductId()));

       if (isDuplicate) {
           return null; // or throw an exception, or return existing item
       }

        return wishlistRepo.save(item);
    }
 
    // Remove item from wishlist (user-specific)
    public void removeFromWishlist(Integer id, Integer userId) {
        WishlistItem item = getWishlistItemById(id, userId);
        wishlistRepo.delete(item);
    }
 
    // Get single wishlist item by ID (user-specific)
    public WishlistItem getWishlistItemById(Integer id, Integer userId) {
        WishlistItem item = wishlistRepo.findById(id).orElse(null);
        if (item == null || !item.getUserId().equals(userId)) return null;
        return item;
    }
 
    // ----- Move WishlistItem to Cart -----
    public void moveToCart(Integer wishlistItemId, Integer userId) {
        WishlistItem wishlistItem = getWishlistItemById(wishlistItemId, userId);
        if (wishlistItem == null) throw new RuntimeException("Wishlist item not found");
 
        CartItem cartItem = new CartItem();
        cartItem.setProductId(wishlistItem.getProductId());
        cartItem.setName(wishlistItem.getName());
        cartItem.setOriginalPrice(wishlistItem.getOriginalPrice());
        cartItem.setDiscount(wishlistItem.getDiscount());
        cartItem.setDiscountedPrice(
                wishlistItem.getOriginalPrice() - (wishlistItem.getDiscount() != null ? wishlistItem.getDiscount() : 0)
        );
        cartItem.setImage(wishlistItem.getImage());
        cartItem.setCategory(wishlistItem.getCategory());
        cartItem.setBrand(wishlistItem.getBrand());
        cartItem.setSize(wishlistItem.getSize());
        cartItem.setColor(wishlistItem.getColor());
        cartItem.setInstock(wishlistItem.getInstock());
        cartItem.setQuantity(wishlistItem.getQuantity());
        cartItem.setUserId(userId);
 
        cartService.addToCart(cartItem);
        removeFromWishlist(wishlistItemId, userId);
    }
}