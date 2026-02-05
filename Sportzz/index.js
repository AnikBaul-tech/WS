import express, { json } from "express"
import { matchRouter } from "./src/routes/matches.js";
const app = express();
const port = 3000

app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Hello");
});

app.use('/matches',matchRouter);

app.listen(port,()=>{
    console.log(`Server is running on localhost:${port}`);
})