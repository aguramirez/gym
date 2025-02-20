package com.example.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.models.entity.Rutina;
import com.example.backend.models.entity.RutinaDia;
import com.example.backend.models.entity.RutinaEjercicio;
import com.example.backend.repositories.RutinaRepository;

@Service
public class RutinaService {
    @Autowired
    private RutinaRepository rutinaRepository;

    public List<Rutina> findAll() {
        return rutinaRepository.findAll();
    }

    public Rutina findById(Long id) {
        return rutinaRepository.findById(id).orElse(null);
    }

    public Rutina save(Rutina rutina) {
        return rutinaRepository.save(rutina);
    }

    public void deleteById(Long id) {
        rutinaRepository.deleteById(id);
    }

    public Rutina editarRutina(Long id, Rutina rutinaActualizada) {
    // Buscar la rutina existente por su ID
    Rutina rutinaExistente = rutinaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Rutina no encontrada"));

    // Actualizar los campos de la rutina existente con los datos de la rutina actualizada
    rutinaExistente.setNombre(rutinaActualizada.getNombre());

    // Actualizar los días de la rutina
    if (rutinaActualizada.getRutinaDias() != null) {
        for (RutinaDia diaActualizado : rutinaActualizada.getRutinaDias()) {
            RutinaDia diaExistente = rutinaExistente.getRutinaDias().stream()
                .filter(dia -> dia.getId().equals(diaActualizado.getId()))
                .findFirst()
                .orElse(null);
            
            if (diaExistente != null) {
                // Actualizar el nombre del día
                diaExistente.setNombre(diaActualizado.getNombre());
                
                // Actualizar los ejercicios del día
                if (diaActualizado.getRutinaEjercicios() != null) {
                    for (RutinaEjercicio ejercicioActualizado : diaActualizado.getRutinaEjercicios()) {
                        RutinaEjercicio ejercicioExistente = diaExistente.getRutinaEjercicios().stream()
                            .filter(ejercicio -> ejercicio.getId().equals(ejercicioActualizado.getId()))
                            .findFirst()
                            .orElse(null);
                        
                        if (ejercicioExistente != null) {
                            // Actualizar los sets y reps
                            ejercicioExistente.setReps(ejercicioActualizado.getReps());
                            ejercicioExistente.setSets(ejercicioActualizado.getSets());
                        }
                    }
                }
            }
        }
    }

    // Guardar la rutina actualizada, incluidos los días y ejercicios
    return rutinaRepository.save(rutinaExistente);
}
}
