package com.aniketkadam.namaste_app.status;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StatusRepository extends JpaRepository<Status, String> {

    @Query(name = StatusConstants.FIND_STATUSES_VISIBLE_TO_USER)
    List<Status> findStatusesVisibleToUser(@Param("userId") String userId);

    @Query(name = StatusConstants.FIND_STATUSES_BY_USER)
    List<Status> findStatusesByUser(@Param("userId") String userId);

    @Query(name = StatusConstants.FIND_USER_HAS_STATUS)
    boolean  findUserHasStatus(@Param("userId") String userId);

    @Query(name = StatusConstants.FIND_EXPIRED_STATUS)
    List<Status> findExpiredStatus();
}
