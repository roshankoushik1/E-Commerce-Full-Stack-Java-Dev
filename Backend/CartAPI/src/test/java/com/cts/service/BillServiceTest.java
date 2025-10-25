package com.cts.service;

import com.cts.entity.Bill;
import com.cts.entity.CartItem;
import com.cts.entity.Offer;
import com.cts.repository.BillRepository;
import com.cts.repository.CartItemRepository;
import com.cts.repository.OfferRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BillServiceTest {

    @Mock
    private BillRepository billRepository;

    @Mock
    private OfferRepository offerRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @InjectMocks
    private BillService billService;

    private Bill testBill;
    private CartItem testCartItem1;
    private CartItem testCartItem2;
    private Offer testOffer;
    private Integer userId;

    @BeforeEach
    void setUp() {
        userId = 1;

        testBill = new Bill();
        testBill.setId(101);
        testBill.setUserId(userId);
        testBill.setItems(new ArrayList<>());

        testCartItem1 = new CartItem();
        testCartItem1.setId(1);
        testCartItem1.setUserId(userId);
        testCartItem1.setProductId(10);
        testCartItem1.setOriginalPrice(1000);
        testCartItem1.setQuantity(2); // Gross for this item = 2000
        testCartItem1.setBill(testBill);

        testCartItem2 = new CartItem();
        testCartItem2.setId(2);
        testCartItem2.setUserId(userId);
        testCartItem2.setProductId(20);
        testCartItem2.setOriginalPrice(500);
        testCartItem2.setQuantity(1); // Gross for this item = 500
        testCartItem2.setBill(testBill);

        testOffer = new Offer();
        testOffer.setId(1);
        testOffer.setCode("SAVE10");
        testOffer.setOffPercentage(10);
        testOffer.setMinOrderPrice(1500);
    }

    @Test
    void createBill_whenNewUser_createsAndSavesNewBill() {
        // Arrange
        when(billRepository.findTopByUserIdOrderByIdDesc(userId)).thenReturn(null);
        when(billRepository.save(any(Bill.class))).thenAnswer(invocation -> {
            Bill b = invocation.getArgument(0);
            b.setId(101); // Simulate saving and getting an ID
            return b;
        });
        when(cartItemRepository.findByUserIdAndBillIsNull(userId)).thenReturn(Collections.emptyList());
        when(cartItemRepository.findByUserId(userId)).thenReturn(Collections.emptyList());

        // Act
        Bill result = billService.createBill(Collections.emptyList(), null, false, userId);

        // Assert
        assertNotNull(result);
        assertEquals(userId, result.getUserId());
        verify(billRepository, times(2)).save(any(Bill.class)); // Once for creation, once for final save
    }

    @Test
    void createBill_withValidOffer_appliesDiscount() {
        // Arrange
        List<CartItem> unbilledItems = new ArrayList<>();
        CartItem newItem = new CartItem();
        newItem.setUserId(userId);
        newItem.setOriginalPrice(2000);
        newItem.setQuantity(1);
        unbilledItems.add(newItem);

        when(billRepository.findTopByUserIdOrderByIdDesc(userId)).thenReturn(testBill);
        when(cartItemRepository.findByUserIdAndBillIsNull(userId)).thenReturn(unbilledItems);
        when(cartItemRepository.findByUserId(userId)).thenReturn(unbilledItems);
        when(offerRepository.findByCode("SAVE10")).thenReturn(Optional.of(testOffer));
        when(billRepository.save(any(Bill.class))).thenReturn(testBill);

        // Act
        Bill result = billService.createBill(Collections.emptyList(), "SAVE10", true, userId);

        // Assert
        assertNotNull(result);
        assertEquals(2000, result.getSubTotal());
        assertEquals(200, result.getDiscountAmount()); // 10% of 2000
        assertEquals(1800, result.getTotalAmount());
        assertNotNull(result.getAppliedOffer());
        assertEquals("SAVE10", result.getAppliedOffer().getCode());
        verify(cartItemRepository).saveAll(anyList());
    }

    @Test
    void recalculateBill_whenBillExists_recalculatesAndSaves() {
        // Arrange
        List<CartItem> items = List.of(testCartItem1, testCartItem2);
        testBill.setItems(items);
        
        when(billRepository.findById(testBill.getId())).thenReturn(Optional.of(testBill));
        when(cartItemRepository.findByUserId(userId)).thenReturn(items);
        when(billRepository.save(any(Bill.class))).thenReturn(testBill);

        // Act
        billService.recalculateBill(testBill.getId(), userId);

        // Assert
        verify(billRepository).findById(testBill.getId());
        verify(billRepository).save(testBill);
        assertEquals(2500, testBill.getSubTotal()); // 1000*2 + 500*1
        assertEquals(2500, testBill.getTotalAmount());
    }

    @Test
    void recalculateBill_whenBillNotFound_doesNothing() {
        // Arrange
        when(billRepository.findById(999)).thenReturn(Optional.empty());

        // Act
        billService.recalculateBill(999, userId);

        // Assert
        verify(billRepository, never()).save(any(Bill.class));
    }

    @Test
    void getBillById_whenFoundAndUserMatches_returnsBill() {
        // Arrange
        when(billRepository.findById(testBill.getId())).thenReturn(Optional.of(testBill));
        when(cartItemRepository.findByUserId(userId)).thenReturn(Collections.emptyList());

        // Act
        Bill result = billService.getBillById(testBill.getId(), userId);

        // Assert
        assertNotNull(result);
        assertEquals(testBill.getId(), result.getId());
    }

    @Test
    void getBillById_whenUserDoesNotMatch_returnsNull() {
        // Arrange
        when(billRepository.findById(testBill.getId())).thenReturn(Optional.of(testBill));

        // Act
        Bill result = billService.getBillById(testBill.getId(), 999); // Different user ID

        // Assert
        assertNull(result);
    }

    @Test
    void getAllBills_returnsListOfBillsForUser() {
        // Arrange
        when(billRepository.findByUserId(userId)).thenReturn(List.of(testBill));

        // Act
        List<Bill> results = billService.getAllBills(userId);

        // Assert
        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(testBill.getId(), results.get(0).getId());
    }
}
