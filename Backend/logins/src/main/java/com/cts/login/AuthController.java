package com.cts.login;
 
import com.cts.login.User;
import com.cts.login.UserService;
 
import jakarta.servlet.http.HttpServletRequest;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
 
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
 
 
@RestController
@RequestMapping("/api/auth")
public class AuthController {
 
    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;
 
    @PostMapping("/signup")
    public String signup(@RequestBody User user) {
        if(userService.userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "Email already exists!";
        }
        userService.registerUser(user);
        return "Signup successful!";
    }
 
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        Optional<User> authenticatedUser = userService.authenticate(user.getEmail(), user.getPassword());
        if(authenticatedUser.isPresent()) {
            User authUser = authenticatedUser.get();
            String token = jwtUtil.generateToken(authUser.getEmail());
            
            // Return both token and user info
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", Map.of(
                "id", authUser.getId(),
                "email", authUser.getEmail(),
                "firstName", authUser.getFirstName() != null ? authUser.getFirstName() : "Admin",
                "lastName", authUser.getLastName() != null ? authUser.getLastName() : "User",
                "role", authUser.getRole()
            ));
            
            return ResponseEntity.ok(response);
        } 
        else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials!");
        }
    }
    @GetMapping("/user-id")
    public ResponseEntity<Integer> getUserIdByEmail(@RequestParam String email) {
        Optional<User> user = userService.userRepository.findByEmail(email);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get().getId());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
 
 
    @GetMapping("/emails")
    public List<String>getAllEmails(){
    	return userService.getAllEmails();
    }

    @GetMapping("/csrf-token")
    public CsrfToken getCsrfToken(HttpServletRequest request) {
    	return (CsrfToken) request.getAttribute("_csrf");   	
    }
}