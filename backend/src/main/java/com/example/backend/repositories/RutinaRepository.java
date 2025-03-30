package com.example.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.models.entity.Rutina;

public interface RutinaRepository extends JpaRepository<Rutina, Long> {
    List<Rutina> findByNombreContaining(String nombre);
    
    // Consulta modificada para evitar MultipleBagFetchException
    // Solo carga los días, sin cargar los ejercicios en la misma consulta
    @Query("SELECT r FROM Rutina r LEFT JOIN FETCH r.rutinaDias WHERE r.id = :id")
    Optional<Rutina> findByIdWithDias(@Param("id") Long id);
    
    // Consulta para cargar los ejercicios de un día específico
    @Query("SELECT rd FROM RutinaDia rd LEFT JOIN FETCH rd.rutinaEjercicios WHERE rd.rutina.id = :rutinaId")
    List<Object> findDiasWithEjerciciosByRutinaId(@Param("rutinaId") Long rutinaId);
}