import app from "./app";
import SeedDB from "./app/db/seed";
import config from "./config";

async function main() {
    const server = app.listen(config.port, async () => {
        await SeedDB();
        console.log(
            `🚀 Application is running on http://localhost:${config.port}`
        );
    });
    const exitHandler = () => {
        if (server) {
            server.close(() => {
                console.info("Server closed!");
            });
        }
        process.exit(1);
    };
    process.on("uncaughtException", (error) => {
        console.log(error);
        exitHandler();
    });

    process.on("unhandledRejection", (error) => {
        console.log(error);
        exitHandler();
    });
}

main();
