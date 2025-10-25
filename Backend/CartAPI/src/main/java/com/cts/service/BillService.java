package com.cts.service;
 
import com.cts.entity.Bill;

import com.cts.entity.CartItem;

import com.cts.entity.Offer;

import com.cts.repository.BillRepository;

import com.cts.repository.CartItemRepository;

import com.cts.repository.OfferRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
 
import java.util.*;

import java.util.stream.Collectors;
 
@Service

public class BillService {
 
    @Autowired

    private BillRepository billRepository;

    @Autowired

    private OfferRepository offerRepository;

    @Autowired

    private CartItemRepository cartItemRepository;
 
    @Transactional

    public Bill createBill(List<CartItem> requestItems, String offerCode, boolean applyOffer, Integer userId) {

        Bill bill = billRepository.findTopByUserIdOrderByIdDesc(userId);

        if (bill == null) {

            bill = new Bill();

            bill.setUserId(userId);

            bill = billRepository.save(bill);

        }

        if (bill.getItems() == null) {

            bill.setItems(new ArrayList<>());

        }
 
        Set<String> filterKeys = buildFilterKeys(requestItems);
 
        List<CartItem> unbilled = cartItemRepository.findByUserIdAndBillIsNull(userId);

        boolean changed = false;

        for (CartItem ci : unbilled) {

            if (filterKeys.isEmpty() || filterKeys.contains(variantKey(ci))) {

                ci.setBill(bill);

                changed = true;

            }

        }

        if (changed) {

            cartItemRepository.saveAll(unbilled);

        }
 
        attachCurrentItems(bill);

        recalcInternal(bill, offerCode, applyOffer, false);

        return billRepository.save(bill);

    }
 
    @Transactional

    public void recalculateBill(Integer billId, Integer userId) {

        if (billId == null) return;

        Bill bill = billRepository.findById(billId).orElse(null);

        if (bill == null || !Objects.equals(bill.getUserId(), userId)) return;

        attachCurrentItems(bill);

        recalcInternal(bill, null, false, true);

        billRepository.save(bill);

    }
 
    @Transactional

    public Bill recalculateActiveBill(Integer userId) {

        Bill bill = billRepository.findTopByUserIdOrderByIdDesc(userId);

        if (bill == null) return null;

        attachCurrentItems(bill);

        recalcInternal(bill, null, false, true);

        return billRepository.save(bill);

    }
 
    public Bill getBillById(Integer id, Integer userId) {

        Bill bill = billRepository.findById(id).orElse(null);

        if (bill == null || !Objects.equals(bill.getUserId(), userId)) return null;

        attachCurrentItems(bill);

        return bill;

    }
 
    public List<Bill> getAllBills(Integer userId) {

        return billRepository.findByUserId(userId);

    }
 
    private void recalcInternal(Bill bill, String offerCode, boolean applyOfferFlag, boolean preserveExistingOffer) {

        int gross = computeGross(bill.getItems());

        if (gross == 0) {

            bill.setAppliedOffer(null);

            bill.setSubTotal(0);

            bill.setDiscountAmount(0);

            bill.setTotalAmount(0);

            return;

        }
 
        Offer applied = bill.getAppliedOffer();
 
        if (applyOfferFlag && offerCode != null && !offerCode.isBlank()) {

            applied = resolveOffer(offerCode, gross);

        } else if (preserveExistingOffer) {

            if (applied != null && gross < applied.getMinOrderPrice()) {

                applied = null;

            }

        } else {

            if (applied != null && gross < applied.getMinOrderPrice()) {

                applied = null;

            }

        }
 
        int discount = (applied != null) ? computeDiscount(gross, applied) : 0;

        bill.setAppliedOffer(applied);

        bill.setSubTotal(gross);

        bill.setDiscountAmount(discount);

        bill.setTotalAmount(gross - discount);

    }
 
    private void attachCurrentItems(Bill bill) {

        List<CartItem> current = cartItemRepository.findByUserId(bill.getUserId()).stream()

                .filter(ci -> ci.getBill() != null && Objects.equals(ci.getBill().getId(), bill.getId()))

                .collect(Collectors.toList());

        bill.setItems(current);

    }
 
    private Set<String> buildFilterKeys(List<CartItem> specs) {

        Set<String> keys = new HashSet<>();

        if (specs == null) return keys;

        for (CartItem c : specs) {

            if (c == null || c.getProductId() == null) continue;

            keys.add(c.getProductId() + "|" + norm(c.getSize()) + "|" + norm(c.getColor()));

        }

        return keys;

    }
 
    private String variantKey(CartItem c) {

        return c.getProductId() + "|" + norm(c.getSize()) + "|" + norm(c.getColor());

    }
 
    private String norm(String v) {

        return (v == null || v.isBlank()) ? "NA" : v.trim();

    }
 
    private int computeGross(List<CartItem> items) {

        if (items == null) return 0;

        int sum = 0;

        for (CartItem ci : items) {

            if (ci == null) continue;

            int unit = (ci.getDiscountedPrice() != null) ? ci.getDiscountedPrice()

                    : (ci.getOriginalPrice() != null ? ci.getOriginalPrice() : 0);

            int qty = (ci.getQuantity() == null || ci.getQuantity() <= 0) ? 1 : ci.getQuantity();

            sum += unit * qty;

        }

        return sum;

    }
 
    private Offer resolveOffer(String code, int gross) {

        return offerRepository.findByCode(code)

                .filter(o -> gross >= o.getMinOrderPrice())

                .orElse(null);

    }
 
    private int computeDiscount(int gross, Offer offer) {

        if (offer == null || offer.getOffPercentage() == null || offer.getOffPercentage() <= 0) return 0;

        long val = (long) gross * offer.getOffPercentage() / 100;

        return (val > Integer.MAX_VALUE) ? Integer.MAX_VALUE : (int) val;

    }

}
 