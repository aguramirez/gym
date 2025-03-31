package com.example.backend.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.config.ProtectedUsersConfig;
import com.example.backend.exceptions.BusinessLogicException;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.models.entity.Cliente;
import com.example.backend.models.entity.ClienteRutina;
import com.example.backend.models.entity.Rutina;
import com.example.backend.models.entity.RutinaDia;
import com.example.backend.models.entity.RutinaEjercicio;
import com.example.backend.repositories.ClienteRutinaRepository;
import com.example.backend.repositories.RutinaRepository;
import com.example.backend.repositories.RutinaEjercicioRepository;
import org.hibernate.Hibernate;

@Service
public class RutinaService {
    
    @Autowired
    private RutinaRepository rutinaRepository;
    
    @Autowired
    private RutinaEjercicioRepository rutinaEjercicioRepository;
    
    @Autowired
    private ClienteRutinaRepository clienteRutinaRepository;
    
    @Autowired
    private ProtectedUsersConfig protectedUsersConfig;
    
    @Autowired
    private ClienteRutinaService clienteRutinaService;

    @Transactional(readOnly = true)
    public List<Rutina> findAll() {
        return rutinaRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Rutina findById(Long id) {
        // Primero, obtenemos la rutina con sus días (sin ejercicios)
        Rutina rutina = rutinaRepository.findByIdWithDias(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rutina no encontrada con ID: " + id));
        
        // Ahora, para cada día, cargamos sus ejercicios por separado utilizando
        // una consulta separada para evitar el MultipleBagFetchException
        for (RutinaDia dia : rutina.getRutinaDias()) {
            // Cargamos explícitamente los ejercicios del día
            // Esto se puede hacer de diferentes formas:
            
            // Opción 1: Usar un query method en el repositorio RutinaEjercicioRepository
            if (!Hibernate.isInitialized(dia.getRutinaEjercicios())) {
                List<RutinaEjercicio> ejercicios = rutinaEjercicioRepository.findByRutinaDiaId(dia.getId());
                // Inicializar la colección si es necesario
                if (dia.getRutinaEjercicios() == null) {
                    dia.setRutinaEjercicios(new ArrayList<>());
                }
                dia.getRutinaEjercicios().clear();
                dia.getRutinaEjercicios().addAll(ejercicios);
            }
        }
        
        return rutina;
    }

    @Transactional
    public Rutina save(Rutina rutina) {
        // Asegurar la consistencia de las relaciones bidireccionales
        if (rutina.getRutinaDias() != null) {
            rutina.getRutinaDias().forEach(dia -> {
                dia.setRutina(rutina);
                if (dia.getRutinaEjercicios() != null) {
                    dia.getRutinaEjercicios().forEach(ejercicio -> ejercicio.setRutinaDia(dia));
                }
            });
        }
        return rutinaRepository.save(rutina);
    }

    @Transactional
    public void deleteById(Long id) {
        // Verificar que existe
        if (!rutinaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Rutina no encontrada con ID: " + id);
        }
        
        // Obtener todas las asignaciones de esta rutina a clientes
        List<ClienteRutina> clienteRutinas = clienteRutinaRepository.findByRutinaId(id);
        
        if (!clienteRutinas.isEmpty()) {
            // Verificar si la rutina está asignada SOLO al usuario fantasma o a otros usuarios también
            boolean assignedToRealUsers = false;
            List<ClienteRutina> ghostAssignments = new ArrayList<>();
            
            for (ClienteRutina cr : clienteRutinas) {
                Cliente cliente = cr.getCliente();
                // Verificar si es el usuario fantasma (dni = "1")
                if (cliente != null && "1".equals(cliente.getDni())) {
                    ghostAssignments.add(cr);
                } else {
                    assignedToRealUsers = true;
                    break;
                }
            }
            
            if (assignedToRealUsers) {
                // Si está asignada a usuarios reales, no permitir eliminar
                throw new DataIntegrityViolationException(
                    "No se puede eliminar la rutina porque está asignada a uno o más clientes"
                );
            } else {
                // Si solo está asignada al usuario fantasma, eliminar esas asignaciones primero
                for (ClienteRutina ghostCR : ghostAssignments) {
                    try {
                        clienteRutinaService.eliminarRelacion(ghostCR.getCliente().getId(), id);
                    } catch (Exception e) {
                        System.err.println("Error al eliminar asignación fantasma: " + e.getMessage());
                    }
                }
            }
        }
        
        // Ahora podemos eliminar la rutina
        rutinaRepository.deleteById(id);
    }

    @Transactional
    public Rutina editarRutina(Long id, Rutina rutinaActualizada) {
        Rutina rutinaExistente = findById(id);
    
        rutinaExistente.setNombre(rutinaActualizada.getNombre());
        
        // Manejar días nuevos, actualizados y eliminados
        if (rutinaActualizada.getRutinaDias() != null) {
            actualizarDiasRutina(rutinaExistente, rutinaActualizada.getRutinaDias());
        }
        
        return rutinaRepository.save(rutinaExistente);
    }
    
    private void actualizarDiasRutina(Rutina rutinaExistente, List<RutinaDia> diasActualizados) {
        // Crear una copia de la lista original para poder modificarla mientras iteramos
        List<RutinaDia> diasOriginales = new ArrayList<>(rutinaExistente.getRutinaDias());
        
        // Eliminar días que ya no están en la lista actualizada
        diasOriginales.forEach(diaOriginal -> {
            boolean encontrado = false;
            for (RutinaDia diaActualizado : diasActualizados) {
                if (diaActualizado.getId() != null && diaActualizado.getId().equals(diaOriginal.getId())) {
                    encontrado = true;
                    break;
                }
            }
            if (!encontrado) {
                rutinaExistente.getRutinaDias().remove(diaOriginal);
            }
        });
        
        // Actualizar días existentes o agregar nuevos
        diasActualizados.forEach(diaActualizado -> {
            if (diaActualizado.getId() == null) {
                // Es un día nuevo
                diaActualizado.setRutina(rutinaExistente);
                rutinaExistente.getRutinaDias().add(diaActualizado);
                
                // Configurar la relación con los ejercicios
                if (diaActualizado.getRutinaEjercicios() != null) {
                    diaActualizado.getRutinaEjercicios().forEach(ejercicio -> ejercicio.setRutinaDia(diaActualizado));
                }
            } else {
                // Es un día existente que se debe actualizar
                Optional<RutinaDia> diaExistenteOpt = rutinaExistente.getRutinaDias().stream()
                        .filter(d -> d.getId().equals(diaActualizado.getId()))
                        .findFirst();
                
                if (diaExistenteOpt.isPresent()) {
                    RutinaDia diaExistente = diaExistenteOpt.get();
                    diaExistente.setNombre(diaActualizado.getNombre());
                    
                    // Actualizar ejercicios
                    actualizarEjerciciosDia(diaExistente, diaActualizado.getRutinaEjercicios());
                }
            }
        });
    }
    
    private void actualizarEjerciciosDia(RutinaDia diaExistente, List<RutinaEjercicio> ejerciciosActualizados) {
        if (ejerciciosActualizados == null) {
            return;
        }
        
        // Crear una copia de la lista original para poder modificarla mientras iteramos
        List<RutinaEjercicio> ejerciciosOriginales = new ArrayList<>(diaExistente.getRutinaEjercicios());
        
        // Eliminar ejercicios que ya no están en la lista actualizada
        ejerciciosOriginales.forEach(ejercicioOriginal -> {
            boolean encontrado = false;
            for (RutinaEjercicio ejercicioActualizado : ejerciciosActualizados) {
                if (ejercicioActualizado.getId() != null && ejercicioActualizado.getId().equals(ejercicioOriginal.getId())) {
                    encontrado = true;
                    break;
                }
            }
            if (!encontrado) {
                diaExistente.getRutinaEjercicios().remove(ejercicioOriginal);
            }
        });
        
        // Actualizar ejercicios existentes o agregar nuevos
        ejerciciosActualizados.forEach(ejercicioActualizado -> {
            if (ejercicioActualizado.getId() == null) {
                // Es un ejercicio nuevo
                ejercicioActualizado.setRutinaDia(diaExistente);
                diaExistente.getRutinaEjercicios().add(ejercicioActualizado);
            } else {
                // Es un ejercicio existente que se debe actualizar
                diaExistente.getRutinaEjercicios().stream()
                        .filter(e -> e.getId().equals(ejercicioActualizado.getId()))
                        .findFirst()
                        .ifPresent(ejercicioExistente -> {
                            ejercicioExistente.setReps(ejercicioActualizado.getReps());
                            ejercicioExistente.setSets(ejercicioActualizado.getSets());
                            ejercicioExistente.setEjercicio(ejercicioActualizado.getEjercicio());
                        });
            }
        });
    }
}