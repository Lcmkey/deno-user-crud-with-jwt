import { MongoClient } from "./../deps.ts";

const client = new MongoClient();
client.connectWithUri("mongodb://localhost:27017");

// creat a database
const db = client.database("deno-user-with-jwt");

export default db;
