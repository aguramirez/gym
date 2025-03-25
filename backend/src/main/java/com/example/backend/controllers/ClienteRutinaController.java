package com.example.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
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

    @DeleteMapping("/desasignar")
    public ResponseEntity<String> desasignarRutina(@RequestParam Long clienteId, @RequestParam Long rutinaId) {
        try {
            clienteRutinaService.eliminarRelacion(clienteId, rutinaId);

            return ResponseEntity.ok("Rutina desasignada con éxito");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al desasignar rutina");
        }
    }
}
