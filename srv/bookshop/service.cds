using { AdminService } from '../admin-service';

@agent @mcp service BookshopService {

  @readonly entity Authors as projection on AdminService.Authors {
    ID, name, books,
  }

  @readonly entity Books as projection on AdminService.Books {
    ID, title, stock, price,
    author,
    genre.name as genre,
    currency.name as currency,
  }

  @agent.hitl @requires: 'authenticated-user'
  action submitOrder ( book: Books:ID, quantity: Integer );
}
