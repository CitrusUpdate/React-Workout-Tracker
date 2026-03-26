import cron from "node-cron";
import { runProgressAnalyticsForUser, runRepsAnalysisForUser, runRirAnalysisForUser, runWeightAnalysisForUser } from "../services/analytics.service.js";
import { isUserLocalHour } from "../utils/time.js";
import User from "../models/User.js";

export const startAnalyticsJob = () => {
    cron.schedule("0 * * * *", async () => {
        console.log("Running analytics job...");

        try {
            const users = await User.find();
            for(const user of users) {
                if(!isUserLocalHour(user, 2)) continue;

                console.log(`Running analytics for ${user._id}`);
            

                await runProgressAnalyticsForUser(user);
                await runRepsAnalysisForUser(user);
                await runRirAnalysisForUser(user);
                await runWeightAnalysisForUser(user);
            }
        } catch(error) {
            console.error("Analytics job error", error);
        }
    })
}