package edu.umich.baac;

import edu.umich.baac.config.RsaKeyProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableConfigurationProperties(RsaKeyProperties.class)
@SpringBootApplication
@EnableScheduling
public class BaacApplication {

	public static void main(String[] args) {
		SpringApplication.run(BaacApplication.class, args);
	}

}
