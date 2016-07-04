package mcia.publications.controller;

import java.security.Principal;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class UserController {

	@RequestMapping("/user")
	public Principal user(Principal user) {
		log.info("GET: user {}", user.getName());
		return user;
	}

}
