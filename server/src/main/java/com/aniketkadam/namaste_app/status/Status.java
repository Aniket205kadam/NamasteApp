package com.aniketkadam.namaste_app.status;

import com.aniketkadam.namaste_app.common.BaseAuditingEntity;
import com.aniketkadam.namaste_app.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(name = "status")
//findStatusesVisibleToUser
@NamedQuery(
        name = StatusConstants.FIND_STATUSES_VISIBLE_TO_USER,
        query = "SELECT status FROM Status status WHERE :userId MEMBER OF status.visibilityList"
)
@NamedQuery(
        name = StatusConstants.FIND_STATUSES_BY_USER,
        query = "SELECT status FROM Status status WHERE status.user.id = :userId"
)
@NamedQuery(
        name = StatusConstants.FIND_USER_HAS_STATUS,
        query = "SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM Status s " +
                "WHERE s.user.id = :userId AND s.expiresAt > CURRENT_TIMESTAMP"
)
@NamedQuery(
        name = StatusConstants.FIND_EXPIRED_STATUS,
        query = "SELECT status FROM Status status WHERE status.expiresAt < CURRENT_TIMESTAMP"
)
public class Status extends BaseAuditingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @ManyToOne(fetch = FetchType.EAGER)
    private User user;
    @Column(columnDefinition = "TEXT")
    private String mediaUrl;
    @Enumerated(EnumType.STRING)
    private StatusType type;
    @Column(name = "caption", length = 100)
    private String caption;
    @Column(name = "text", length = 200)
    private String text;
    private String bgColor;
    private String textStyle;
    private LocalDateTime expiresAt;
    @ElementCollection
    @CollectionTable(
            name = "status_visibility",
            joinColumns = @JoinColumn(name = "status_id")
    )
    @Column(name = "visible_user_id")
    private List<String> visibilityList;
    @ElementCollection
    @CollectionTable(
            name = "viewer_ids",
            joinColumns = @JoinColumn(name = "status_id")
    )
    private Set<String> viewerIds;
}