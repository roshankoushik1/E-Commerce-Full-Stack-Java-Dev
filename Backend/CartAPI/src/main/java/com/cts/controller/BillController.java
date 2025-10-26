package com.cts.controller;
 
import com.cts.entity.Bill;
import com.cts.entity.CartItem;
import com.cts.service.BillService;
import com.cts.security.JwtUtil;
import com.cts.client.UserClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
 
import java.util.Comparator;
import java.util.List;
 
@RestController
@RequestMapping("/api/bills")
public class BillController {
 
	@Autowired
	private BillService billService;
	@Autowired
	private JwtUtil jwtUtil;
	@Autowired
	private UserClient userClient;
 
	private Integer userId(HttpServletRequest req){
	    String token = jwtUtil.extractToken(req);
	    String email = jwtUtil.extractUsername(token);
	    return userClient.getUserIdByEmail(email);
	}
 
	// Generate or update active bill (uses existing createBill in BillService)
	@PostMapping("/generate")
	public Bill generate(@RequestBody(required = false) List<CartItem> specs,
	                     @RequestParam(required = false) String offerCode,
	                     @RequestParam(defaultValue = "false") boolean applyOffer,
	                     HttpServletRequest request){
	    return billService.createBill(specs, offerCode, applyOffer, userId(request));
	}
 
	// Recalculate latest bill (quantity / deletes done)
	@PutMapping("/recalculate")
	public Bill recalc(HttpServletRequest request){
	    Integer uid = userId(request);
	    List<Bill> bills = billService.getAllBills(uid);
	    if (bills == null || bills.isEmpty()) {
	        return null;
	    }
	    Bill latest = bills.stream().max(Comparator.comparingInt(Bill::getId)).orElse(null);
	    if (latest == null) return null;
	    billService.recalculateBill(latest.getId(), uid);
	    return billService.getBillById(latest.getId(), uid);
	}
 
	// Get current active (latest) bill (no recalculation)
	@GetMapping("/active")
	public Bill active(HttpServletRequest request){
	    Integer uid = userId(request);
	    List<Bill> bills = billService.getAllBills(uid);
	    if (bills == null || bills.isEmpty()) return null;
	    return bills.stream().max(Comparator.comparingInt(Bill::getId)).orElse(null);
	}
 
	@GetMapping("/{id}")
	public Bill byId(@PathVariable Integer id, HttpServletRequest request){
	    return billService.getBillById(id, userId(request));
	}
 
	@GetMapping
	public List<Bill> all(HttpServletRequest request){
	    return billService.getAllBills(userId(request));
	}
}