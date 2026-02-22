package com.vaultkeep.vaultkeep_backend.model;


import jakarta.persistence.*;

@Entity
@Table(name = "secrets")
public class Secret {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String encryptedContent;

    // Constructors
    public Secret() {}

    public Secret(Long userId, String title, String encryptedContent) {
        this.userId = userId;
        this.title = title;
        this.encryptedContent = encryptedContent;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getEncryptedContent() { return encryptedContent; }
    public void setEncryptedContent(String encryptedContent) { this.encryptedContent = encryptedContent; }
}