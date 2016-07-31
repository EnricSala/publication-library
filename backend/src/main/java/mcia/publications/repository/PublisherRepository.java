package mcia.publications.repository;

import mcia.publications.domain.Publisher;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface PublisherRepository extends PagingAndSortingRepository<Publisher, String> {

	List<Publisher> findByType(String type);

}
