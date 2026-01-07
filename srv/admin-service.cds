using { sap.capire.bookshop as my } from '../db/schema';

service AdminService @(odata:'/admin') {
  @delta.enabled:(modifiedAt) entity Authors as projection on my.Authors;
  @delta.enabled:(modifiedAt) entity Books as projection on my.Books;
  entity Genres as projection on my.Genres;
}

// Additionally serve via HCQL and REST
annotate AdminService with @hcql @rest;



// ------------------------------------------------------------

extend projection AdminService.Authors with {
  tombstones : Composition of many AdminService.Authors.Tombstones on tombstones.parent = $self
}

entity AdminService.Authors.Tombstones  { 
  key parent : Association to AdminService.Authors;
      timestamp : Timestamp @cds.on.update : $now;
      user      : String;
      status    : String;
      comment   : String;  
}

view AdminService.Authors.Delta (deltaToken:Timestamp) as select from AdminService.Authors {
    *, createdAt = modifiedAt ? 'changed' : 'new' as changeType
} where modifiedAt > :deltaToken
union select from AdminService.Authors:tombstones {
    parent.ID as ID, 'deleted' as changeType
} where timestamp > :deltaToken;
