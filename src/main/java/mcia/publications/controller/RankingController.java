package mcia.publications.controller;

import java.util.AbstractMap;
import java.util.List;
import java.util.Map.Entry;
import java.util.stream.IntStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import mcia.publications.controller.dto.AuthorSummary;
import mcia.publications.controller.dto.AuthorSummary.Count;
import mcia.publications.controller.dto.Indexed;
import mcia.publications.domain.Publication;
import mcia.publications.domain.Publisher;
import mcia.publications.repository.PublicationRepository;
import mcia.publications.repository.PublisherRepository;
import rx.Observable;
import rx.observables.GroupedObservable;

@RestController
@RequestMapping("/api/ranking")
@Slf4j
public class RankingController {

	@Autowired
	PublicationRepository publications;

	@Autowired
	PublisherRepository publishers;

	@RequestMapping(value = "/authors", method = RequestMethod.GET)
	public Observable<List<AuthorSummary>> authors() {
		log.info("GET: ranking authors");
		return Observable
				.from(publications.findAll())
				.flatMap(this::toContributions)
				.groupBy(AuthorContribution::getAuthorId)
				.flatMap(byAuthor -> byAuthor
						.groupBy(AuthorContribution::getType)
						.flatMap(this::countByType)
						.toMap(Entry::getKey, Entry::getValue)
						.map(map -> new AuthorSummary(byAuthor.getKey(), map)))
				.toList();
	}

	private Observable<AuthorContribution> toContributions(Publication publication) {
		Publisher publisher = publishers.findOne(publication.getPublisherId());
		String type = publisher.getType();
		Iterable<Integer> ite = IntStream.iterate(1, i -> i + 1)::iterator;
		return Observable
				.from(publication.getAuthorIds())
				.zipWith(ite, (v, i) -> new Indexed<String>(i, v))
				.map(id -> new AuthorContribution(id.getValue(), type, id.getIndex()));
	}

	private Observable<Entry<String, List<Count>>> countByType(GroupedObservable<String, AuthorContribution> byType) {
		return byType
				.groupBy(AuthorContribution::getPosition)
				.flatMap(byPosition -> Observable
						.just(byPosition.getKey())
						.zipWith(byPosition.count(), Count::new))
				.toList()
				.map(list -> new AbstractMap.SimpleEntry<String, List<Count>>(byType.getKey(), list));
	}

	@Data
	@AllArgsConstructor
	private static class AuthorContribution {
		private String authorId;
		private String type;
		private int position;
	}

}
