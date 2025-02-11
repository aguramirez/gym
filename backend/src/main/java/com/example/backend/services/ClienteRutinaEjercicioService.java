package com.example.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.models.entity.ClienteRutinaEjercicio;
import com.example.backend.repositories.ClienteRutinaEjercicioRepository;

@Service
public class ClienteRutinaEjercicioService {
    @Autowired
    private ClienteRutinaEjercicioRepository clienteRutinaEjercicioRepository;

    public List<ClienteRutinaEjercicio> findAll() {
        return clienteRutinaEjercicioRepository.findAll();
    }

    public ClienteRutinaEjercicio findById(Long id) {
        return clienteRutinaEjercicioRepository.findById(id).orElse(null);
    }

    public ClienteRutinaEjercicio save(ClienteRutinaEjercicio clienteRutinaEjercicio) {
        return clienteRutinaEjercicioRepository.save(clienteRutinaEjercicio);
    }

    public void deleteById(Long id) {
        clienteRutinaEjercicioRepository.deleteById(id);
    }

    public ClienteRutinaEjercicio editarNotasEjercicio(Long id, String notas) {
        // Buscar el ejercicio personalizado por su ID
        ClienteRutinaEjercicio ejercicioExistente = clienteRutinaEjercicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ejercicio personalizado no encontrado"));

        // Actualizar las notas del ejercicio
        ejercicioExistente.setNotas(notas);

        // Guardar el ejercicio actualizado en la base de datos
        return clienteRutinaEjercicioRepository.save(ejercicioExistente);
    }
}
