package com.example.backend.security;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;

@Component
public class JwtTokenProvider {
    private static final Logger logger = Logger.getLogger(JwtTokenProvider.class.getName());

    @Autowired
    private JwtConfig jwtConfig;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parser().setSigningKey(jwtConfig.getSecret()).parseClaimsJws(token).getBody();
        } catch (Exception e) {
            logger.severe("Error al extraer claims del token: " + e.getMessage());
            throw e;
        }
    }

    private Boolean isTokenExpired(String token) {
        try {
            return extractExpiration(token).before(new Date());
        } catch (Exception e) {
            logger.severe("Error al verificar expiración del token: " + e.getMessage());
            return true;
        }
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername());
    }

    public String generateToken(String username, String rol) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("rol", rol);
        return createToken(claims, username);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtConfig.getExpiration()))
                .signWith(SignatureAlgorithm.HS256, jwtConfig.getSecret())
                .compact();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
    
    // Nuevo método para validación básica (sin verificar UserDetails)
    public Boolean validateTokenBasic(String token) {
        try {
            // Verifica la firma y parsea el token
            Jwts.parser().setSigningKey(jwtConfig.getSecret()).parseClaimsJws(token);
            
            // Verifica la expiración
            boolean expired = isTokenExpired(token);
            if (expired) {
                logger.info("Token expirado");
                return false;
            }
            
            return true;
        } catch (SignatureException e) {
            logger.severe("Firma JWT inválida: " + e.getMessage());
        } catch (MalformedJwtException e) {
            logger.severe("Token JWT inválido: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.severe("Token JWT expirado: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.severe("Token JWT no soportado: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.severe("JWT claims string vacío: " + e.getMessage());
        } catch (Exception e) {
            logger.severe("Error desconocido validando token: " + e.getMessage());
        }
        return false;
    }
}