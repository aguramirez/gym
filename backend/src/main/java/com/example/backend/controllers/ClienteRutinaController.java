package com.example.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.models.entity.ClienteRutina;
import com.example.backend.repositories.ClienteRutinaService;

@RestController
@RequestMapping("/cliente-rutinas")
public class ClienteRutinaController {

    @Autowired
    private ClienteRutinaService clienteRutinaService;

    @PostMapping("/asignar")
    public ResponseEntity<ClienteRutina> asignarRutina(@RequestParam Long clienteId, @RequestParam Long rutinaId) {
        ClienteRutina nuevaAsignacion = clienteRutinaService.asignarRutinaACliente(clienteId, rutinaId);
        return ResponseEntity.ok(nuevaAsignacion);
    }
}
