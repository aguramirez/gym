package com.example.backend.repositories;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.models.entity.Cliente;
import com.example.backend.models.entity.ClienteRutina;
import com.example.backend.models.entity.ClienteRutinaDia;
import com.example.backend.models.entity.ClienteRutinaEjercicio;
import com.example.backend.models.entity.Rutina;

@Service
public class ClienteRutinaService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private RutinaRepository rutinaRepository;

    @Autowired
    private ClienteRutinaRepository clienteRutinaRepository;

    public ClienteRutina asignarRutinaACliente(Long clienteId, Long rutinaId) {
        Cliente cliente = clienteRepository.findById(clienteId)
            .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        Rutina rutinaBase = rutinaRepository.findById(rutinaId)
            .orElseThrow(() -> new RuntimeException("Rutina no encontrada"));

        // Crear ClienteRutina
        ClienteRutina clienteRutina = new ClienteRutina();
        clienteRutina.setCliente(cliente);
        clienteRutina.setRutina(rutinaBase);

        // Clonar los días y ejercicios de la rutina base
        List<ClienteRutinaDia> clienteDias = rutinaBase.getRutinaDias().stream().map(rutinaDia -> {
            ClienteRutinaDia clienteDia = new ClienteRutinaDia();
            clienteDia.setNombre(rutinaDia.getNombre());
            clienteDia.setClienteRutina(clienteRutina);

            // Clonar ejercicios de cada día
            List<ClienteRutinaEjercicio> clienteEjercicios = rutinaDia.getRutinaEjercicios().stream().map(re -> {
                ClienteRutinaEjercicio clienteEjercicio = new ClienteRutinaEjercicio();
                clienteEjercicio.setRutinaEjercicio(re);
                clienteEjercicio.setClienteRutinaDia(clienteDia);
                clienteEjercicio.setNotas(""); // Inicialmente vacío
                return clienteEjercicio;
            }).collect(Collectors.toList());

            clienteDia.setClienteRutinaEjercicios(clienteEjercicios);
            return clienteDia;
        }).collect(Collectors.toList());

        clienteRutina.setClienteRutinaDias(clienteDias);
        return clienteRutinaRepository.save(clienteRutina);
    }
}
