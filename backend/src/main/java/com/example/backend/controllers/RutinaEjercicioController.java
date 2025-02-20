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
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.models.entity.RutinaEjercicio;
import com.example.backend.services.RutinaEjercicioService;

@RestController
@RequestMapping("/rutina-ejercicios")
public class RutinaEjercicioController {
    @Autowired
    private RutinaEjercicioService rutinaEjercicioService;

    @GetMapping
    public List<RutinaEjercicio> findAll() {
        return rutinaEjercicioService.findAll();
    }

    @GetMapping("/{id}")
    public RutinaEjercicio findById(@PathVariable Long id) {
        return rutinaEjercicioService.findById(id);
    }

    @PostMapping
    public RutinaEjercicio save(@RequestBody RutinaEjercicio rutinaEjercicio) {
        return rutinaEjercicioService.save(rutinaEjercicio);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        rutinaEjercicioService.deleteById(id);
    }

    @PutMapping("/{id}")
    public RutinaEjercicio update(@PathVariable Long id, @RequestBody RutinaEjercicio rutinaEjercicioActualizado) {
        RutinaEjercicio rutinaEjercicio = rutinaEjercicioService.findById(id);
        rutinaEjercicio.setReps(rutinaEjercicioActualizado.getReps());
        rutinaEjercicio.setSets(rutinaEjercicioActualizado.getSets());
        return rutinaEjercicioService.save(rutinaEjercicio);
    }
}