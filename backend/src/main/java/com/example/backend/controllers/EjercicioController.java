package com.example.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.models.entity.Ejercicio;
import com.example.backend.services.EjercicioService;

@RestController
@RequestMapping("/ejercicios")
public class EjercicioController {
    @Autowired
    private EjercicioService ejercicioService;

    @GetMapping
    public List<Ejercicio> findAll() {
        return ejercicioService.findAll();
    }

    @GetMapping("/{id}")
    public Ejercicio findById(@PathVariable Long id) {
        return ejercicioService.findById(id);
    }

    @PostMapping
    public Ejercicio save(@RequestBody Ejercicio ejercicio) {
        return ejercicioService.save(ejercicio);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        ejercicioService.deleteById(id);
    }

    @GetMapping("/search")
    public List<Ejercicio> findByNombre(@RequestParam String nombre) {
        return ejercicioService.findByNombre(nombre);
    }

    @PutMapping("/{id}")
    public Ejercicio editarEjercicio(@PathVariable Long id, @RequestBody Ejercicio ejercicioActualizado) {
        return ejercicioService.editarEjercicio(id, ejercicioActualizado);
    }
}
