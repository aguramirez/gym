package com.example.backend.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.example.backend.dto.ClienteDTO;
import com.example.backend.models.entity.Cliente;

@Mapper
public interface ClienteMapper {
    // Entidad a DTO
    ClienteDTO toDTO(Cliente cliente);
    
    // Lista de entidades a lista de DTOs
    List<ClienteDTO> toDTOList(List<Cliente> clientes);
    
    // DTO a entidad (para crear)
    Cliente toEntity(ClienteDTO dto);
    
    // Actualizar entidad existente con datos del DTO
    void updateEntityFromDTO(ClienteDTO dto, @MappingTarget Cliente cliente);
}