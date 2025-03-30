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
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.RutinaDTO;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.mappers.RutinaMapper;
import com.example.backend.models.entity.Rutina;
import com.example.backend.services.RutinaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/rutinas")
@PreAuthorize("hasRole('ADMIN') or hasRole('TRAINER')")
public class RutinaController {
    
    @Autowired
    private RutinaService rutinaService;
    
    @Autowired
    private RutinaMapper rutinaMapper;

    @GetMapping
    public ResponseEntity<List<RutinaDTO>> findAll() {
        return ResponseEntity.ok(rutinaMapper.toDTOList(rutinaService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RutinaDTO> findById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(rutinaMapper.toDTO(rutinaService.findById(id)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<RutinaDTO> save(@Valid @RequestBody RutinaDTO rutinaDTO) {
        Rutina rutina = rutinaMapper.toEntity(rutinaDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(rutinaMapper.toDTO(rutinaService.save(rutina)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        try {
            rutinaService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<RutinaDTO> editarRutina(@PathVariable Long id, @Valid @RequestBody RutinaDTO rutinaDTO) {
        try {
            Rutina rutina = rutinaMapper.toEntity(rutinaDTO);
            return ResponseEntity.ok(rutinaMapper.toDTO(rutinaService.editarRutina(id, rutina)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}