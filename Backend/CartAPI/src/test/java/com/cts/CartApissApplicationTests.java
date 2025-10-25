package com.cts;

import com.cts.entity.CartItem;
import com.cts.repository.CartItemRepository;
import com.cts.service.CartService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class CartApissApplicationTests {

    // Spring injects the REAL service bean, not a mock
    @Autowired
    private CartService cartService;

    // Spring injects the REAL repository bean
    @Autowired
    private CartItemRepository cartItemRepository;

    /**
     * This default test ensures the entire Spring application can start
     * and all beans can be created and injected without errors.
     */
    @Test
    void contextLoads() {
        // We can assert that our beans were successfully injected
        assertThat(cartService).isNotNull();
        assertThat(cartItemRepository).isNotNull();
    }

    /**
     * Clean up the database after each test to ensure tests are independent.
     */
    @AfterEach
    void tearDown() {
        cartItemRepository.deleteAll();
    }

    /**
     * This is a new INTEGRATION TEST.
     * It tests the complete flow from the service layer to the database.
     */
    @Test
    void whenAddToCart_thenItemShouldBeSavedInDatabase() {
        // Arrange: Create a new CartItem to be saved
        CartItem newItem = new CartItem();
        newItem.setUserId(1);
        newItem.setProductId(101);
        newItem.setName("Integration Test Product");
        newItem.setOriginalPrice(150);
        newItem.setDiscountedPrice(120);
        newItem.setQuantity(1);

        // Act: Call the service method. This will use the REAL service and REAL repository.
        cartService.addToCart(newItem);

        // Assert: Check the database directly using the repository to confirm the item was saved.
        List<CartItem> itemsInDb = cartItemRepository.findByUserId(1);

        assertThat(itemsInDb).hasSize(1);
        CartItem savedItem = itemsInDb.get(0);
        assertEquals("Integration Test Product", savedItem.getName());
        assertEquals(1, savedItem.getQuantity());
    }
}
