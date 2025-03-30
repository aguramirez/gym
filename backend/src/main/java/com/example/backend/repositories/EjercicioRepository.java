package com.example.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.models.entity.Ejercicio;

public interface EjercicioRepository extends JpaRepository<Ejercicio, Long> {
    List<Ejercicio> findByNombreContaining(String nombre);
    
    // Método para buscar por nombre exacto (útil para validaciones de duplicados)
    Optional<Ejercicio> findByNombre(String nombre);
}