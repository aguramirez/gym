package com.example.backend.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class HelloController {
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        System.out.println("⚕️ Healthcheck HIT!");
        return ResponseEntity.ok("OK");
    }

}
