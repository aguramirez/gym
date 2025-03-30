package com.example.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.models.entity.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    List<Cliente> findByNombreContainingOrDniContaining(String nombre, String dni);

    Optional<Cliente> findByNombreAndDni(String nombre, String dni);
    
    Optional<Cliente> findByDni(String dni);
    
    // Consulta optimizada para cargar el cliente con sus rutinas en una sola operación
    @Query("SELECT c FROM Cliente c LEFT JOIN FETCH c.clienteRutinas WHERE c.id = :id")
    Optional<Cliente> findByIdWithRutinas(@Param("id") Long id);
}