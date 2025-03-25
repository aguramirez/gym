package com.example.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.models.entity.ClienteRutina;

import jakarta.transaction.Transactional;

public interface ClienteRutinaRepository extends JpaRepository<ClienteRutina, Long> {
    List<ClienteRutina> findByClienteIdAndRutinaId(Long clienteId, Long rutinaId);

    boolean existsByClienteIdAndRutinaId(Long clienteId, Long rutinaId);

    @Modifying
    @Transactional
    @Query("DELETE FROM ClienteRutina cr WHERE cr.cliente.id = :clienteId AND cr.rutina.id = :rutinaId")
    void deleteByClienteIdAndRutinaId(@Param("clienteId") Long clienteId, @Param("rutinaId") Long rutinaId);
}
