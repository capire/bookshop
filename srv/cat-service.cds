using { sap.capire.bookshop as my } from '../db/schema';

/**
 * Catalog service for browsing and buying books by visitors/end users.
 * The entities exposed are tailored and denormalized projections that
 * exclude internal-only fields.
 */
service CatalogService @(path:'browse') {

  /** The preferred entity to display lists of Books */
  @readonly entity ListOfBooks as projection on Books {
    *, currency.symbol as currency,
  } excluding { descr };

  /** For reading details of a single Book */
  @readonly entity Books as projection on my.Books {
    *, // all fields with the following denormalizations:
    author.name as author,
    genre.name as genre,
  } excluding { createdBy, modifiedBy };

  @requires: 'authenticated-user'
  action submitOrder (
    book     : Books:ID @mandatory,
    quantity : Integer default 1 @assert.range: [1,_]
  ) returns { stock : Integer };
}

// Serve via HCQL, OData, and REST
annotate CatalogService with @hcql @odata @rest;

// Serve via MCP - requires: npm add @cap-js/mcp
annotate CatalogService with @mcp;

// Serve as custom agent via A2A - requires: npm add @cap-js/agents
annotate CatalogService with @agent;
annotate CatalogService.submitOrder with @agent.hitl;
