package com.jarviswuod.book;

import com.jarviswuod.book.role.Role;
import com.jarviswuod.book.role.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
@EnableAsync
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public CommandLineRunner runner(RoleRepository roleRepo) {
        return args -> {
            if (roleRepo.findByName("USER").isEmpty()) {
                roleRepo.save(
                        Role.builder().name("USER").build()
                );
            }
        };
    }
}
