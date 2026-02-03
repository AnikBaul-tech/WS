import { WebSocketServer , WebSocket } from "ws";

const wss = new WebSocketServer({port:8080});

wss.on('connection',(socket,req)=>{
    const ip = req.socket.remoteAddress;

    socket.on('message',(raw)=>{
        const message = raw.toString();
        console.log(ip+": "+raw);

        wss.clients.forEach((client)=>{
            if (client.readyState === WebSocket.OPEN ) 
                client.send(`Server Brodcast: ${message}`)
        })
    });

    socket.on('error',(err)=>{
        console.log(err);
        console.log(ip);
        
    });

    socket.on('close',()=>{
        console.log("Client Disconnected")
    })
})

console.log("Websocket is live on ws://localhost:8080");