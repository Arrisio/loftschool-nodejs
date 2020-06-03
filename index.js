const http = require('http');
chance = require('chance').Chance();

const port = process.env.PORT || '3000';
const CONSOLE_MSG_INTERVAL = process.env.CONSOLE_MSG_INTERVAL || 1000;
const RESPONSE_DELAY = process.env.RESPONSE_DELAY || 5000;

let connected_clients = [];
let intervalConsoleLogger;

const removeClient = client => {
    connected_clients.splice(connected_clients.indexOf(client), 1);
    if (connected_clients.length === 0) {
        clearInterval(intervalConsoleLogger)
    }
}

const addClient = client => {
    if (connected_clients.length === 0) {
        intervalConsoleLogger = setInterval(() => {
            console.log(`Client: ${client}, time: ${new Date().toUTCString()}`);
        }, CONSOLE_MSG_INTERVAL);
    }
    connected_clients.push(client);
}

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        const client = chance.name();
        addClient(client);
        console.log(`Client: ${client} connected!`);

        setTimeout(() => {
            removeClient(client);
            const responseTime = new Date().toUTCString()
            console.log(`Client: ${client}, time: ${responseTime} end connection`);
            res.end(`Current time: ${responseTime}`);
        }, RESPONSE_DELAY);
    }
});

server.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});