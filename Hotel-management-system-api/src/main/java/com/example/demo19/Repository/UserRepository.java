package com.example.demo19.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo19.Modal.User;


@Repository
public interface UserRepository  extends JpaRepository<User, Long> {

	User findByUsername(String username);

	

	

}
