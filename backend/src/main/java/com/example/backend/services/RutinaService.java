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
        Rutina rutinaExistente = rutinaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Rutina no encontrada"));
    
        rutinaExistente.setNombre(rutinaActualizada.getNombre());
    
        // Actualizar o agregar días
        List<RutinaDia> diasActualizados = rutinaActualizada.getRutinaDias();
    
        rutinaExistente.getRutinaDias().removeIf(diaExistente -> 
            diasActualizados.stream().noneMatch(diaActualizado -> 
                diaActualizado.getId() != null && diaActualizado.getId().equals(diaExistente.getId())
            )
        );
    
        for (RutinaDia diaActualizado : diasActualizados) {
            if (diaActualizado.getId() == null) {
                diaActualizado.setRutina(rutinaExistente);
                rutinaExistente.getRutinaDias().add(diaActualizado);
            } else {
                RutinaDia diaExistente = rutinaExistente.getRutinaDias().stream()
                    .filter(d -> d.getId().equals(diaActualizado.getId()))
                    .findFirst()
                    .orElse(null);
                if (diaExistente != null) {
                    diaExistente.setNombre(diaActualizado.getNombre());
    
                    List<RutinaEjercicio> ejerciciosActualizados = diaActualizado.getRutinaEjercicios();
    
                    diaExistente.getRutinaEjercicios().removeIf(ejercicioExistente -> 
                        ejerciciosActualizados.stream().noneMatch(ejercicioActualizado -> 
                            ejercicioActualizado.getId() != null && ejercicioActualizado.getId().equals(ejercicioExistente.getId())
                        )
                    );
    
                    for (RutinaEjercicio ejercicioActualizado : ejerciciosActualizados) {
                        if (ejercicioActualizado.getId() == null) {
                            ejercicioActualizado.setRutinaDia(diaExistente);
                            diaExistente.getRutinaEjercicios().add(ejercicioActualizado);
                        } else {
                            RutinaEjercicio ejercicioExistente = diaExistente.getRutinaEjercicios().stream()
                                .filter(e -> e.getId().equals(ejercicioActualizado.getId()))
                                .findFirst()
                                .orElse(null);
                            if (ejercicioExistente != null) {
                                ejercicioExistente.setReps(ejercicioActualizado.getReps());
                                ejercicioExistente.setSets(ejercicioActualizado.getSets());
                            }
                        }
                    }
                }
            }
        }
    
        return rutinaRepository.save(rutinaExistente);
    }
    
}
