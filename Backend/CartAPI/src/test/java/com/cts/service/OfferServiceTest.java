package com.cts.service;

import com.cts.dto.BillDTO;
import com.cts.entity.Bill;
import com.cts.entity.Offer;
import com.cts.repository.BillRepository;
import com.cts.repository.OfferRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OfferServiceTest {

    @Mock
    private OfferRepository offerRepository;

    @Mock
    private BillRepository billRepository;

    @InjectMocks
    private OfferService offerService;

    private Bill testBill;
    private Offer testOffer;
    private Integer billId;

    @BeforeEach
    void setUp() {
        billId = 101;

        testOffer = new Offer();
        testOffer.setId(1);
        testOffer.setCode("SAVE20");
        testOffer.setOffPercentage(20);
        testOffer.setMinOrderPrice(500);

        testBill = new Bill();
        testBill.setId(billId);
        testBill.setSubTotal(1000);
        testBill.setItems(new ArrayList<>()); // For DTO conversion
    }

    @Test
    void applyOffer_whenEligible_appliesDiscountAndSavesBill() {
        // Arrange
        when(billRepository.findById(billId)).thenReturn(Optional.of(testBill));
        when(offerRepository.findByCode("SAVE20")).thenReturn(Optional.of(testOffer));
        when(billRepository.save(any(Bill.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        BillDTO result = offerService.applyOffer(billId, "SAVE20");

        // Assert
        assertNotNull(result);
        assertEquals(1000, result.getSubTotal());
        assertEquals(200, result.getDiscountAmount()); // 20% of 1000
        assertEquals(800, result.getTotalAmount());
        assertNotNull(result.getAppliedOffer());
        assertEquals("SAVE20", result.getAppliedOffer().getCode());

        verify(billRepository).save(testBill);
    }

    @Test
    void applyOffer_whenNotEligible_throwsException() {
        // Arrange
        testBill.setSubTotal(400); // Below min order price
        when(billRepository.findById(billId)).thenReturn(Optional.of(testBill));
        when(offerRepository.findByCode("SAVE20")).thenReturn(Optional.of(testOffer));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            offerService.applyOffer(billId, "SAVE20");
        });
        assertEquals("Subtotal not eligible for this offer", exception.getMessage());
        verify(billRepository, never()).save(any(Bill.class));
    }

    @Test
    void applyOffer_whenOfferNotFound_throwsException() {
        // Arrange
        when(billRepository.findById(billId)).thenReturn(Optional.of(testBill));
        when(offerRepository.findByCode("INVALID")).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            offerService.applyOffer(billId, "INVALID");
        });
        assertEquals("Offer not found: INVALID", exception.getMessage());
    }

    @Test
    void removeOffer_whenOfferExists_removesDiscountAndSaves() {
        // Arrange
        testBill.setAppliedOffer(testOffer);
        testBill.setDiscountAmount(200);
        testBill.setTotalAmount(800);

        when(billRepository.findById(billId)).thenReturn(Optional.of(testBill));
        when(billRepository.save(any(Bill.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        BillDTO result = offerService.removeOffer(billId);

        // Assert
        assertNotNull(result);
        assertNull(result.getAppliedOffer());
        assertEquals(0, result.getDiscountAmount());
        assertEquals(1000, result.getTotalAmount()); // Should be same as subtotal
        verify(billRepository).save(testBill);
    }
}
