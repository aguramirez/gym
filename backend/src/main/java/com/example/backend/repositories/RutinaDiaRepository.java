package com.example.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.models.entity.RutinaDia;

public interface RutinaDiaRepository extends JpaRepository<RutinaDia, Long> {
    List<RutinaDia> findByRutinaId(Long rutinaId);
    
    // Consulta optimizada para cargar un día con sus ejercicios
    @Query("SELECT rd FROM RutinaDia rd " +
           "LEFT JOIN FETCH rd.rutinaEjercicios " +
           "WHERE rd.id = :id")
    Optional<RutinaDia> findByIdWithEjercicios(@Param("id") Long id);
}