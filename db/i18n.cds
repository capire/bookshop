using { sap.capire.bookshop as my } from './schema';

annotate my.Books with @title: '{i18n>Books}' {
  ID       @title: '{i18n>Books.ID}';
  title    @title: '{i18n>Books.title}';
  descr    @title: '{i18n>Books.descr}';
  author   @title: '{i18n>Books.author}';
  genre    @title: '{i18n>Books.genre}';
  stock    @title: '{i18n>Books.stock}';
  price    @title: '{i18n>Books.price}';
  currency @title: '{i18n>Books.currency}';
}

annotate my.Authors with @title: '{i18n>Authors}' {
  ID           @title: '{i18n>Authors.ID}';
  name         @title: '{i18n>Authors.name}';
  dateOfBirth  @title: '{i18n>Authors.dateOfBirth}';
  dateOfDeath  @title: '{i18n>Authors.dateOfDeath}';
  placeOfBirth @title: '{i18n>Authors.placeOfBirth}';
  placeOfDeath @title: '{i18n>Authors.placeOfDeath}';
  books        @title: '{i18n>Authors.books}';
}

annotate my.Genres with @title: '{i18n>Genres}' {
  parent   @title: '{i18n>Genres.parent}';
  children @title: '{i18n>Genres.children}';
}
