using { CatalogService } from './cat-service';
using { AdminService } from './admin-service';

annotate CatalogService with @title: '{i18n>CatalogService}';
annotate AdminService with @title: '{i18n>AdminService}';

annotate CatalogService.ListOfBooks with @title: '{i18n>ListOfBooks}';

annotate CatalogService.submitOrder with @title: '{i18n>submitOrder}';
