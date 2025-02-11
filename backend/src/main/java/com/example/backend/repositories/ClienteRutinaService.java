package com.example.backend.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.models.entity.Cliente;
import com.example.backend.models.entity.ClienteRutina;
import com.example.backend.models.entity.ClienteRutinaDia;
import com.example.backend.models.entity.ClienteRutinaEjercicio;
import com.example.backend.models.entity.Rutina;
import com.example.backend.models.entity.RutinaDia;
import com.example.backend.models.entity.RutinaEjercicio;

import jakarta.transaction.Transactional;

@Service
public class ClienteRutinaService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private RutinaRepository rutinaRepository;

    @Transactional
    public void asignarRutinaACliente(Long clienteId, Long rutinaId) {
        // Obtener el cliente y la rutina base
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        Rutina rutina = rutinaRepository.findById(rutinaId)
                .orElseThrow(() -> new RuntimeException("Rutina no encontrada"));

        // Crear la relación ClienteRutina
        ClienteRutina clienteRutina = new ClienteRutina();
        clienteRutina.setCliente(cliente);
        clienteRutina.setRutina(rutina);

        // Copiar los RutinaDia y convertirlos en ClienteRutinaDia
        for (RutinaDia rutinaDia : rutina.getRutinaDias()) {
            ClienteRutinaDia clienteRutinaDia = new ClienteRutinaDia();
            clienteRutinaDia.setNombre(rutinaDia.getNombre());
            clienteRutinaDia.setClienteRutina(clienteRutina);

            // Copiar los RutinaEjercicio y convertirlos en ClienteRutinaEjercicio
            for (RutinaEjercicio rutinaEjercicio : rutinaDia.getRutinaEjercicios()) {
                ClienteRutinaEjercicio clienteRutinaEjercicio = new ClienteRutinaEjercicio();
                clienteRutinaEjercicio.setRutinaEjercicio(rutinaEjercicio);
                clienteRutinaEjercicio.setClienteRutinaDia(clienteRutinaDia);
                clienteRutinaEjercicio.setNotas(""); // Notas vacías por defecto

                clienteRutinaDia.getClienteRutinaEjercicios().add(clienteRutinaEjercicio);
            }

            clienteRutina.getClienteRutinaDias().add(clienteRutinaDia);
        }

        // Guardar la relación ClienteRutina
        cliente.getClienteRutinas().add(clienteRutina);
        clienteRepository.save(cliente);
    }
}
