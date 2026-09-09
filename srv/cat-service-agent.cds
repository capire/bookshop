using { CatalogService  } from './cat-service';
annotate CatalogService with @mcp;
annotate CatalogService with @agent;
annotate CatalogService.submitOrder with @agent.hitl;
