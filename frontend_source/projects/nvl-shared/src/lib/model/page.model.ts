export class Direction {
  static ASC = 'asc';
  static DESC = 'desc';
}

export class Order {
  property: string;
  direction: string = Direction.ASC;

  constructor(property: string, direction = Direction.ASC) {
    this.property = property;
    this.direction = direction;
  }

  static by(property: string, direction = Direction.ASC) {
    return new Order(property, direction);
  }

  static clone(order: Order) {
    return Order.by(order.property, order.direction);
  }

  isAscending(): boolean {
    return this.direction === Direction.ASC;
  }

  isDescending(): boolean {
    return this.direction === Direction.DESC;
  }

  toggleDirection() {
    this.direction = this.isAscending() ? Direction.DESC : Direction.ASC;
  }

  toSortString(): string {
    return this.isAscending() ? `${this.property}` : `${this.property},${this.direction}`;
  }
}

export class Sort {
  static readonly UNSORTED = new Sort();

  orders: Order[];

  constructor() { }

  static by(properties: string[]): Sort {
    const orders: Order[] = [];
    properties.forEach(property => {
      orders.push(Order.by(property));
    });
    return Sort.orders(orders);
  }

  static clone(sort: Sort) {
    let newOrders: Order[];
    if (sort.orders !== void 0 && sort.orders !== null) {
      newOrders = [];
      sort.orders.forEach(order => {
        newOrders.push(Order.clone(order));
      });
    }
    return Sort.orders(newOrders);
  }

  static orders(orders: Order[]): Sort {
    const sort = new Sort();
    sort.orders = orders;
    return sort;
  }

  static unsorted(): Sort {
    return Sort.UNSORTED;
  }

  isSorted(): boolean {
    return this.orders && this.orders.length > 0;
  }

  isUnsorted(): boolean {
    return !this.isSorted();
  }
}

export class Pageable {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  sort: { sorted: boolean; unsorted: boolean };
  unpaged: boolean;
}

export class Page<T> {
  content: T[];
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

export class PageRequest {
  page: number;
  size: number;
  sort: Sort;

  constructor(page: number, size: number, sort = Sort.unsorted()) {
    this.page = page;
    this.size = size;
    this.sort = sort;
  }

  static of(page: number, size: number, sort: Sort = Sort.unsorted()): PageRequest {
    return new PageRequest(page, size, sort);
  }

  static clone(pageRequest: PageRequest) {
    return PageRequest.of(pageRequest.page, pageRequest.size, Sort.clone(pageRequest.sort));
  }
}
