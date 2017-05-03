package mcia.publications.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mcia.publications.controller.dto.PageableResult;
import mcia.publications.domain.Publication;
import mcia.publications.domain.Publisher;
import mcia.publications.repository.PublicationRepository;
import mcia.publications.repository.PublisherRepository;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.domain.*;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/publications")
@RequiredArgsConstructor
@Slf4j
public class PublicationController {

	private static final SimpleDateFormat yearFmt =
			new SimpleDateFormat("yyyy", Locale.ENGLISH);

	private static final Sort SORT = new Sort(
			new Order(Direction.DESC, "score"),
			new Order(Direction.DESC, "publishDate"));

	private final PublicationRepository publicationRepository;
	private final PublisherRepository publisherRepository;

	@GetMapping
	public PageableResult<Publication> query(
			@RequestParam(name = "q", defaultValue = "") String query,
			@RequestParam(name = "author", defaultValue = "") String author,
			@RequestParam(name = "type", defaultValue = "all") String type,
			@RequestParam(name = "after", defaultValue = "1990") Integer after,
			@RequestParam(name = "before", defaultValue = "3000") Integer before,
			@RequestParam(name = "page", defaultValue = "0") @Min(0) Integer page,
			@RequestParam(name = "size", defaultValue = "10") @Min(10) Integer size) throws ParseException {

		log.info("GET: publications q={}, author={}, type={}, after={}, before={}, page={}, size={}",
				query, author, type, after, before, page, size);

		// Fetch publishers matching type
		List<String> publisherIds;
		if (!type.equalsIgnoreCase("all")) {
			publisherIds = publisherRepository.findByType(type)
					.stream().map(Publisher::getId).collect(Collectors.toList());
			log.debug("Found {} publishers matching type={}", publisherIds.size(), type);
			if (publisherIds.isEmpty()) {
				log.info("Matched 0 elements because no publishers are type={}", type);
				return PageableResult.empty();
			}
		} else {
			publisherIds = Collections.emptyList();
		}

		// Replace author with null when empty
		String authorId = author.isEmpty() ? null : author;

		// Transform year to dates
		Date afterDate = yearFmt.parse(Integer.toString(after));
		Date beforeDate = yearFmt.parse(Integer.toString(before + 1));

		// Run search
		Pageable pageable = new PageRequest(page, size, SORT);
		Page<Publication> result = query.isEmpty() ?
				publicationRepository.search(authorId, publisherIds, afterDate, beforeDate, pageable) :
				publicationRepository.search(query, authorId, publisherIds, afterDate, beforeDate, pageable);
		log.info("Matched {} elements in {} pages", result.getTotalElements(), result.getTotalPages());
		return PageableResult.from(result);
	}

	@GetMapping("/{id}")
	public Publication getById(@PathVariable String id) {
		log.info("GET: publication by id={}", id);
		return publicationRepository.findOne(id);
	}

	@PostMapping
	public Publication post(@RequestBody @Valid Publication publication) {
		log.info("POST: {}", publication);
		if (publication.getId() != null) {
			throw new RuntimeException("insert of new publication must not provide an id");
		} else {
			Publication saved = publicationRepository.save(publication);
			log.info("Created publication id={}, title={}", saved.getId(), saved.getTitle());
			return saved;
		}
	}

	@PutMapping
	public Publication put(@RequestBody @Valid Publication publication) {
		log.info("PUT: {}", publication);
		if (publication.getId() != null) {
			if (publicationRepository.exists(publication.getId())) {
				Publication saved = publicationRepository.save(publication);
				log.info("Updated publication id={}, title={}", saved.getId(), saved.getTitle());
				return saved;
			} else {
				throw new RuntimeException("cannot update publication with unknown id=" + publication.getId());
			}
		} else {
			throw new RuntimeException("cannot update publication with undefined id");
		}
	}

	@DeleteMapping("/{id}")
	public void deleteById(@PathVariable String id) {
		log.info("DELETE: publication by id={}", id);
		publicationRepository.delete(id);
	}

}
