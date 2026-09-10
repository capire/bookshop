using { BookshopService } from './service';

/**
 * This is the author entity.
 * It contains information about book authors.
 */
annotate BookshopService.Authors with {
  /** The ID of the author. */
  ID;
  /** The name of the author. */
  name;
  /** The books written by the author. */
  books;
}
