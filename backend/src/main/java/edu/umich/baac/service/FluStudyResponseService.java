package edu.umich.baac.service;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import edu.umich.baac.dto.FluStudyResponseDTO;
import edu.umich.baac.model.User;
import edu.umich.baac.model.FluStudyResponse;
import edu.umich.baac.repository.FluStudyResponseRepository;
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
public class FluStudyResponseService {
    private final FluStudyResponseRepository fluStudyResponseRepo;
    private final UserRepository userRepo;

    @Transactional
    public boolean saveResponse(String csvData, String prolificId, String studyId, String sessionId) {
        // Must contain all three ids to be considered valid response
        if(prolificId == null || prolificId.isEmpty() || studyId == null || studyId.isEmpty() || sessionId == null || sessionId.isEmpty())
            return false;

        // If response with id tuple combination already exists
        if(fluStudyResponseRepo.existsByProlificIdAndStudyIdAndSessionId(prolificId, studyId, sessionId))
            return false;

        // Save response
        Map<String,String> responseMap;
        try {
            responseMap = getHeaderValueMap(csvData);
        } catch (IOException | CsvValidationException e) {
            throw new RuntimeException(e);
        }
        final Integer age = Integer.valueOf(responseMap.get("demo_age"));
        final boolean valid =  responseMap.get("recent_flu_shot").equalsIgnoreCase("No");
        final Integer baselineVaxIntent = valid ? Integer.parseInt(responseMap.get("baseline_vax_intent_0_100")) : -1;
        final Integer postVaxIntent = valid ? Integer.parseInt(responseMap.get("post_vax_intent_0_100")) : -1;

        FluStudyResponse newResponse = FluStudyResponse.builder()
                .prolificId(prolificId)
                .studyId(studyId)
                .sessionId(sessionId)
                .completed(true)
                .csvData(csvData)
                .age(age)
                .valid(valid)
                .baselineVaxIntent(baselineVaxIntent)
                .postVaxIntent(postVaxIntent)
                .build();
        fluStudyResponseRepo.save(newResponse);
        return true;
    }

    public FluStudyResponse getResponse(String email){
        return null;
    }

    public FluStudyResponse getResponseById(Long id){
        return fluStudyResponseRepo.findById(id).orElse(null);
    }

    @Transactional
    public boolean deleteResponseById(Long id){
        if (!fluStudyResponseRepo.existsById(id)) {
            return false;
        }
        fluStudyResponseRepo.deleteById(id);
        return true;
    }

    public List<FluStudyResponseDTO> getAllResponses(){
        List<FluStudyResponse> list = fluStudyResponseRepo.findAll();
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
