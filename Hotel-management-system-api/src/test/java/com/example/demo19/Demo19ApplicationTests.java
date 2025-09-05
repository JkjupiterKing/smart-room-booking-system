package com.example.demo19;

import com.example.demo19.Service.EmailService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest
class Demo19ApplicationTests {

	@MockBean
	private EmailService emailService;

	@Test
	void contextLoads() {
	}

}
