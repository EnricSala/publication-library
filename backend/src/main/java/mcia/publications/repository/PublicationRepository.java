package mcia.publications.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import mcia.publications.domain.Publication;

public interface PublicationRepository extends PagingAndSortingRepository<Publication, String> {

	@Query("{ $and: ["
			+ "{ $or: [{ $where: '?0==null' }, { authorIds: ?0 }] },"
			+ "{ $or: [{ $where: '?1.length==0' }, { publisherId: { '$in': ?1 } }] },"
			+ "{ publishDate: { $gte: ?2, $lte: ?3 } }"
			+ "] }")
	public Page<Publication> search(String authorId, List<String> publisherIds, Date after, Date before, Pageable pageable);

	@Query("{ $and: ["
			+ "{ $text: { $search: ?0 } },"
			+ "{ $or: [{ $where: '?1==null' }, { authorIds: ?1 }] },"
			+ "{ $or: [{ $where: '?2.length==0' }, { publisherId: { '$in': ?2 } }] },"
			+ "{ publishDate: { $gte: ?3, $lte: ?4 } }"
			+ "] }")
	public Page<Publication> search(String query, String authorId, List<String> publisherIds, Date after, Date before, Pageable pageable);

}
