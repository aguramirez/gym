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

    @Autowired
    private ClienteRutinaDiaRepository clienteRutinaDiaRepository;

    @Autowired
    private ClienteRutinaEjercicioRepository clienteRutinaEjercicioRepository;


    public ClienteRutina asignarRutinaACliente(Long clienteId, Long rutinaId) {
        Cliente cliente = clienteRepository.findById(clienteId)
            .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        Rutina rutinaBase = rutinaRepository.findById(rutinaId)
            .orElseThrow(() -> new RuntimeException("Rutina no encontrada"));
    
        // Verificar si la rutina ya está asignada
        boolean yaAsignada = clienteRutinaRepository.existsByClienteIdAndRutinaId(clienteId, rutinaId);
        if (yaAsignada) {
            throw new RuntimeException("El cliente ya tiene esta rutina asignada");
        }
    
        // Crear ClienteRutina
        ClienteRutina clienteRutina = new ClienteRutina();
        clienteRutina.setCliente(cliente);
        clienteRutina.setRutina(rutinaBase);
    
        // Clonar los días y ejercicios de la rutina base
        List<ClienteRutinaDia> clienteDias = rutinaBase.getRutinaDias().stream().map(rutinaDia -> {
            ClienteRutinaDia clienteDia = new ClienteRutinaDia();
            clienteDia.setNombre(rutinaDia.getNombre());
            clienteDia.setClienteRutina(clienteRutina);
    
            List<ClienteRutinaEjercicio> clienteEjercicios = rutinaDia.getRutinaEjercicios().stream().map(re -> {
                ClienteRutinaEjercicio clienteEjercicio = new ClienteRutinaEjercicio();
                clienteEjercicio.setRutinaEjercicio(re);
                clienteEjercicio.setClienteRutinaDia(clienteDia);
                clienteEjercicio.setNotas(""); 
                return clienteEjercicio;
            }).collect(Collectors.toList());
    
            clienteDia.setClienteRutinaEjercicios(clienteEjercicios);
            return clienteDia;
        }).collect(Collectors.toList());

    clienteRutina.setClienteRutinaDias(clienteDias);return clienteRutinaRepository.save(clienteRutina);

    }

    public void eliminarRelacion(Long clienteId, Long rutinaId) {
        List<ClienteRutina> clienteRutinas = clienteRutinaRepository.findByClienteIdAndRutinaId(clienteId, rutinaId);
    
        if (clienteRutinas.isEmpty()) {
            throw new RuntimeException("No se encontró la relación entre cliente y rutina");
        }
    
        for (ClienteRutina clienteRutina : clienteRutinas) {
            // Eliminar los ejercicios que dependen de los días
            for (ClienteRutinaDia clienteRutinaDia : clienteRutina.getClienteRutinaDias()) {
                clienteRutinaEjercicioRepository.deleteByClienteRutinaDiaId(clienteRutinaDia.getId());
            }
            
            // Eliminar los días
            clienteRutinaDiaRepository.deleteByClienteRutina(clienteRutina);
            
            // Eliminar los ejercicios asociados a la rutina
            clienteRutinaEjercicioRepository.deleteByClienteRutina(clienteRutina);
        }
    
        // Finalmente eliminar la relación ClienteRutina
        clienteRutinaRepository.deleteByClienteIdAndRutinaId(clienteId, rutinaId);
    }
    
    

}
