package com.example.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.models.entity.ClienteRutinaEjercicio;
import com.example.backend.services.ClienteRutinaEjercicioService;

@RestController
@RequestMapping("/cliente-rutina-ejercicios")
public class ClienteRutinaEjercicioController {

    @Autowired
    private ClienteRutinaEjercicioService clienteRutinaEjercicioService;

    @GetMapping
    public List<ClienteRutinaEjercicio> findAll() {
        return clienteRutinaEjercicioService.findAll();
    }

    @GetMapping("/{id}")
    public ClienteRutinaEjercicio findById(@PathVariable Long id) {
        return clienteRutinaEjercicioService.findById(id);
    }

    @PostMapping
    public ClienteRutinaEjercicio save(@RequestBody ClienteRutinaEjercicio clienteRutinaEjercicio) {
        return clienteRutinaEjercicioService.save(clienteRutinaEjercicio);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        clienteRutinaEjercicioService.deleteById(id);
    }

    // Endpoint para editar las notas de un ejercicio personalizado
    @PutMapping("/{id}")
    public ClienteRutinaEjercicio editarNotasEjercicio(@PathVariable Long id, @RequestBody String notas) {
        return clienteRutinaEjercicioService.editarNotasEjercicio(id, notas);
    }
}
