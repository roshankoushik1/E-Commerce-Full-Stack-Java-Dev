package com.cts.checkout;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private final CheckoutRepository checkoutRepository;

    public CheckoutServiceImpl(CheckoutRepository checkoutRepository) {
        this.checkoutRepository = checkoutRepository;
    }

    @Override
    public Checkout saveCheckout(Checkout checkout) {
        return checkoutRepository.save(checkout);
    }

    @Override
    public List<Checkout> getAllCheckouts() {
        return checkoutRepository.findAll();
    }
    
    @Override
    public void deleteAllCheckouts() {
    	checkoutRepository.deleteAll();
    }
}