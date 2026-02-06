import express, { json } from "express"
import http from 'http';
import { attatchWebSocketServer } from "./src/ws/server.js";
import { matchRouter } from "./src/routes/matches.js";
import { securityMiddleware } from "./src/arcject.js";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT
const host = process.env.HOST

app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Hello");
});

app.use(securityMiddleware());

app.use('/matches',matchRouter);

const {brodcastMatchCreated} = attatchWebSocketServer(server);
app.locals.brodcastMatchCreated = brodcastMatchCreated;

server.listen(PORT , HOST , ()=>{
    const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${port}` : `http://${host}:${port}`;
    console.log(`Server is running on ${baseUrl}`);
    console.log(`WebSocket is running on ${baseUrl.replace('http','ws')}/ws`)
});