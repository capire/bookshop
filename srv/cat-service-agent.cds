using { CatalogService  } from './cat-service';
annotate CatalogService with @agent;
annotate CatalogService.submitOrder with @agent.hitl;
