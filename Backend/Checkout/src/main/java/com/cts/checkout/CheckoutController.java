package com.cts.checkout;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials="true")
//@CrossOrigin(origins = "*") 
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
}