package com.example.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.exceptions.BusinessLogicException;
import com.example.backend.models.entity.Cliente;
import com.example.backend.models.entity.ClienteRutina;
import com.example.backend.models.entity.ClienteRutinaDia;
import com.example.backend.models.entity.ClienteRutinaEjercicio;
import com.example.backend.models.entity.Rutina;
import com.example.backend.models.entity.RutinaDia;
import com.example.backend.models.entity.RutinaEjercicio;
import com.example.backend.repositories.ClienteRepository;
import com.example.backend.repositories.RutinaRepository;
import com.example.backend.repositories.ClienteRutinaRepository;
import com.example.backend.repositories.ClienteRutinaDiaRepository;
import com.example.backend.repositories.ClienteRutinaEjercicioRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

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

    /**
     * Asigna una rutina a un cliente, creando una copia personalizable de la rutina
     * para el cliente específico
     * 
     * @param clienteId ID del cliente
     * @param rutinaId ID de la rutina a asignar
     * @return La nueva ClienteRutina creada
     * @throws ResourceNotFoundException si no se encuentra el cliente o la rutina
     * @throws BusinessLogicException si la rutina ya está asignada al cliente
     */
    @Transactional
    public ClienteRutina asignarRutinaACliente(Long clienteId, Long rutinaId) {
        // Buscar cliente y rutina con consultas simples primero para evitar nested collections
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + clienteId));
        
        // Primero obtenemos la rutina sin cargar ávidamente las colecciones
        Rutina rutinaBase = rutinaRepository.findById(rutinaId)
                .orElseThrow(() -> new ResourceNotFoundException("Rutina no encontrada con ID: " + rutinaId));

        // Verificar si la rutina ya está asignada
        boolean yaAsignada = clienteRutinaRepository.existsByClienteIdAndRutinaId(clienteId, rutinaId);
        if (yaAsignada) {
            throw new BusinessLogicException("El cliente ya tiene esta rutina asignada");
        }

        // Crear ClienteRutina
        ClienteRutina clienteRutina = new ClienteRutina();
        clienteRutina.setCliente(cliente);
        clienteRutina.setRutina(rutinaBase);
        clienteRutina.setNombre(rutinaBase.getNombre());
        
        // Guardar primero la entidad ClienteRutina para establecer su ID
        clienteRutina = clienteRutinaRepository.save(clienteRutina);
        
        // Ahora cargar la rutina completa para clonar su estructura
        // Esto evita el MultipleBagFetchException al separar las consultas
        List<RutinaDia> rutinaDias = rutinaBase.getRutinaDias();
        
        // Clonar los días y ejercicios de la rutina base
        for (RutinaDia rutinaDia : rutinaDias) {
            ClienteRutinaDia clienteDia = new ClienteRutinaDia();
            clienteDia.setNombre(rutinaDia.getNombre());
            clienteDia.setClienteRutina(clienteRutina);
            
            // Guardar el día primero para obtener su ID
            clienteDia = clienteRutinaDiaRepository.save(clienteDia);
            
            // Ahora cargar los ejercicios de este día específico
            List<RutinaEjercicio> ejercicios = rutinaDia.getRutinaEjercicios();
            
            for (RutinaEjercicio re : ejercicios) {
                ClienteRutinaEjercicio clienteEjercicio = new ClienteRutinaEjercicio();
                clienteEjercicio.setReps(re.getReps());
                clienteEjercicio.setSets(re.getSets());
                clienteEjercicio.setNotas("");
                clienteEjercicio.setEjercicio(re.getEjercicio());
                clienteEjercicio.setClienteRutinaDia(clienteDia);
                
                // Guardar el ejercicio
                clienteRutinaEjercicioRepository.save(clienteEjercicio);
            }
        }

        // Recargar la entidad completa con todos sus días y ejercicios
        return clienteRutinaRepository.findById(clienteRutina.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Error al recargar la rutina del cliente"));
    }

    /**
     * Elimina la asignación de una rutina a un cliente
     * 
     * @param clienteId ID del cliente
     * @param rutinaId ID de la rutina
     * @throws ResourceNotFoundException si no se encuentra la relación entre el cliente y la rutina
     */
    @Transactional
    public void eliminarRelacion(Long clienteId, Long rutinaId) {
        List<ClienteRutina> clienteRutinas = clienteRutinaRepository.findByClienteIdAndRutinaId(clienteId, rutinaId);

        if (clienteRutinas.isEmpty()) {
            throw new ResourceNotFoundException("No se encontró la relación entre el cliente con ID: " + clienteId + 
                                               " y la rutina con ID: " + rutinaId);
        }

        // Eliminar cada relación encontrada
        for (ClienteRutina clienteRutina : clienteRutinas) {
            clienteRutinaRepository.delete(clienteRutina);
        }
    }

    /**
     * Obtiene todas las rutinas asignadas a un cliente con sus notas y detalles
     * 
     * @param clienteId ID del cliente
     * @return Lista de ClienteRutina con todos sus detalles
     * @throws ResourceNotFoundException si no se encuentra el cliente
     */
    @Transactional(readOnly = true)
    public List<ClienteRutina> obtenerRutinasConNotas(Long clienteId) {
        // Verificar que el cliente existe
        if (!clienteRepository.existsById(clienteId)) {
            throw new ResourceNotFoundException("Cliente no encontrado con ID: " + clienteId);
        }
        
        try {
            // Usar la consulta optimizada que carga todo en una sola operación
            return clienteRutinaRepository.findByClienteId(clienteId);
        } catch (Exception e) {
            // Si hay cualquier error, manejarlo de manera más controlada
            System.err.println("Error al obtener rutinas del cliente: " + e.getMessage());
            e.printStackTrace();
            // Devolver una lista vacía en lugar de dejar que se propague la excepción
            return List.of();
        }
    }
    
    /**
     * Obtiene una rutina específica asignada a un cliente
     * 
     * @param clienteRutinaId ID de la relación ClienteRutina
     * @return La ClienteRutina con todos sus detalles
     * @throws ResourceNotFoundException si no se encuentra la rutina del cliente
     */
    @Transactional(readOnly = true)
    public ClienteRutina obtenerClienteRutina(Long clienteRutinaId) {
        return clienteRutinaRepository.findByIdWithDiasAndEjercicios(clienteRutinaId)
                .orElseThrow(() -> new ResourceNotFoundException("Rutina de cliente no encontrada con ID: " + clienteRutinaId));
    }
    
    /**
     * Actualiza las notas de un ejercicio específico en la rutina de un cliente
     * 
     * @param ejercicioId ID del ClienteRutinaEjercicio
     * @param notas Las nuevas notas
     * @return El ejercicio actualizado
     * @throws ResourceNotFoundException si no se encuentra el ejercicio
     */
    @Transactional
    public ClienteRutinaEjercicio actualizarNotasEjercicio(Long ejercicioId, String notas) {
        ClienteRutinaEjercicio ejercicio = clienteRutinaEjercicioRepository.findById(ejercicioId)
                .orElseThrow(() -> new ResourceNotFoundException("Ejercicio no encontrado con ID: " + ejercicioId));
        
        // Comprobar si las notas están en formato JSON (empieza con {"notas":)
        if (notas != null && notas.trim().startsWith("{") && notas.contains("\"notas\":")) {
            try {
                // Intentar extraer el valor de notas del JSON
                ObjectMapper mapper = new ObjectMapper();
                JsonNode jsonNode = mapper.readTree(notas);
                if (jsonNode.has("notas")) {
                    notas = jsonNode.get("notas").asText();
                }
            } catch (Exception e) {
                // Si hay error al procesar el JSON, usamos las notas tal como están
                System.err.println("Error al procesar notas JSON: " + e.getMessage());
            }
        }
        
        ejercicio.setNotas(notas);
        return clienteRutinaEjercicioRepository.save(ejercicio);
    }
    
    /**
     * Actualiza las repeticiones y series de un ejercicio específico en la rutina de un cliente
     * 
     * @param ejercicioId ID del ClienteRutinaEjercicio
     * @param reps Número de repeticiones
     * @param sets Número de series
     * @return El ejercicio actualizado
     * @throws ResourceNotFoundException si no se encuentra el ejercicio
     */
    @Transactional
    public ClienteRutinaEjercicio actualizarEjercicio(Long ejercicioId, int reps, int sets) {
        ClienteRutinaEjercicio ejercicio = clienteRutinaEjercicioRepository.findById(ejercicioId)
                .orElseThrow(() -> new ResourceNotFoundException("Ejercicio no encontrado con ID: " + ejercicioId));
        
        ejercicio.setReps(reps);
        ejercicio.setSets(sets);
        return clienteRutinaEjercicioRepository.save(ejercicio);
    }
}