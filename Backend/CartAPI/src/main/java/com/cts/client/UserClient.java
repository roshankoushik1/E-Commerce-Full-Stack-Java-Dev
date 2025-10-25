package com.cts.client;
 
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
 
@Component
public class UserClient {
 
    private final RestTemplate restTemplate;
 
    @Value("${user.service.url}")
    private String userServiceUrl;
 
    public UserClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
 
    public Integer getUserIdByEmail(String email) {
        String url = userServiceUrl + "/api/auth/user-id?email=" + email;
        return restTemplate.getForObject(url, Integer.class);
    }
}