package com.example.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.ClienteRutinaDTO;
import com.example.backend.dto.ClienteRutinaEjercicioDTO;
import com.example.backend.exceptions.BusinessLogicException;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.mappers.ClienteRutinaEjercicioMapper;
import com.example.backend.mappers.ClienteRutinaMapper;
import com.example.backend.models.entity.ClienteRutina;
import com.example.backend.services.ClienteRutinaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/cliente-rutinas")
public class ClienteRutinaController {

    @Autowired
    private ClienteRutinaService clienteRutinaService;
    
    @Autowired
    private ClienteRutinaMapper clienteRutinaMapper;
    
    @Autowired
    private ClienteRutinaEjercicioMapper clienteRutinaEjercicioMapper;

    @PostMapping("/asignar")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TRAINER')")
    public ResponseEntity<ClienteRutinaDTO> asignarRutina(
            @RequestParam Long clienteId, 
            @RequestParam Long rutinaId) {
        try {
            ClienteRutina nuevaAsignacion = clienteRutinaService.asignarRutinaACliente(clienteId, rutinaId);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(clienteRutinaMapper.toDTO(nuevaAsignacion));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (BusinessLogicException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/desasignar")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TRAINER')")
    public ResponseEntity<String> desasignarRutina(
            @RequestParam Long clienteId, 
            @RequestParam Long rutinaId) {
        try {
            clienteRutinaService.eliminarRelacion(clienteId, rutinaId);
            return ResponseEntity.ok("Rutina desasignada con éxito");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al desasignar rutina: " + e.getMessage());
        }
    }

    @GetMapping("/rutinas")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TRAINER') or @securityUtils.isCurrentUser(#clienteId)")
    public ResponseEntity<List<ClienteRutinaDTO>> obtenerRutinasCliente(@RequestParam Long clienteId) {
        try {
            List<ClienteRutina> clienteRutinas = clienteRutinaService.obtenerRutinasConNotas(clienteId);
            return ResponseEntity.ok(clienteRutinaMapper.toDTOList(clienteRutinas));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TRAINER') or @securityUtils.isClienteRutinaOwner(#id)")
    public ResponseEntity<ClienteRutinaDTO> obtenerClienteRutina(@PathVariable Long id) {
        try {
            ClienteRutina clienteRutina = clienteRutinaService.obtenerClienteRutina(id);
            return ResponseEntity.ok(clienteRutinaMapper.toDTO(clienteRutina));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/ejercicios/{ejercicioId}/notas")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TRAINER') or @securityUtils.isClienteRutinaEjercicioOwner(#ejercicioId)")
    public ResponseEntity<ClienteRutinaEjercicioDTO> actualizarNotasEjercicio(
            @PathVariable Long ejercicioId, 
            @Valid @RequestBody String notas) {
        try {
            return ResponseEntity.ok(clienteRutinaEjercicioMapper.toDTO(
                    clienteRutinaService.actualizarNotasEjercicio(ejercicioId, notas)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/ejercicios/{ejercicioId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TRAINER') or @securityUtils.isClienteRutinaEjercicioOwner(#ejercicioId)")
    public ResponseEntity<ClienteRutinaEjercicioDTO> actualizarEjercicio(
            @PathVariable Long ejercicioId, 
            @RequestParam int reps, 
            @RequestParam int sets) {
        try {
            return ResponseEntity.ok(clienteRutinaEjercicioMapper.toDTO(
                    clienteRutinaService.actualizarEjercicio(ejercicioId, reps, sets)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}