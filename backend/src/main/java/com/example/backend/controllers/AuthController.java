package com.example.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.AuthRequestDTO;
import com.example.backend.dto.AuthResponseDTO;
import com.example.backend.dto.RegisterRequestDTO;
import com.example.backend.models.entity.Cliente;
import com.example.backend.repositories.ClienteRepository;
import com.example.backend.security.JwtTokenProvider;

import jakarta.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthRequestDTO loginRequest) {
        
        // Verificar si existe el cliente con el nombre y DNI proporcionados
        Optional<Cliente> clienteOpt = clienteRepository.findByNombreAndDni(
                loginRequest.getNombre(), loginRequest.getDni());
        
        if (clienteOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Credenciales incorrectas");
        }
        
        Cliente cliente = clienteOpt.get();
        
        // Para este sistema simplificado, validamos directamente los campos sin password
        // En un sistema real, usarías authenticationManager.authenticate()
        
        // Generar token JWT
        String jwt = tokenProvider.generateToken(cliente.getDni(), cliente.getRol());
        
        // Construir y devolver respuesta
        AuthResponseDTO response = new AuthResponseDTO();
        response.setToken(jwt);
        response.setClienteId(cliente.getId());
        response.setNombre(cliente.getNombre());
        response.setRol(cliente.getRol());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        // Verificar si el DNI ya está registrado
        if (clienteRepository.findByDni(registerRequest.getDni()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: DNI ya registrado");
        }

        // Crear nueva cuenta de cliente
        Cliente cliente = new Cliente();
        cliente.setNombre(registerRequest.getNombre());
        cliente.setDni(registerRequest.getDni());
        cliente.setTelefono(registerRequest.getTelefono());
        cliente.setRol("USER"); // Por defecto, rol de usuario

        clienteRepository.save(cliente);

        return ResponseEntity.ok("Usuario registrado exitosamente");
    }
}