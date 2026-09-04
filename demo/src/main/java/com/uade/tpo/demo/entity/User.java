package com.uade.tpo.demo.entity;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Collection;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// Un usuario del sistema. Implementa UserDetails porque Spring Security lo necesita para el login
@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User implements UserDetails {

    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String email;
    @Column
    private String name;
    @Column
    private String surname;

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<Order> orders;

    @Enumerated(EnumType.STRING)
    @Column (nullable = false)
    private Role role;

    @JsonIgnore
    @Column (nullable = false)
    private String password;

    // Spring Security usa el email como nombre de usuario para el login
    @JsonIgnore
    @Override
    public String getUsername() {
        return email;
    }

    // Le dice a Spring Security que rol tiene el usuario, para los permisos
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    // Estos cuatro metodos son requeridos por Spring Security, ac no manejamos
    // cuentas vencidas, bloqueadas ni deshabilitadas, por eso siempre dan true
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @JsonIgnore
    public boolean isEnabled() {
        return true;
    }
}
