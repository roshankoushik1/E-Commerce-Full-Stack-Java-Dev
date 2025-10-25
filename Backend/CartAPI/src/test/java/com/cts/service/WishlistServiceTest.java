package com.cts.service;

import com.cts.entity.CartItem;
import com.cts.entity.WishlistItem;
import com.cts.repository.WishlistItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WishlistServiceTest {

    @Mock
    private WishlistItemRepository wishlistRepo;

    @Mock
    private CartService cartService;

    @InjectMocks
    private WishlistService wishlistService;

    private WishlistItem testWishlistItem;
    private Integer userId;
    private Integer wishlistItemId;

    @BeforeEach
    void setUp() {
        userId = 1;
        wishlistItemId = 301;

        testWishlistItem = new WishlistItem();
        testWishlistItem.setId(wishlistItemId);
        testWishlistItem.setUserId(userId);
        testWishlistItem.setProductId(10);
        testWishlistItem.setName("Test Product");
        testWishlistItem.setOriginalPrice(100);
        testWishlistItem.setQuantity(1);
    }

    @Test
    void getAllWishlistItems_returnsItemsForUser() {
        // Arrange
        when(wishlistRepo.findByUserId(userId)).thenReturn(List.of(testWishlistItem));

        // Act
        List<WishlistItem> result = wishlistService.getAllWishlistItems(userId);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(wishlistRepo).findByUserId(userId);
    }

    @Test
    void addToWishlist_savesAndReturnsItem() {
        // Arrange
        when(wishlistRepo.save(any(WishlistItem.class))).thenReturn(testWishlistItem);

        // Act
        WishlistItem result = wishlistService.addToWishlist(testWishlistItem);

        // Assert
        assertNotNull(result);
        assertEquals(wishlistItemId, result.getId());
        verify(wishlistRepo).save(testWishlistItem);
    }

    @Test
    void removeFromWishlist_deletesItem() {
        // Arrange
        when(wishlistRepo.findById(wishlistItemId)).thenReturn(Optional.of(testWishlistItem));
        doNothing().when(wishlistRepo).delete(testWishlistItem);

        // Act
        wishlistService.removeFromWishlist(wishlistItemId, userId);

        // Assert
        verify(wishlistRepo).delete(testWishlistItem);
    }

    @Test
    void getWishlistItemById_whenItemNotFound_returnsNull() {
        // Arrange
        when(wishlistRepo.findById(999)).thenReturn(Optional.empty());

        // Act
        WishlistItem result = wishlistService.getWishlistItemById(999, userId);

        // Assert
        assertNull(result);
    }

    @Test
    void moveToCart_whenItemExists_createsCartItemAndDeletesWishlistItem() {
        // Arrange
        when(wishlistRepo.findById(wishlistItemId)).thenReturn(Optional.of(testWishlistItem));
        ArgumentCaptor<CartItem> cartItemCaptor = ArgumentCaptor.forClass(CartItem.class);

        // Act
        wishlistService.moveToCart(wishlistItemId, userId);

        // Assert
        // 1. Verify cartService.addToCart was called with the correct data
        verify(cartService).addToCart(cartItemCaptor.capture());
        CartItem capturedCartItem = cartItemCaptor.getValue();
        assertEquals(testWishlistItem.getProductId(), capturedCartItem.getProductId());
        assertEquals(testWishlistItem.getName(), capturedCartItem.getName());
        assertEquals(userId, capturedCartItem.getUserId());

        // 2. Verify the wishlist item was deleted
        verify(wishlistRepo).delete(testWishlistItem);
    }

    @Test
    void moveToCart_whenItemNotFound_throwsException() {
        // Arrange
        when(wishlistRepo.findById(wishlistItemId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            wishlistService.moveToCart(wishlistItemId, userId);
        });
        assertEquals("Wishlist item not found", exception.getMessage());
        verify(cartService, never()).addToCart(any());
    }
}
