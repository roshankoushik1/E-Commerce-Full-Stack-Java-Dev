// WishlistItemRepository.java
package com.cts.repository;
 
import com.cts.entity.WishlistItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
 
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Integer> {
 
    // Find a wishlist item for a user by productId
    WishlistItem findByUserIdAndProductId(Integer userId, Integer productId);
 
    // Find all wishlist items for a user
    List<WishlistItem> findByUserId(Integer userId);
}