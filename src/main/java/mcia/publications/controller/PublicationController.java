package mcia.publications.controller;

import java.util.List;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import mcia.publications.domain.Publication;
import mcia.publications.repository.PublicationRepository;
import rx.Observable;

@RestController
@RequestMapping("/api/publications")
@Slf4j
public class PublicationController {

	@Autowired
	PublicationRepository publicationRepository;

	@RequestMapping(value = "", method = RequestMethod.GET)
	public Observable<List<Publication>> query(
			@RequestParam(name = "q", defaultValue = "") String query,
			@RequestParam(name = "author", defaultValue = "") String authorId,
			@RequestParam(name = "type", defaultValue = "") String type) {
		log.info("GET: publications q={}, author={}, type={}", query, authorId, type);
		if (query.isEmpty()) {
			return Observable.from(publicationRepository.findAll()).toList();
		} else {
			Stream<Publication> stream = publicationRepository.search(query);
			return Observable.from(stream::iterator).toList();
		}
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public Publication getById(@PathVariable String id) {
		log.info("GET: publication by id={}", id);
		return publicationRepository.findOne(id);
	}

	@RequestMapping(value = "", method = RequestMethod.POST)
	public Publication post(@RequestBody Publication publication) {
		log.info("POST: {}", publication);
		Publication saved = null;
		if (publication.getId() != null) {
			throw new RuntimeException("insert of new publication must not provide an id");
		} else {
			saved = publicationRepository.save(publication);
			log.info("Created publication id={}, title={}", saved.getId(), saved.getTitle());
		}
		return saved;
	}

	@RequestMapping(value = "", method = RequestMethod.PUT)
	public Publication put(@RequestBody Publication publication) {
		log.info("PUT: {}", publication);
		Publication saved = null;
		if (publication.getId() != null) {
			if (publicationRepository.exists(publication.getId())) {
				saved = publicationRepository.save(publication);
				log.info("Updated publication id={}, title={}", saved.getId(), saved.getTitle());
			} else {
				throw new RuntimeException("cannot update publication with unknown id=" + publication.getId());
			}
		} else {
			throw new RuntimeException("cannot update publication with undefined id");
		}
		return saved;
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void deletebyId(@PathVariable String id) {
		log.info("DELETE: publication by id={}", id);
		publicationRepository.delete(id);
	}

}
