package com.example.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.ClienteDTO;
import com.example.backend.dto.RutinaDTO;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.mappers.ClienteMapper;
import com.example.backend.mappers.RutinaMapper;
import com.example.backend.models.entity.Cliente;
import com.example.backend.services.ClienteService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/clientes")
public class ClienteController {
    
    @Autowired
    private ClienteService clienteService;
    
    @Autowired
    private ClienteMapper clienteMapper;
    
    @Autowired
    private RutinaMapper rutinaMapper;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ClienteDTO>> findAll() {
        return ResponseEntity.ok(clienteMapper.toDTOList(clienteService.findAll()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TRAINER') or @securityUtils.isCurrentUser(#id)")
    public ResponseEntity<ClienteDTO> findById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(clienteMapper.toDTO(clienteService.findById(id)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClienteDTO> save(@Valid @RequestBody ClienteDTO clienteDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(clienteMapper.toDTO(clienteService.save(clienteMapper.toEntity(clienteDTO))));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        try {
            clienteService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ClienteDTO>> findByNombreOrDni(
            @RequestParam(required = false, defaultValue = "") String nombre, 
            @RequestParam(required = false, defaultValue = "") String dni) {
        return ResponseEntity.ok(clienteMapper.toDTOList(clienteService.findByNombreOrDni(nombre, dni)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClienteDTO> editarCliente(@PathVariable Long id, @Valid @RequestBody ClienteDTO clienteDTO) {
        try {
            return ResponseEntity.ok(clienteMapper.toDTO(clienteService.editarCliente(id, clienteMapper.toEntity(clienteDTO))));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{clienteId}/rutinas")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TRAINER') or @securityUtils.isCurrentUser(#clienteId)")
    public ResponseEntity<List<RutinaDTO>> getRutinasDeCliente(@PathVariable Long clienteId) {
        try {
            return ResponseEntity.ok(rutinaMapper.toDTOList(clienteService.obtenerRutinasDeCliente(clienteId)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}