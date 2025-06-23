package com.aniketkadam.namaste_app.user;

import com.aniketkadam.namaste_app.chat.Chat;
import com.aniketkadam.namaste_app.common.BaseAuditingEntity;
import com.aniketkadam.namaste_app.tfa.TFAType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(name = "users")
@NamedQuery(
        name = UserConstants.FIND_USER_BY_EMAIL,
        query = "SELECT user FROM User user WHERE user.email = :email"
)
@NamedQuery(
        name = UserConstants.FIND_ALL_USERS_EXCEPT_SELF,
        query = "SELECT user FROM User user WHERE user.id != :userId"
)
@NamedQuery(
        name = UserConstants.SEARCH_USER_BY_NAME_OR_EMAIL,
        query = """
                SELECT user
                FROM User user
                WHERE LOWER(user.firstname) LIKE LOWER(CONCAT('%', :query, '%'))
                OR LOWER(user.lastname) LIKE LOWER(CONCAT('%', :query, '%'))
                OR LOWER(user.email) LIKE LOWER(CONCAT('%', :query, '%'))
                """
)

@NamedQuery(
        name = UserConstants.FIND_USER_BY_SUB,
        query = "SELECT user FROM User user WHERE user.sub = :sub"
)
public class User extends BaseAuditingEntity implements UserDetails, Principal {

    private static final int LAST_ACTIVATE_INTERVAL = 5;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String firstname;
    private String lastname;
    @Column(name = "email", unique = true)
    private String email;
    private String password;
    @Column(columnDefinition = "TEXT")
    private String about;
    @Column(columnDefinition = "TEXT")
    private String avtar;
    private LocalDateTime lastSeen;
    private boolean isVerified;

    private String sub; //Auth provider unique user ID

    // tfa
    private boolean isTfaEnabled;
    @Enumerated(value = EnumType.STRING)
    private TFAType type;
    private String TOTPSecrete;

    @OneToMany(mappedBy = "sender")
    private List<Chat> chatsAsSender;
    @OneToMany(mappedBy = "recipient")
    private List<Chat> chatsAsRecipient;

    @Transient
    public boolean isUserOnline() {
        return lastSeen != null && lastSeen.isAfter(LocalDateTime.now().minusMinutes(LAST_ACTIVATE_INTERVAL));
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public String getName() {
        if (firstname == null && lastname != null) {
            return this.lastname;
        } else if (firstname != null && lastname == null) {
            return this.firstname;
        } else {
            return this.firstname + " " + this.lastname;
        }
    }
}
