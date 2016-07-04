package mcia.publications.repository;

import java.util.stream.Stream;

import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import mcia.publications.domain.Author;

public interface AuthorRepository extends PagingAndSortingRepository<Author, String> {

	@Query("{ $text: { $search: ?0 } }")
	public Stream<Author> search(String query);

}
