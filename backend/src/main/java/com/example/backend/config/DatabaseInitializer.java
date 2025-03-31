package com.example.backend.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.models.entity.Cliente;
import com.example.backend.models.entity.ClienteRutina;
import com.example.backend.models.entity.ClienteRutinaDia;
import com.example.backend.models.entity.ClienteRutinaEjercicio;
import com.example.backend.models.entity.Rutina;
import com.example.backend.models.entity.RutinaDia;
import com.example.backend.models.entity.RutinaEjercicio;
import com.example.backend.repositories.ClienteRepository;
import com.example.backend.repositories.ClienteRutinaRepository;
import com.example.backend.repositories.RutinaRepository;
import com.example.backend.services.ClienteRutinaService;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private ClienteRepository clienteRepository;
    
    @Autowired
    private RutinaRepository rutinaRepository;
    
    @Autowired
    private ClienteRutinaRepository clienteRutinaRepository;
    
    @Autowired
    private ClienteRutinaService clienteRutinaService;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Lista de usuarios fantasma (protegidos) que siempre deben existir
        List<Cliente> ghostUsers = Arrays.asList(
            createGhostUser("Agustin", "41731091", "hidden", "ADMIN"),
            createGhostUser("user", "1", "hidden", "USER")
        );
        
        // Verificar y crear cada usuario fantasma si no existe
        for (Cliente ghostUser : ghostUsers) {
            // Usar findByDniContaining en lugar de findByDni para evitar error con resultados múltiples
            List<Cliente> existingUsers = clienteRepository.findByDniContaining(ghostUser.getDni());
            
            boolean exists = false;
            Cliente userToUpdate = null;
            
            // Buscar un usuario exacto con el mismo DNI
            for (Cliente existingUser : existingUsers) {
                if (existingUser.getDni().equals(ghostUser.getDni())) {
                    exists = true;
                    userToUpdate = existingUser;
                    break;
                }
            }
            
            Cliente savedUser = null;
            if (!exists) {
                // Si no existe, crearlo
                savedUser = clienteRepository.save(ghostUser);
                System.out.println("Usuario protegido creado: " + savedUser.getNombre() + " (" + savedUser.getDni() + ")");
            } else if (userToUpdate != null) {
                // Si necesitamos actualizar el rol (solo para el admin)
                if ("ADMIN".equals(ghostUser.getRol()) && !"ADMIN".equals(userToUpdate.getRol())) {
                    userToUpdate.setRol("ADMIN");
                    savedUser = clienteRepository.save(userToUpdate);
                    System.out.println("Usuario protegido actualizado a ADMIN: " + savedUser.getNombre() + " (" + savedUser.getDni() + ")");
                } else {
                    savedUser = userToUpdate;
                }
            }
            
            // Si es el usuario demo, verificar si tiene rutina asignada
            if (savedUser != null && "1".equals(savedUser.getDni())) {
                boolean hasRutina = clienteRutinaRepository.existsByClienteId(savedUser.getId());
                if (!hasRutina) {
                    assignRutinaToUser(savedUser);
                }
            }
        }
    }
    
    /**
     * Intenta asignar una rutina al usuario demo usando el servicio
     */
    private void assignRutinaToUser(Cliente user) {
        // Obtener la primera rutina disponible (si existe alguna)
        List<Rutina> rutinas = rutinaRepository.findAll();
        if (!rutinas.isEmpty()) {
            Rutina rutina = rutinas.get(0);
            
            try {
                // Usar el servicio para asignar correctamente la rutina con todos sus componentes
                clienteRutinaService.asignarRutinaACliente(user.getId(), rutina.getId());
                System.out.println("Rutina '" + rutina.getNombre() + "' asignada al usuario demo usando el servicio");
            } catch (Exception e) {
                System.err.println("Error al asignar rutina al usuario demo: " + e.getMessage());
                // Intentar asignación manual como fallback
                assignRutinaToUserManually(user, rutina);
            }
        } else {
            System.out.println("No hay rutinas disponibles para asignar al usuario demo");
        }
    }
    
    /**
     * Método de respaldo para asignar manualmente una rutina con sus días y ejercicios
     */
    @Transactional
    private void assignRutinaToUserManually(Cliente user, Rutina rutina) {
        try {
            // Verificar si ya tiene esta rutina asignada
            boolean yaAsignada = clienteRutinaRepository.existsByClienteIdAndRutinaId(user.getId(), rutina.getId());
            if (yaAsignada) {
                return;
            }
            
            // Crear asignación de rutina
            ClienteRutina clienteRutina = new ClienteRutina();
            clienteRutina.setCliente(user);
            clienteRutina.setRutina(rutina);
            clienteRutina.setNombre(rutina.getNombre());
            
            // Guardar primero para obtener ID
            clienteRutina = clienteRutinaRepository.save(clienteRutina);
            
            // Clonar los días y ejercicios
            for (RutinaDia rutinaDia : rutina.getRutinaDias()) {
                ClienteRutinaDia clienteRutinaDia = new ClienteRutinaDia();
                clienteRutinaDia.setNombre(rutinaDia.getNombre());
                clienteRutinaDia.setClienteRutina(clienteRutina);
                
                // Guardar día para obtener ID
                clienteRutina.getClienteRutinaDias().add(clienteRutinaDia);
                
                // Clonar ejercicios del día
                for (RutinaEjercicio rutinaEjercicio : rutinaDia.getRutinaEjercicios()) {
                    ClienteRutinaEjercicio clienteRutinaEjercicio = new ClienteRutinaEjercicio();
                    clienteRutinaEjercicio.setReps(rutinaEjercicio.getReps());
                    clienteRutinaEjercicio.setSets(rutinaEjercicio.getSets());
                    clienteRutinaEjercicio.setNotas("");
                    clienteRutinaEjercicio.setEjercicio(rutinaEjercicio.getEjercicio());
                    clienteRutinaEjercicio.setRutinaEjercicio(rutinaEjercicio);
                    clienteRutinaEjercicio.setClienteRutinaDia(clienteRutinaDia);
                    
                    clienteRutinaDia.getClienteRutinaEjercicios().add(clienteRutinaEjercicio);
                }
            }
            
            // Guardar toda la estructura
            clienteRutinaRepository.save(clienteRutina);
            System.out.println("Rutina '" + rutina.getNombre() + "' asignada manualmente al usuario demo");
        } catch (Exception e) {
            System.err.println("Error en asignación manual de rutina: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private Cliente createGhostUser(String nombre, String dni, String telefono, String rol) {
        Cliente cliente = new Cliente();
        cliente.setNombre(nombre);
        cliente.setDni(dni);
        cliente.setTelefono(telefono);
        cliente.setRol(rol);
        return cliente;
    }
}