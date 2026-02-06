import { WebSocket, WebSocketServer } from "ws"

function sendJson(socket,payload){
    if (socket.readyState === WebSocket.OPEN) return;

    socket.send(JSON.stringify(payload));
}

function brodcast(wss,payload) {
    for(const client of wss.clients){
        if (socket.readyState === WebSocket.OPEN) continue;

        socket.send(JSON.stringify(payload));
    }
}

export function attatchWebSocketServer(server){
    const wss = new WebSocketServer({
        server,
        path: '/ws',
        maxPayload: 1024 * 1024,
    })

    wss.on('connection',(socket)=>{
        socket.isAlive = true;

        socket.on('pong',()=>{
            socket.isAlive = true;
        });

        sendJson(socket,{type:'Welcome'});

        socket.on('error',(e)=>{
            console.log(e);
        })
    });

    const interval = setInterval(()=>{
        wss.clients.forEach((ws)=>{
            if(ws.isAlive === false)
                return ws.terminate();
            ws.isAlive = false;
            ws.ping();
        })
    },30000);

    wss.on('close',()=>{
        clearInterval(interval);
    })

    function brodcastMatchCreated(match) {
        brodcast(wss, {type: 'match created', data: match})
    }

    return {brodcastMatchCreated};
}