
export class Page {
	content: [];
	first: boolean;
	last: boolean;
	number: number;
	numberOfElements: number;
	pageable: Pageable;
	size: number;
	sort: {
	  empty: boolean;
	  sorted: boolean;
	  unsorted: boolean;
	};
	totalElements: number;
	totalPages: number;
}
  export class Pageable {
	offset: number;
	pageNumber: number;
	pageSize: number;
	paged: boolean;
	sort: { sorted: boolean; unsorted: boolean };
	unpaged: boolean;
}