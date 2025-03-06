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

import com.example.backend.models.entity.RutinaDia;
import com.example.backend.models.entity.RutinaEjercicio;
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

    @PutMapping("/{id}")
    public RutinaDia update(@PathVariable Long id, @RequestBody RutinaDia rutinaDiaActualizada) {
        // Buscar el día de rutina existente
        RutinaDia rutinaDia = rutinaDiaService.findById(id);

        // Actualizar los campos del día
        rutinaDia.setNombre(rutinaDiaActualizada.getNombre());

        // Agregar los nuevos ejercicios si existen
        if (rutinaDiaActualizada.getRutinaEjercicios() != null) {
            for (RutinaEjercicio ejercicioNuevo : rutinaDiaActualizada.getRutinaEjercicios()) {
                // Asignar el RutinaDia al ejercicio para la relación bidireccional
                ejercicioNuevo.setRutinaDia(rutinaDia);
                // Agregar el ejercicio al día de rutina
                rutinaDia.getRutinaEjercicios().add(ejercicioNuevo);
            }
        }

        // Guardar el día actualizado con los ejercicios nuevos
        return rutinaDiaService.save(rutinaDia);
    }
}
