using { AdminService } from './admin-service';

@agent @mcp service BookshopService {

  @readonly entity Authors as projection on AdminService.Authors excluding {
    createdBy, modifiedBy,
  }

  @readonly entity Books as projection on AdminService.Books {
    ID, title, stock, price,
    author,
    genre.name as genre,
    currency.name as currency,
  }

  @agent.hitl
  action submitOrder ( book: Books:ID, quantity: Integer );
}


/**
 * This is the author entity.
 * It contains information about book authors.
 */
annotate BookshopService.Authors with {
  ID    /** The ID of the author. */;
  name  /** The name of the author. */;
  books /** All the books written by the author. */;
}
