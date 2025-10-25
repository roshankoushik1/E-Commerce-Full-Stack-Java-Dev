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