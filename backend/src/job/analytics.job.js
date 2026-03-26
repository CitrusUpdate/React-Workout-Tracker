import cron from "node-cron";
import { runProgressAnalytics, runHighRepsAnalysis, runRirAnalysis, runWeightAnalysis } from "../services/analytics.service.js";

export const startAnalyticsJob = () => {
    cron.schedule("0 2 * * *", async () => {
        console.log("Running analytics job...");

        try {
            await runProgressAnalytics();
            await runHighRepsAnalysis();
            await runRirAnalysis();
            await runWeightAnalysis();
        } catch(error) {
            console.error("Analytics job error", error);
        }
    })
}