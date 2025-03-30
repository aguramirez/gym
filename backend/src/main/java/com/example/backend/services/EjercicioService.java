package com.example.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.exceptions.BusinessLogicException;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.models.entity.Ejercicio;
import com.example.backend.repositories.EjercicioRepository;
import com.example.backend.repositories.RutinaEjercicioRepository;

@Service
public class EjercicioService {
    
    @Autowired
    private EjercicioRepository ejercicioRepository;
    
    @Autowired
    private RutinaEjercicioRepository rutinaEjercicioRepository;

    @Transactional(readOnly = true)
    public List<Ejercicio> findAll() {
        return ejercicioRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Ejercicio findById(Long id) {
        return ejercicioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ejercicio no encontrado con ID: " + id));
    }

    @Transactional
    public Ejercicio save(Ejercicio ejercicio) {
        // Validar que no exista otro ejercicio con el mismo nombre
        if (ejercicio.getId() == null && ejercicioRepository.findByNombre(ejercicio.getNombre()).isPresent()) {
            throw new BusinessLogicException("Ya existe un ejercicio con el nombre: " + ejercicio.getNombre());
        }
        return ejercicioRepository.save(ejercicio);
    }

    @Transactional
    public void deleteById(Long id) {
        Ejercicio ejercicio = findById(id); // Validar que existe
        
        // Verificar si el ejercicio está en uso en alguna rutina
        long count = rutinaEjercicioRepository.countByEjercicioId(id);
        if (count > 0) {
            throw new DataIntegrityViolationException(
                "El ejercicio está siendo utilizado en " + count + " rutinas y no puede ser eliminado");
        }
        
        ejercicioRepository.delete(ejercicio);
    }

    @Transactional(readOnly = true)
    public List<Ejercicio> findByNombre(String nombre) {
        return ejercicioRepository.findByNombreContaining(nombre);
    }

    @Transactional
    public Ejercicio editarEjercicio(Long id, Ejercicio ejercicioActualizado) {
        // Buscar el ejercicio existente por su ID
        Ejercicio ejercicioExistente = findById(id);
        
        // Validar que el nuevo nombre no esté duplicado (si cambió el nombre)
        if (!ejercicioExistente.getNombre().equals(ejercicioActualizado.getNombre()) &&
            ejercicioRepository.findByNombre(ejercicioActualizado.getNombre()).isPresent()) {
            throw new BusinessLogicException("Ya existe un ejercicio con el nombre: " + ejercicioActualizado.getNombre());
        }

        // Actualizar los campos del ejercicio existente con los datos del ejercicio actualizado
        ejercicioExistente.setNombre(ejercicioActualizado.getNombre());
        ejercicioExistente.setVideo(ejercicioActualizado.getVideo());

        // Guardar el ejercicio actualizado en la base de datos
        return ejercicioRepository.save(ejercicioExistente);
    }
}