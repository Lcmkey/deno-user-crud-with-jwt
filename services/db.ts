import { MongoClient } from "./../deps.ts";

// Get db config from env
const DATABASE = Deno.env.get("DATABASE")!;
const MONGO_URL = Deno.env.get("MONGO_URL")!;

const client = new MongoClient();
client.connectWithUri(MONGO_URL);

// creat a database
const db = client.database(DATABASE);

export default db;
