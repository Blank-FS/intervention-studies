package edu.umich.baac.dto.auth;

public record VerifyRequestDTO(String email, String code) {
}
