package com.example.backend.security;

import java.util.List;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.backend.models.entity.Cliente;
import com.example.backend.repositories.ClienteRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    
    private static final Logger logger = Logger.getLogger(UserDetailsServiceImpl.class.getName());

    @Autowired
    private ClienteRepository clienteRepository;

    @Override
    public UserDetails loadUserByUsername(String dni) throws UsernameNotFoundException {
        // En lugar de usar findByDni que espera un resultado único, usamos findByDniContaining
        // y manejamos el caso de múltiples resultados
        List<Cliente> clientes = clienteRepository.findByDniContaining(dni);
        
        if (clientes.isEmpty()) {
            throw new UsernameNotFoundException("Usuario no encontrado con DNI: " + dni);
        }
        
        // Si hay múltiples clientes con el mismo DNI, usamos el primero
        // Pero registramos una advertencia para que sea corregido en la base de datos
        if (clientes.size() > 1) {
            logger.warning("Se encontraron múltiples usuarios (" + clientes.size() + ") con el mismo DNI: " + dni + 
                         ". Se utilizará el primero. Se recomienda corregir la base de datos.");
        }
        
        // Usar el primer cliente encontrado
        Cliente cliente = clientes.get(0);
        
        return new CustomUserDetails(cliente);
    }
}