package mcia.publications.repository;

import java.util.stream.Stream;

import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import mcia.publications.domain.Publication;

public interface PublicationRepository extends PagingAndSortingRepository<Publication, String> {

	@Query("{ $text: { $search: ?0 } }")
	public Stream<Publication> search(String query);

}
