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

import com.example.backend.dto.EjercicioDTO;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.mappers.EjercicioMapper;
import com.example.backend.services.EjercicioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/ejercicios")
@PreAuthorize("hasRole('ADMIN') or hasRole('TRAINER')")
public class EjercicioController {
    
    @Autowired
    private EjercicioService ejercicioService;
    
    @Autowired
    private EjercicioMapper ejercicioMapper;

    @GetMapping
    public ResponseEntity<List<EjercicioDTO>> findAll() {
        return ResponseEntity.ok(ejercicioMapper.toDTOList(ejercicioService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EjercicioDTO> findById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ejercicioMapper.toDTO(ejercicioService.findById(id)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<EjercicioDTO> save(@Valid @RequestBody EjercicioDTO ejercicioDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ejercicioMapper.toDTO(ejercicioService.save(ejercicioMapper.toEntity(ejercicioDTO))));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        try {
            ejercicioService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<EjercicioDTO>> findByNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(ejercicioMapper.toDTOList(ejercicioService.findByNombre(nombre)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EjercicioDTO> editarEjercicio(@PathVariable Long id, @Valid @RequestBody EjercicioDTO ejercicioDTO) {
        try {
            return ResponseEntity.ok(ejercicioMapper.toDTO(
                    ejercicioService.editarEjercicio(id, ejercicioMapper.toEntity(ejercicioDTO))));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}