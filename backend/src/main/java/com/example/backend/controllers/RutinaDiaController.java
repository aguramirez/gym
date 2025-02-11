package com.example.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.models.entity.RutinaDia;
import com.example.backend.services.RutinaDiaService;

@RestController
@RequestMapping("/rutina-dias")
public class RutinaDiaController {
    @Autowired
    private RutinaDiaService rutinaDiaService;

    @GetMapping
    public List<RutinaDia> findAll() {
        return rutinaDiaService.findAll();
    }

    @GetMapping("/{id}")
    public RutinaDia findById(@PathVariable Long id) {
        return rutinaDiaService.findById(id);
    }

    @PostMapping
    public RutinaDia save(@RequestBody RutinaDia rutinaDia) {
        return rutinaDiaService.save(rutinaDia);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        rutinaDiaService.deleteById(id);
    }
}
