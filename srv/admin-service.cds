using { sap.capire.bookshop as my } from '../db/schema';

/**
 * Admin service for managing authors, books, and genres.
 * Target users are administrators or back-office staff.
 */
service AdminService @(odata:'/admin') {
  entity Authors as projection on my.Authors;
  entity Books as projection on my.Books;
  entity Genres as projection on my.Genres;
}

// Additionally serve via HCQL and REST
annotate AdminService with @hcql @rest;

// Serve via MCP - requires: npm add @cap-js/mcp
annotate AdminService with @mcp;
