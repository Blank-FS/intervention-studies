package edu.umich.baac.repository;

import edu.umich.baac.model.User;
import edu.umich.baac.model.UserFluStudy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserFluStudyRepository extends JpaRepository<UserFluStudy, Long> {
    Optional<UserFluStudy> findByUser(User user);
}
