package com.cts;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ExploresApplication {

	public static void main(String[] args) {
		SpringApplication.run(ExploresApplication.class, args);
	}

}
