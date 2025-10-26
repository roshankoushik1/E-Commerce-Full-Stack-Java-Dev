package com.cts.checkout;

import java.util.List;

public interface CheckoutService {

    Checkout saveCheckout(Checkout checkout);

    List<Checkout> getAllCheckouts();
    void deleteAllCheckouts();
}