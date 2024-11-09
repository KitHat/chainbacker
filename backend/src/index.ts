import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { KickRepository } from "./repositories/kick.repository";
import { getKicks } from "./controllers/kicks.controller";
import { getKickById } from "./controllers/kick_by_id.controller";
import { createKick } from "./controllers/create_kick.controller";
import { KickProcessor } from "./processors/kick.processor";
import { ContractRepository } from "./repositories/contract.repository";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const connString = process.env.DB_CONN_STRING || "";
const dbName = process.env.DB_NAME || "";
const kickContract = process.env.KICK_CONTRACT_ADDRESS || "";
const tonConnString = process.env.TON_CONNECTION_STRING || "";

const kickRepository = new KickRepository(connString, dbName);
const contractRepository = new ContractRepository(dbName, connString);
const kickProcessor = new KickProcessor(kickRepository, contractRepository, kickContract, tonConnString);

setInterval(async () => {
    await kickProcessor.run();
}, 3000);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.get("/kicks", async (req: Request, res: Response) => {
    await getKicks(req, res, kickRepository);
});

app.get("/kicks/:id", async (req: Request, res: Response) => {
    await getKickById(req, res, kickRepository);
});

app.post("/kick", async (req: Request, res: Response) => {
    await createKick(req, res, kickRepository);
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});