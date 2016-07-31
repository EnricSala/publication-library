package mcia.publications.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mcia.publications.domain.Publisher;
import mcia.publications.repository.PublisherRepository;
import org.springframework.web.bind.annotation.*;
import rx.Observable;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/publishers")
@AllArgsConstructor
@Slf4j
public class PublisherController {

	private final PublisherRepository publisherRepository;

	@GetMapping
	public Observable<List<Publisher>> getAll() {
		log.info("GET: all publishers");
		return Observable.from(publisherRepository.findAll()).toList();
	}

	@GetMapping("/{id}")
	public Publisher getById(@PathVariable String id) {
		log.info("GET: publisher by id={}", id);
		return publisherRepository.findOne(id);
	}

	@PostMapping
	public Publisher post(@RequestBody @Valid Publisher publisher) {
		log.info("POST: {}", publisher);
		Publisher saved = null;
		if (publisher.getId() != null) {
			throw new RuntimeException("insert of new publisher must not provide an id");
		} else {
			saved = publisherRepository.save(publisher);
			log.info("Created publisher id={}, acronym={}", saved.getId(), saved.getAcronym());
		}
		return saved;
	}

	@PutMapping
	public Publisher put(@RequestBody @Valid Publisher publisher) {
		Publisher saved = null;
		log.info("PUT: {}", publisher);
		if (publisher.getId() != null) {
			if (publisherRepository.exists(publisher.getId())) {
				saved = publisherRepository.save(publisher);
				log.info("Updated publisher id={}, acronym={}", saved.getId(), saved.getAcronym());
			} else {
				throw new RuntimeException("cannot update publisher with unknown id=" + publisher.getId());
			}
		} else {
			throw new RuntimeException("cannot update publisher with undefined id");
		}
		return saved;
	}

	@DeleteMapping("/{id}")
	public void deleteById(@PathVariable String id) {
		log.info("DELETE: publisher by id={}", id);
		publisherRepository.delete(id);
	}

}
