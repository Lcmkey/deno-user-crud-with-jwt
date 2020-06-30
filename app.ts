import { Dotenv, Application, Context } from "./deps.ts";

import { Timer, Logger, ErrorHandler } from "./middleware/index.ts";
import router from "./routers/user.ts";

const env = Deno.env.toObject();
const PORT = parseInt(env.PORT!) || 4000;
const HOST = env.HOST || "localhost";
const app = new Application();

// middleware
app.use(Logger);
app.use(Timer);
app.use(ErrorHandler);

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Application is listing on port: ${PORT}, open ${HOST}:${PORT}`);

await app.listen(`${HOST}:${PORT}`);
