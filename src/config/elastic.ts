import { Client } from "@elastic/elasticsearch";

export const ElasticClient = new Client({
    node: 'http://localhost:9200'
})