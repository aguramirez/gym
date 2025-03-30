package com.example.backend.security;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "jwt")
@Data
public class JwtConfig {
    private String secret = "ClaveSecretaParaGeneracionDeTokensJWTEnAplicacionDeCoachFitnessLongitudMinima256bits";
    private long expiration = 86400000; // 1 día en milisegundos
    private String tokenPrefix = "Bearer ";
    private String headerString = "Authorization";
}