package com.mailforge.auth_service.dto;

public class GoogleUser {

    private final String email;
    private final String firstName;
    private final String lastName;

    public GoogleUser(String email, String firstName, String lastName) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getEmail() { return email; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
}
