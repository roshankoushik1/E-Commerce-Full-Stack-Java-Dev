package com.cts.checkout;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping
    public ResponseEntity<Checkout> createCheckout(@Valid @RequestBody Checkout checkout) {
        Checkout saved = checkoutService.saveCheckout(checkout);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Checkout>> getCheckouts() {
        List<Checkout> checkouts = checkoutService.getAllCheckouts();
        return ResponseEntity.ok(checkouts);
    }
    
    @DeleteMapping
    public ResponseEntity<String>deleteAllCheckouts(){
    	checkoutService.deleteAllCheckouts();
    	return ResponseEntity.ok("All checkout records have been deleted.");
    }
    
    @PostMapping("/create-order")
    public ResponseEntity<String> createOrder(@RequestBody Map<String, Object> orderData) {
        try {
            // This endpoint can be used to create orders after payment
            // The actual order creation should be handled by TrackOrder service
            return ResponseEntity.ok("Order creation request received");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to process order: " + e.getMessage());
        }
    }
}