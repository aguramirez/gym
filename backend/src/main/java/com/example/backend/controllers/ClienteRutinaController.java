package com.example.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.repositories.ClienteRutinaService;

@RestController
@RequestMapping("/clientes")
public class ClienteRutinaController {

    @Autowired
    private ClienteRutinaService clienteRutinaService;

    @PostMapping("/{clienteId}/asignar-rutina/{rutinaId}")
    public void asignarRutinaACliente(@PathVariable Long clienteId, @PathVariable Long rutinaId) {
        clienteRutinaService.asignarRutinaACliente(clienteId, rutinaId);
    }
}
