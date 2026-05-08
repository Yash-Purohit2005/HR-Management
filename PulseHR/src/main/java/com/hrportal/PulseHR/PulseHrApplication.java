package com.hrportal.PulseHR;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
//@EnableCaching
public class PulseHrApplication {

	public static void main(String[] args) {

		SpringApplication.run(PulseHrApplication.class, args);
	}

}
