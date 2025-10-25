package com.cts.service;

import com.cts.entity.Bill;
import com.cts.entity.CartItem;
import com.cts.exception.ResourceNotFoundException;
import com.cts.repository.CartItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartItemRepository cartRepo;

    @Mock
    private BillService billService;

    @InjectMocks
    private CartService cartService;

    private CartItem testCartItem;
    private Integer userId;
    private Integer cartItemId;

    @BeforeEach
    void setUp() {
        userId = 1;
        cartItemId = 101;

        testCartItem = new CartItem();
        testCartItem.setId(cartItemId);
        testCartItem.setUserId(userId);
        testCartItem.setProductId(1);
        testCartItem.setQuantity(1);
        testCartItem.setSize("M");
        testCartItem.setColor("Blue");
    }

    @Test
    void getAllCartItems_returnsItemsForUser() {
        // Arrange
        when(cartRepo.findByUserId(userId)).thenReturn(List.of(testCartItem));

        // Act
        List<CartItem> result = cartService.getAllCartItems(userId);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(cartRepo).findByUserId(userId);
    }

    @Test
    void addToCart_savesAndReturnsItem() {
        // Arrange
        when(cartRepo.save(any(CartItem.class))).thenReturn(testCartItem);

        // Act
        CartItem result = cartService.addToCart(testCartItem);

        // Assert
        assertNotNull(result);
        assertEquals(cartItemId, result.getId());
        verify(cartRepo).save(testCartItem);
    }

    @Test
    void updateQuantity_whenItemIsBilled_recalculatesBill() {
        // Arrange
        Bill bill = new Bill();
        bill.setId(201);
        testCartItem.setBill(bill);
        int newQuantity = 3;

        when(cartRepo.findById(cartItemId)).thenReturn(Optional.of(testCartItem));
        when(cartRepo.save(any(CartItem.class))).thenReturn(testCartItem);

        // Act
        CartItem result = cartService.updateQuantity(cartItemId, newQuantity, userId);

        // Assert
        assertEquals(newQuantity, result.getQuantity());
        verify(cartRepo).save(testCartItem);
        verify(billService).recalculateBill(bill.getId(), userId);
    }

    @Test
    void updateQuantity_whenItemNotFound_throwsException() {
        // Arrange
        when(cartRepo.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            cartService.updateQuantity(999, 2, userId);
        });
        verify(billService, never()).recalculateBill(any(), any());
    }

    @Test
    void removeFromCart_whenItemIsBilled_recalculatesBill() {
        // Arrange
        Bill bill = new Bill();
        bill.setId(201);
        testCartItem.setBill(bill);

        when(cartRepo.findById(cartItemId)).thenReturn(Optional.of(testCartItem));
        doNothing().when(cartRepo).delete(testCartItem);

        // Act
        cartService.removeFromCart(cartItemId, userId);

        // Assert
        verify(cartRepo).delete(testCartItem);
        verify(billService).recalculateBill(bill.getId(), userId);
    }

    @Test
    void getCartItemById_whenItemBelongsToAnotherUser_throwsException() {
        // Arrange
        testCartItem.setUserId(999); // Different user
        when(cartRepo.findById(cartItemId)).thenReturn(Optional.of(testCartItem));

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            cartService.getCartItemById(cartItemId, userId);
        });
        assertEquals("Cart item not found for this user", exception.getMessage());
    }
}
