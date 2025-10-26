package com.cts.login;
 
import jakarta.persistence.*;
 
@Entity
@Table(name = "userss")
public class User {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
 
    private String firstName;
    private String lastName;
 
    @Column(unique = true, nullable = false)
    private String email;
 
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String role = "USER"; // Default role is USER
 
    // Getters and setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
 
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
 
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
 
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
 
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}