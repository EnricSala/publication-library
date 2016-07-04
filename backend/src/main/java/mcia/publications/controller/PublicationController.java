package mcia.publications.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import javax.validation.Valid;
import javax.validation.constraints.Min;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import mcia.publications.controller.dto.PageableResult;
import mcia.publications.domain.Publication;
import mcia.publications.domain.Publisher;
import mcia.publications.repository.PublicationRepository;
import mcia.publications.repository.PublisherRepository;

@RestController
@RequestMapping("/api/publications")
@Slf4j
public class PublicationController {

	private static final int PAGE_SIZE = 10;
	private static final String AFTER = "1990";
	private static final String BEFORE = "3000";
	private static final SimpleDateFormat yearFmt = new SimpleDateFormat("yyyy", Locale.ENGLISH);

	private static final Order SCORE_ORDER = new Order(Direction.DESC, "score");
	private static final Order DATE_ORDER = new Order(Direction.DESC, "publishDate");
	private static final Sort SORT = new Sort(SCORE_ORDER, DATE_ORDER);

	@Autowired
	PublicationRepository publicationRepository;

	@Autowired
	PublisherRepository publisherRepository;

	@RequestMapping(value = "", method = RequestMethod.GET)
	public PageableResult<Publication> query(
			@RequestParam(name = "q", defaultValue = "") String query,
			@RequestParam(name = "author", defaultValue = "") String author,
			@RequestParam(name = "type", defaultValue = "all") String type,
			@RequestParam(name = "after", defaultValue = AFTER) Integer after,
			@RequestParam(name = "before", defaultValue = BEFORE) Integer before,
			@RequestParam(name = "page", defaultValue = "0") @Min(0) Integer page) throws ParseException {
		log.info("GET: publications page={}, q={}, author={}, type={}, after={}, before={}",
				page, query, author, type, after, before);

		// Fetch publishers matching type
		List<String> publisherIds;
		if (!type.equalsIgnoreCase("all")) {
			List<Publisher> publishers = publisherRepository.findByType(type);
			publisherIds = publishers.stream().map(Publisher::getId).collect(Collectors.toList());
			log.debug("Found {} publishers matching type={}", publisherIds.size(), type);
		} else {
			publisherIds = Collections.emptyList();
		}

		// Replace author with null when empty
		String authorId = author.isEmpty() ? null : author;

		// Transform year to dates
		Date afterDate = yearFmt.parse(Integer.toString(after));
		Date beforeDate = yearFmt.parse(Integer.toString(before + 1));

		// Run search
		Pageable pageable = new PageRequest(page, PAGE_SIZE, SORT);
		Page<Publication> result;
		if (query.isEmpty()) {
			result = publicationRepository.search(authorId, publisherIds, afterDate, beforeDate, pageable);
		} else {
			result = publicationRepository.search(query, authorId, publisherIds, afterDate, beforeDate, pageable);
		}
		log.info("Matched {} elements in {} pages", result.getTotalElements(), result.getTotalPages());
		return PageableResult.from(result);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public Publication getById(@PathVariable String id) {
		log.info("GET: publication by id={}", id);
		return publicationRepository.findOne(id);
	}

	@RequestMapping(value = "", method = RequestMethod.POST)
	public Publication post(@RequestBody @Valid Publication publication) {
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
	public Publication put(@RequestBody @Valid Publication publication) {
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
