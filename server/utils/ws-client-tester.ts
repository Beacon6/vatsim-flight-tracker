import "dotenv/config";
import assert from "assert";

const CLIENT_COUNT = Number(process.env.CLIENT_COUNT!);
const VITE_SOCKET = process.env.VITE_SOCKET!;
assert(CLIENT_COUNT, "CLIENT_COUNT must be defined");
assert(VITE_SOCKET, "VITE_SOCKET must be defined");

const sockets: WebSocket[] = [];

for (let i = 0; i < CLIENT_COUNT; i++) {
    setTimeout(() => {
        try {
            const ws = new WebSocket(VITE_SOCKET);

            ws.addEventListener("open", () => {
                console.log(`client ${i + 1} connected`);
            });

            ws.addEventListener("close", () => {
                console.log(`client ${i + 1} disconnected`);
            });

            sockets.push(ws);
            setTimeout(() => {}, 2000);
        } catch (err: any) {
            console.error(err);
        }
    }, i * 200);
}
