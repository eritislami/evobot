const http = require('http');

const glitch = (
    process.env.PROJECT_DOMAIN !== undefined
    && process.env.PROJECT_INVITE_TOKEN !== undefined 
    && process.env.API_SERVER_EXTERNAL !== undefined
    && process.env.PROJECT_REMIX_CHAIN !== undefined
);
const replit = (process.env.REPLIT_DB_URL !== undefined);

const initialize = () => {
    if (glitch) {
        console.log('[GLITCH ENVIRONMENT DETECTED] Starting web server');
        http.createServer((req, res) => {
            const now = new Date().toLocaleString('en-US');
            res.end(`OK (200) - ${now}`);
        }).listen(3000);
    };
    if (replit) {
        console.log('[REPLIT ENVIRONMENT DETECTED] Starting web server');
        http.createServer((req, res) => {
            const now = new Date().toLocaleString('en-US');
            res.end(`OK (200) - ${now}`);
        }).listen(3000);
    }
};

initialize();