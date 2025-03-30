package com.example.backend.security;

import java.util.Collection;
import java.util.Collections;
import java.util.logging.Logger;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.backend.models.entity.Cliente;

public class CustomUserDetails implements UserDetails {

    private static final long serialVersionUID = 1L;
    private String username;
    private String password = ""; // Solo para validación
    private Collection<? extends GrantedAuthority> authorities;
    
    private static final Logger logger = Logger.getLogger(CustomUserDetails.class.getName());

    public CustomUserDetails() {}

    public CustomUserDetails(Cliente cliente) {
        this.username = cliente.getDni();
        
        // Normalizar el rol
        String rol = cliente.getRol() != null ? cliente.getRol().toUpperCase() : "USER";
        logger.info("Role from database: " + rol);
        
        // Asegurarse de que el rol tenga el prefijo ROLE_
        if (!rol.startsWith("ROLE_")) {
            rol = "ROLE_" + rol;
        }
        
        logger.info("Normalized role: " + rol);
        this.authorities = Collections.singletonList(new SimpleGrantedAuthority(rol));
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}