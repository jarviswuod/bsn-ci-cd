package com.jarviswuod.book.feedback;

import com.jarviswuod.book.book.Book;
import com.jarviswuod.book.book.BookRepository;
import com.jarviswuod.book.common.PageResponse;
import com.jarviswuod.book.exceptions.OperationNotPermittedException;
import com.jarviswuod.book.user.User;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final BookRepository bookRepo;
    private final FeedbackRepository feedbackRepo;
    private final FeedbackMapper feedbackMapper;

    public Long save(@Valid FeedbackRequest request, Authentication connectedUser) {
        Book book = bookRepo.findById(request.bookId())
                .orElseThrow(() -> new EntityNotFoundException("No book found with the ID: " + request.bookId()));
        if (book.isArchived() || !book.isShareable()) {
            throw new OperationNotPermittedException("You cannot give a feedback for an archived or not shareable book");
        }
        User user = (User) connectedUser.getPrincipal();
        if (Objects.equals(book.getOwner().getId(), user.getId())) {
            throw new OperationNotPermittedException("You cannot give a feedback to your own book");
        }

        Feedback feedback = feedbackMapper.toFeedback(request);
        return feedbackRepo.save(feedback).getId();
    }

    public PageResponse<FeedbackResponse> findAllFeedbacksByBook(Long bookId, int page, int size, Authentication connectedUser) {
        page = page < 0 ? 0 : page;
        size = size < 1 ? 10 : size;

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        User user = (User) connectedUser.getPrincipal();
        Page<Feedback> feedbacks = feedbackRepo.findAllByBookId(bookId, pageable);
        List<FeedbackResponse> feedbackResponses = feedbacks.stream()
                .map(f -> feedbackMapper.toFeedbackResponse(f, user.getId()))
                .toList();
        return new PageResponse<>(
                feedbackResponses,
                feedbacks.getNumber(),
                feedbacks.getSize(),
                feedbacks.getTotalElements(),
                feedbacks.getTotalPages(),
                feedbacks.isFirst(),
                feedbacks.isLast()
        );
    }
}
