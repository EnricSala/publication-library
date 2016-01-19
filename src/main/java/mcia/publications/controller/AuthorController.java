package mcia.publications.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import mcia.publications.domain.Author;
import mcia.publications.repository.AuthorRepository;
import rx.Observable;

@RestController
@RequestMapping("/api/authors")
@Slf4j
public class AuthorController {

	@Autowired
	AuthorRepository authorRepository;

	@RequestMapping(value = "", method = RequestMethod.GET)
	public Observable<List<Author>> getAll() {
		log.info("GET: all authors");
		return Observable.from(authorRepository.findAll()).toList();
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public Author getById(@PathVariable String id) {
		log.info("GET: author by id={}", id);
		return authorRepository.findOne(id);
	}

	@RequestMapping(value = "", method = RequestMethod.POST)
	public Author post(@RequestBody Author author) {
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

	@RequestMapping(value = "", method = RequestMethod.PUT)
	public Author put(@RequestBody Author author) {
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

}
