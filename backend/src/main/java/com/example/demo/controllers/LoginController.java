package com.example.demo.controllers;

import com.example.demo.entities.User;
import com.example.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api")
public class LoginController {

    // ADD USER EXISTS CHECKS, E-MAIL LOGIN

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User user, HttpServletRequest req) {
        User userFromService = userService.login(user, req);
        if(userFromService != null) {
            return ResponseEntity.ok(userFromService);
        }
        else {
        return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/logout")
    public void logout(HttpServletRequest req, HttpServletResponse res) {
        userService.logout(req, res);
    }



    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User userFromService = userService.createUser(user);
        if(userFromService != null) {
            return ResponseEntity.ok(userFromService);
        }
        else {
        return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/whoami")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<User> whoAmI() {
        User userFromService = userService.findCurrentUser();
        if (userFromService != null) {
            return ResponseEntity.ok(userFromService);
        }
        else {
            return  ResponseEntity.notFound().build();
        }
    }





}
