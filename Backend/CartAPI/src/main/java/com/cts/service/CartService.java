package com.cts.service;
 
import com.cts.entity.CartItem;

import com.cts.repository.CartItemRepository;

import com.cts.exception.ResourceNotFoundException;

import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
 
import java.util.List;
 
@Service

public class CartService {
 
	private final CartItemRepository cartRepo;

	private final BillService billService;
 
	public CartService(CartItemRepository cartRepo, BillService billService) {

	    this.cartRepo = cartRepo;

	    this.billService = billService;

	}
 
	// Return all items (billed + unbilled). Frontend may filter if needed.

	public List<CartItem> getAllCartItems(Integer userId) {

	    return cartRepo.findByUserId(userId);

	}
 
	@Transactional

	public CartItem addToCart(CartItem item) {

	    if (item.getQuantity() == null || item.getQuantity() < 1) item.setQuantity(1);

	    if (item.getSize() == null || item.getSize().isBlank()) item.setSize("NA");

	    if (item.getColor() == null || item.getColor().isBlank()) item.setColor("NA");

	    // ALWAYS create a new row (no variant merge)

	    return cartRepo.save(item);

	}
 
	@Transactional

	public CartItem updateQuantity(Integer id, Integer quantity, Integer userId) {

	    if (quantity == null || quantity < 1) quantity = 1;

	    CartItem item = getCartItemById(id, userId);

	    item.setQuantity(quantity);

	    CartItem saved = cartRepo.save(item);

	    if (item.getBill() != null) {

	        billService.recalculateBill(item.getBill().getId(), userId);

	    }

	    return saved;

	}
 
	@Transactional

	public void removeFromCart(Integer id, Integer userId) {

	    CartItem item = getCartItemById(id, userId);

	    Integer billId = item.getBill() != null ? item.getBill().getId() : null;

	    cartRepo.delete(item);

	    if (billId != null) {

	        billService.recalculateBill(billId, userId);

	    }

	}
 
	public CartItem getCartItemById(Integer id, Integer userId) {

	    CartItem item = cartRepo.findById(id)

	            .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + id));

	    if (!item.getUserId().equals(userId)) {

	        throw new ResourceNotFoundException("Cart item not found for this user");

	    }

	    return item;

	}
 
	public CartItem getCartItemByProductAttributes(Integer userId, Integer productId, String size, String color) {

	    return cartRepo.findByUserIdAndProductIdAndSizeAndColor(userId, productId, size, color);

	}

}
 