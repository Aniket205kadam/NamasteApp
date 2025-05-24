package com.aniketkadam.namaste_app.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    @Query(name = UserConstants.FIND_USER_BY_EMAIL)
    Optional<User> findByEmail(@Param("email") String userEmail);

    @Query(name = UserConstants.FIND_ALL_USERS_EXCEPT_SELF)
    List<User> findAllUsersExceptSelf(@Param("userId") String userId);

    @Query(name = UserConstants.SEARCH_USER_BY_NAME_OR_EMAIL)
    List<User> searchUsers(@Param("query") String query);

    @Query(name = UserConstants.FIND_USER_BY_SUB)
    Optional<User> findBySub(@Param("sub") String sub);
}
