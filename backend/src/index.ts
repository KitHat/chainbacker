import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { KickRepository } from "./repositories/kick.repository";
import { getKicks } from "./controllers/kicks.controller";
import { getKickByAddress } from "./controllers/kick_by_id.controller";
import { createKick } from "./controllers/create_kick.controller";
import { KickProcessor } from "./processors/kick.processor";
import { BackRepository } from "./repositories/back.repository";
import { getBacks } from "./controllers/backs.controller";
import cors, { CorsOptions } from "cors";

dotenv.config();

const corsOptions: CorsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

const app: Express = express();
const port = process.env.PORT || 3000;
const connString = process.env.DB_CONN_STRING || "";
const dbName = process.env.DB_NAME || "";
const tonConnString = process.env.TON_CONNECTION_STRING || "";
const apiKey = process.env.TON_API_KEY || "";

const kickRepository = new KickRepository(connString, dbName);
const backRepository = new BackRepository(connString, dbName);
const kickProcessor = new KickProcessor(kickRepository, backRepository, tonConnString, apiKey);

setInterval(async () => {
    await kickProcessor.run();
}, 10000);

app.use(express.json());

app.use(cors(corsOptions));

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.get("/kicks", async (req: Request, res: Response) => {
    await getKicks(req, res, kickRepository);
});

app.get("/kicks/:address", async (req: Request, res: Response) => {
    await getKickByAddress(req, res, kickRepository);
});

app.post("/kick", async (req: Request, res: Response) => {
    await createKick(req, res, kickRepository);
});

app.get("/backs", async (req: Request, res: Response) => {
    await getBacks(req, res, backRepository)
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});