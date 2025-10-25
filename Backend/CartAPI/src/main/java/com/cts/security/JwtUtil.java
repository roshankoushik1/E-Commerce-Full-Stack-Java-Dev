package com.cts.security;
 
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Component;
 
import jakarta.servlet.http.HttpServletRequest;
import java.util.Date;
 
@Component
public class JwtUtil {
    private final String SECRET_KEY = "1234567891011";
 
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }
 
    // Extracts the email (subject) from the token
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }
 
    // Extracts the JWT token from the Authorization header
    public String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        throw new RuntimeException("JWT Token is missing or invalid");
    }
    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }
 
    public boolean validateToken(String token, String email) {
        return extractUsername(token).equals(email) && !isTokenExpired(token);
    }
 
    private Claims getClaims(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
    }
 
    private boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }
}