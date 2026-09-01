package com.jarviswuod.book.exceptions;

import lombok.*;

import java.util.Map;
import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExceptionResponse {
    private Integer businessErrorCodes;
    private String businessErrorDescription;
    private String error;
    private Set<String> validationErrors;
    private Map<String, String> errors;
}
