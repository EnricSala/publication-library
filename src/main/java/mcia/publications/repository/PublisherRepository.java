package mcia.publications.repository;

import org.springframework.data.repository.PagingAndSortingRepository;

import mcia.publications.domain.Publisher;

public interface PublisherRepository extends PagingAndSortingRepository<Publisher, String> {

}
