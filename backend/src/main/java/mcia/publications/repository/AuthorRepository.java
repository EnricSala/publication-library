package mcia.publications.repository;

import mcia.publications.domain.Author;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface AuthorRepository extends PagingAndSortingRepository<Author, String> {

}
