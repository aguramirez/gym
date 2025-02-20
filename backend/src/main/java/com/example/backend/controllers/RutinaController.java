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

import com.example.backend.models.entity.Rutina;
import com.example.backend.models.entity.RutinaDia;
import com.example.backend.models.entity.RutinaEjercicio;
import com.example.backend.services.RutinaService;

@RestController
@RequestMapping("/rutinas")
public class RutinaController {
    @Autowired
    private RutinaService rutinaService;

    @GetMapping
    public List<Rutina> findAll() {
        return rutinaService.findAll();
    }

    @GetMapping("/{id}")
    public Rutina findById(@PathVariable Long id) {
        return rutinaService.findById(id);
    }

    @PostMapping
    public Rutina save(@RequestBody Rutina rutina) {
        if (rutina.getRutinaDias() != null) {
        for (RutinaDia dia : rutina.getRutinaDias()) {
            dia.setRutina(rutina); // Asignar la rutina a cada día
            if (dia.getRutinaEjercicios() != null) {
                for (RutinaEjercicio ejercicio : dia.getRutinaEjercicios()) {
                    ejercicio.setRutinaDia(dia); // Asignar el día a cada ejercicio
                }
            }
        }
    }
        return rutinaService.save(rutina);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        rutinaService.deleteById(id);
    }

    @PutMapping("/{id}")
    public Rutina editarRutina(@PathVariable Long id, @RequestBody Rutina rutinaActualizada) {
        return rutinaService.editarRutina(id, rutinaActualizada);
    }
}
