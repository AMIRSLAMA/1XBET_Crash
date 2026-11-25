const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");

const CHROME_CANDIDATES = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

module.exports = async () => {
    try {
        await puppeteer.use(StealthPlugin());

        const installedBrowser = CHROME_CANDIDATES.find((candidate) =>
            fs.existsSync(candidate)
        );

        const options = {
            headless: false,
            devtools: false,
            ignoreHTTPSErrors: true,
            args: [
                "--start-maximized",
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--ignore-certificate-errors",
            ],
            ignoreDefaultArgs: ["--enable-automation"],
            slowMo: 10,
        };

        if (installedBrowser) {
            options.executablePath = installedBrowser;
            console.log("Using browser:", installedBrowser);
        } else {
            console.log("No standard Chrome/Edge path found; trying Puppeteer's default browser.");
        }

        const browser = await puppeteer.launch(options);
        const browserWSEndpoint = browser.wsEndpoint();
        console.log("Browser WebSocket endpoint:", browserWSEndpoint);

        // Keep the browser running; the capture process connects to this endpoint.
        await browser.disconnect();
        return browserWSEndpoint;
    } catch (err) {
        console.error("Could not launch Chrome/Edge:", err.message);
        throw err;
    }
};
