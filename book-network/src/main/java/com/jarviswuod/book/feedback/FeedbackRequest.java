package com.jarviswuod.book.feedback;

import jakarta.validation.constraints.*;

public record FeedbackRequest(

        @Min(value = 0, message = "201")
        @Max(value = 5, message = "202")
        Double note,

        @NotNull(message = "203")
        @NotEmpty(message = "203")
        @NotBlank(message = "203")
        String comment,

        Long bookId
) {
}
