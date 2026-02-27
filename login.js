
const { chromium } = require("playwright");
const path = require("path");
const readline = require("readline");

(async () => {
    const userDataDir = path.join(__dirname, "tests", ".auth", "chrome-profile");

    const context = await chromium.launchPersistentContext(userDataDir, {
        channel: "chrome",          // Use your real Chrome installation
        headless: false,
        args: [
            "--disable-blink-features=AutomationControlled",
        ],
        viewport: null,              // Use full window size
        ignoreDefaultArgs: ["--enable-automation"],
    });

    const page = context.pages()[0] || await context.newPage();
    await page.goto("https://app.s4e.io");

    console.log("");
    console.log("═══════════════════════════════════════════════════");
    console.log("  Log in manually in the Chrome window.");
    console.log("  Once you see the dashboard, come back here");
    console.log("  and press ENTER to save the session.");
    console.log("═══════════════════════════════════════════════════");
    console.log("");


    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    await new Promise((resolve) => rl.question("Press ENTER after logging in... ", resolve));
    rl.close();


    await context.storageState({ path: path.join(__dirname, "tests", ".auth", "session.json") });
    console.log("Session saved to tests/.auth/session.json");

    await context.close();
    console.log("Done! Now run: npx playwright test --project=chromium --workers=1");
})();
