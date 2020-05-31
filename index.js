const http = require('http');
chance = require('chance').Chance();

const port = process.env.PORT || '3000';
const CONSOLE_MSG_INTERVAL = process.env.CONSOLE_MSG_INTERVAL || 1000;
const RESPONSE_DELAY = process.env.RESPONSE_DELAY || 10000;

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        const client = chance.name()
        console.log(`Client: ${client} connected!`);

        const echoInterval = setInterval(() => {
            console.log(`Client: ${client}, time: ${new Date().toUTCString()}`);
        }, CONSOLE_MSG_INTERVAL);

        setTimeout(() => {
            clearInterval(echoInterval);
            const responseTime = new Date().toUTCString()
            console.log(`Client: ${client}, time: ${responseTime} end connection`);
            res.end(`Current time: ${responseTime}`);
        }, RESPONSE_DELAY);
    }
});

server.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});