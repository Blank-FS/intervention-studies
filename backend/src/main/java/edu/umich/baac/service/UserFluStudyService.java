package edu.umich.baac.service;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import edu.umich.baac.dto.FluStudyResponseDTO;
import edu.umich.baac.model.User;
import edu.umich.baac.model.UserFluStudy;
import edu.umich.baac.repository.UserFluStudyRepository;
import edu.umich.baac.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.StringReader;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserFluStudyService {
    private final UserFluStudyRepository userFluStudyRepo;
    private final UserRepository userRepo;

    @Transactional
    public boolean saveResponse(String email, String csvData){
        // 1. Get user
        User currentUser = userRepo.findByEmail(email).orElse(null);
        if(currentUser==null){
            return false;
        }

        // 2. Save response
        UserFluStudy response = userFluStudyRepo.findByUser(currentUser).orElse(null);
        Map<String,String> responseMap = new HashMap<>();
        try {
            responseMap = getHeaderValueMap(csvData);
        } catch (IOException | CsvValidationException e) {
            throw new RuntimeException(e);
        }
        final Integer age = Integer.valueOf(responseMap.get("demo_age"));
        final boolean valid =  responseMap.get("recent_flu_shot").equalsIgnoreCase("No");
        final Integer baselineVaxIntent = valid ? Integer.parseInt(responseMap.get("baseline_vax_intent_0_100")) : -1;
        final Integer postVaxIntent = valid ? Integer.parseInt(responseMap.get("post_vax_intent_0_100")) : -1;

        if(response==null){
            UserFluStudy newResponse = UserFluStudy.builder().user(currentUser)
                    .completed(true)
                    .csvData(csvData)
                    .age(age)
                    .valid(valid)
                    .baselineVaxIntent(baselineVaxIntent)
                    .postVaxIntent(postVaxIntent)
                    .build();
            userFluStudyRepo.save(newResponse);
            return true;
        }
        if(response.getCompleted()==true)
            return false;
        response.setCompleted(true);
        response.setCsvData(csvData);
        response.setAge(age);
        response.setValid(valid);
        response.setBaselineVaxIntent(baselineVaxIntent);
        response.setPostVaxIntent(postVaxIntent);
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
        return userFluStudyRepo.findByUser(currentUser).orElse(null);
    }

    public UserFluStudy getResponseById(Long id){
        // 1. Get user
        User user = userRepo.findById(id).orElse(null);
        if(user==null){
            return null;
        }

        // 2. Get response
        UserFluStudy response = userFluStudyRepo.findByUser(user).orElse(null);
        if(response != null && response.getCompleted()==false)
            return null;
        return response;
    }

    @Transactional
    public boolean deleteResponseByUserId(Long id){
        // 1. Get user
        User user = userRepo.findById(id).orElse(null);
        if(user==null){
            return false;
        }

        // 2. Delete response
        if (user.getUserFluStudy() != null) {
            user.setUserFluStudy(null);  // orphanRemoval triggers DELETE
            return true;
        }
        return false;
    }

    public List<FluStudyResponseDTO> getAllResponses(){
        List<UserFluStudy> list = userFluStudyRepo.findAll();
        return list.stream().map(FluStudyResponseDTO::new).toList();
    }

    public static Map<String, String> getHeaderValueMap(String csvData) throws IOException, CsvValidationException {
        // Initialize the CSVReader with the CSV string
        CSVReader csvReader = new CSVReader(new StringReader(csvData));

        // Read the first row (headers)
        String[] headers = csvReader.readNext();

        // If headers are null or empty, return an empty map
        if (headers == null || headers.length == 0) {
            return new HashMap<>();
        }

        // Read the second row (first data row)
        String[] firstRow = csvReader.readNext();

        // If there's no data row, return an empty map
        if (firstRow == null || firstRow.length == 0) {
            return new HashMap<>();
        }

        // Prepare the map to store header-value pairs
        Map<String, String> headerValueMap = new HashMap<>();

        // Loop through headers and populate the map with the corresponding first row entries
        for (int i = 0; i < headers.length; i++) {
            if (i < firstRow.length) {  // To avoid index out of bounds in case the row is shorter
                headerValueMap.put(headers[i], firstRow[i]);
            } else {
                headerValueMap.put(headers[i], null); // If there's no value for this column in the first row
            }
        }

        return headerValueMap;
    }
}
