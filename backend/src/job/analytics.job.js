import cron from "node-cron";

export const startAnalyticsJob = () => {
    cron.schedule("0 2 * * *", async () => {
        console.log("Running analytics job...");

        try {
            /*
                Algorithms for analytics here
            */
        } catch(error) {
            console.error("Analytics job error", error);
        }
    })
}