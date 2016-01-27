package mcia.publications.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import mcia.publications.domain.Publisher;
import mcia.publications.repository.PublisherRepository;
import rx.Observable;

@RestController
@RequestMapping("/api/publishers")
@Slf4j
public class PublisherController {

	@Autowired
	PublisherRepository publisherRepository;

	@RequestMapping(value = "", method = RequestMethod.GET)
	public Observable<List<Publisher>> getAll() {
		log.info("GET: all publishers");
		return Observable.from(publisherRepository.findAll()).toList();
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public Publisher getById(@PathVariable String id) {
		log.info("GET: publisher by id={}", id);
		return publisherRepository.findOne(id);
	}

	@RequestMapping(value = "", method = RequestMethod.POST)
	public Publisher post(@RequestBody Publisher publisher) {
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

	@RequestMapping(value = "", method = RequestMethod.PUT)
	public Publisher put(@RequestBody Publisher publisher) {
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

	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void deletebyId(@PathVariable String id) {
		log.info("DELETE: publisher by id={}", id);
		publisherRepository.delete(id);
	}

}
