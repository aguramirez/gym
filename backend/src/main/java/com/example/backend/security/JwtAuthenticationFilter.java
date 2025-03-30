package com.example.backend.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtConfig jwtConfig;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // Obtener el token del request
            String jwt = getJwtFromRequest(request);
            logger.info("JWT recibido: " + (jwt != null ? "Token presente" : "Token ausente"));

            if (StringUtils.hasText(jwt)) {
                // Intentar validar el token
                logger.info("Intentando validar token para la ruta: " + request.getRequestURI());
                
                // Verificar token sin UserDetails primero (solo verificación de firma y fecha)
                boolean isTokenValid = tokenProvider.validateTokenBasic(jwt);
                logger.info("Validación básica de token: " + (isTokenValid ? "Válido" : "Inválido"));
                
                if (isTokenValid) {
                    // Extraer username del token
                    String username = tokenProvider.extractUsername(jwt);
                    logger.info("Username extraído del token: " + username);

                    // Cargar detalles del usuario
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    
                    // Crear autenticación
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Establecer la autenticación en el contexto
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.info("Autenticación establecida correctamente para usuario: " + username);
                    logger.info("Roles: " + userDetails.getAuthorities());
                }
            } else {
                logger.info("No se encontró token JWT en la solicitud a: " + request.getRequestURI());
            }
        } catch (Exception ex) {
            logger.error("No se pudo establecer la autenticación del usuario en el contexto de seguridad", ex);
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(jwtConfig.getHeaderString());
        logger.info("Header recibido: " + jwtConfig.getHeaderString() + " = " + bearerToken);
        
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(jwtConfig.getTokenPrefix())) {
            String token = bearerToken.substring(jwtConfig.getTokenPrefix().length());
            logger.info("Token extraído correctamente");
            return token;
        }
        return null;
    }
}