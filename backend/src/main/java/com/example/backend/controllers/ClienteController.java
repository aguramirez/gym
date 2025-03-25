package com.example.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.models.entity.Cliente;
import com.example.backend.models.entity.Rutina;
import com.example.backend.services.ClienteService;

@RestController
@RequestMapping("/clientes")
public class ClienteController {
    @Autowired
    private ClienteService clienteService;

    @GetMapping
    public List<Cliente> findAll() {
        return clienteService.findAll();
    }

    @GetMapping("/{id}")
    public Cliente findById(@PathVariable Long id) {
        return clienteService.findById(id);
    }

    @PostMapping
    public Cliente save(@RequestBody Cliente cliente) {
        return clienteService.save(cliente);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        clienteService.deleteById(id);
    }

    @GetMapping("/search")
    public List<Cliente> findByNombreOrDni(@RequestParam String nombre, @RequestParam String dni) {
        return clienteService.findByNombreOrDni(nombre, dni);
    }

    @PutMapping("/{id}")
    public Cliente editarCliente(@PathVariable Long id, @RequestBody Cliente clienteActualizado) {
        return clienteService.editarCliente(id, clienteActualizado);
    }

    @GetMapping("/{clienteId}/rutinas")
    public ResponseEntity<List<Rutina>> getRutinasDeCliente(@PathVariable Long clienteId) {
        List<Rutina> rutinas = clienteService.obtenerRutinasDeCliente(clienteId);
        return ResponseEntity.ok(rutinas);
    }
}
