package edu.umich.baac.model;

import lombok.Data;

public record RegisterRequest(String email, String password, String prolificId) {
}