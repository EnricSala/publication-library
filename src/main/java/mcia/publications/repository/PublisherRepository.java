package mcia.publications.repository;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;

import mcia.publications.domain.Publisher;

public interface PublisherRepository extends PagingAndSortingRepository<Publisher, String> {

	public List<Publisher> findByType(String type);

}
