package edu.umich.baac.service;

import edu.umich.baac.model.User;
import edu.umich.baac.model.UserFluStudy;
import edu.umich.baac.model.module.Option;
import edu.umich.baac.model.module.Question;
import edu.umich.baac.model.module.Response;
import edu.umich.baac.repository.UserFluStudyRepository;
import edu.umich.baac.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserFluStudyService {
    private final UserFluStudyRepository userFluStudyRepo;
    private final UserRepository userRepo;

    public boolean saveResponse(String email, String csvData){
        // 1. Get user
        User currentUser = userRepo.findByEmail(email).orElse(null);
        if(currentUser==null){
            return false;
        }

        // 2. Save response
        UserFluStudy response = userFluStudyRepo.findByUser(currentUser).orElse(null);
        if(response==null){
            UserFluStudy newResponse = UserFluStudy.builder().user(currentUser).csvData(csvData).completed(true).build();
            userFluStudyRepo.save(newResponse);
            return true;
        }
        if(response.getCompleted()==true)
            return false;
        response.setCompleted(true);
        response.setCsvData(csvData);
        userFluStudyRepo.save(response);
        return true;
    }

    public UserFluStudy getResponse(String email){
        // 1. Get user
        User currentUser = userRepo.findByEmail(email).orElse(null);
        if(currentUser==null){
            return null;
        }

        // 2. Get response
        UserFluStudy response = userFluStudyRepo.findByUser(currentUser).orElse(null);
        if(response==null){
            UserFluStudy newResponse = UserFluStudy.builder().user(currentUser).completed(false).build();
            response = userFluStudyRepo.save(newResponse);
        }
        return response;
    }

    public UserFluStudy getResponseById(Long id){
        // 1. Get user
        User user = userRepo.findById(id).orElse(null);
        if(user==null){
            return null;
        }

        // 2. Get response
        UserFluStudy response = userFluStudyRepo.findByUser(user).orElse(null);
        if(response==null){
            UserFluStudy newResponse = UserFluStudy.builder().user(user).completed(false).build();
            response = userFluStudyRepo.save(newResponse);
        }
        if(response.getCompleted()==false)
            return null;
        return response;
    }
}
