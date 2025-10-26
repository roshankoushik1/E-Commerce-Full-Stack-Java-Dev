// CartItemRepository.java
package com.cts.repository;
 
import com.cts.entity.CartItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
 
	// Base lookups
	List<CartItem> findByUserId(Integer userId);
 
	// Unbilled (active cart) items
	List<CartItem> findByUserIdAndBillIsNull(Integer userId);
 
	// Match single variant (any bill state)
	CartItem findByUserIdAndProductIdAndSizeAndColor(Integer userId, Integer productId, String size, String color);
 
	// Match only unbilled variant (preferred for cart updates)
	CartItem findByUserIdAndProductIdAndSizeAndColorAndBillIsNull(Integer userId, Integer productId, String size, String color);
 
	// Legacy simple product lookup
	CartItem findByUserIdAndProductId(Integer userId, Integer productId);
 
	// Batch fetch (used if you switch to ID-based selection)
	List<CartItem> findByIdInAndUserId(List<Integer> ids, Integer userId);
}