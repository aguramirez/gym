package com.example.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.models.entity.ClienteRutina;

public interface ClienteRutinaRepository extends JpaRepository<ClienteRutina, Long> {
    @Query("SELECT cr FROM ClienteRutina cr WHERE cr.cliente.id = :clienteId AND cr.rutina.id = :rutinaId")
    List<ClienteRutina> findByClienteIdAndRutinaId(
        @Param("clienteId") Long clienteId, 
        @Param("rutinaId") Long rutinaId
    );

    boolean existsByClienteIdAndRutinaId(Long clienteId, Long rutinaId);

    List<ClienteRutina> findByClienteId(Long clienteId);
    
    // Consulta optimizada para cargar la rutina del cliente con sus días y ejercicios
    @Query("SELECT cr FROM ClienteRutina cr " + 
           "LEFT JOIN FETCH cr.clienteRutinaDias crd " +
           "LEFT JOIN FETCH crd.clienteRutinaEjercicios " +
           "WHERE cr.id = :id")
    Optional<ClienteRutina> findByIdWithDiasAndEjercicios(@Param("id") Long id);
    
    // Consulta optimizada para clientes específicos
    @Query("SELECT cr FROM ClienteRutina cr " + 
           "LEFT JOIN FETCH cr.clienteRutinaDias crd " +
           "LEFT JOIN FETCH crd.clienteRutinaEjercicios " +
           "WHERE cr.cliente.id = :clienteId")
    List<ClienteRutina> findByClienteIdWithDiasAndEjercicios(@Param("clienteId") Long clienteId);
}