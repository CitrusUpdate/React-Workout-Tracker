import cron from "node-cron";
import { runProgressAnalytics, runHighRepsAnalysis, runRirAnalysis } from "../services/analytics.service";

export const startAnalyticsJob = () => {
    cron.schedule("0 2 * * *", async () => {
        console.log("Running analytics job...");

        try {
            await runProgressAnalytics();
            await runHighRepsAnalysis();
            await runRirAnalysis();
        } catch(error) {
            console.error("Analytics job error", error);
        }
    })
}