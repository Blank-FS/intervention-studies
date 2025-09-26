package edu.umich.baac.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class EnvCheck {

    @Value("${MAIL_USERNAME:#{null}}")
    private String mailUser;

    @Value("${MAIL_PASSWORD:#{null}}")
    private String mailPass;

    @PostConstruct
    public void check() {
        System.out.println("==== Mail Environment Variables ====");
        System.out.println("MAIL_USERNAME = " + (mailUser != null ? mailUser : "NOT SET"));
        System.out.println("MAIL_PASSWORD = " + (mailPass != null ? "[PROVIDED]" : "NOT SET"));
        System.out.println("====================================");
    }
}
