package com.cts.login;
 
import com.cts.login.User;
import com.cts.login.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
 
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
 
@Service
public class UserService {
 
    @Autowired UserRepository userRepository;
 
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
 
    public User registerUser(User user) {
        // Encrypt the password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
 
    public Optional<User> authenticate(String email, String rawPassword) {
        // Handle admin authentication
        if ("admin@gmail.com".equals(email) && "admin".equals(rawPassword)) {
            User adminUser = new User();
            adminUser.setId(-1); // Special ID for admin
            adminUser.setEmail("admin@gmail.com");
            adminUser.setFirstName("Admin");
            adminUser.setLastName("User");
            adminUser.setRole("ADMIN");
            adminUser.setPassword(""); // Don't store actual password
            return Optional.of(adminUser);
        }
        
        // Regular user authentication
        Optional<User> userOpt = userRepository.findByEmail(email);
        if(userOpt.isPresent()) {
            User user = userOpt.get();
            if(passwordEncoder.matches(rawPassword, user.getPassword())) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }
    public List<String>getAllEmails(){
    	return userRepository.findAll().stream().map(User::getEmail).collect(Collectors.toList());
    }
}