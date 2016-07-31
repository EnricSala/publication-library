package mcia.publications.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mcia.publications.domain.Author;
import mcia.publications.repository.AuthorRepository;
import org.springframework.web.bind.annotation.*;
import rx.Observable;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/authors")
@RequiredArgsConstructor
@Slf4j
public class AuthorController {

	private final AuthorRepository authorRepository;

	@GetMapping
	public Observable<List<Author>> getAll() {
		log.info("GET: all authors");
		return Observable.from(authorRepository.findAll()).toList();
	}

	@GetMapping("/{id}")
	public Author getById(@PathVariable String id) {
		log.info("GET: author by id={}", id);
		return authorRepository.findOne(id);
	}

	@PostMapping
	public Author post(@RequestBody @Valid Author author) {
		log.info("POST: {}", author);
		Author saved = null;
		if (author.getId() != null) {
			throw new RuntimeException("insert of new author must not provide an id");
		} else {
			saved = authorRepository.save(author);
			log.info("Created author id={}, fullname={}", saved.getId(), saved.getFullname());
		}
		return saved;
	}

	@PutMapping
	public Author put(@RequestBody @Valid Author author) {
		log.info("PUT: {}", author);
		Author saved = null;
		if (author.getId() != null) {
			if (authorRepository.exists(author.getId())) {
				saved = authorRepository.save(author);
				log.info("Updated publication id={}, fullname={}", saved.getId(), saved.getFullname());
			} else {
				throw new RuntimeException("cannot update author with unknown id=" + author.getId());
			}
		} else {
			throw new RuntimeException("cannot update author with undefined id");
		}
		return saved;
	}

	@DeleteMapping("/{id}")
	public void deleteById(@PathVariable String id) {
		log.info("DELETE: author by id={}", id);
		authorRepository.delete(id);
	}

}
