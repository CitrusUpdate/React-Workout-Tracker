import { useEffect } from "react";
import { useStravaStore } from "../../store/useStravaStore";
import { useAuthStore } from "../../store/useAuthStore";
import { ExternalLink } from "lucide-react";
import PageLoader from "../PageLoader";

export default function StravaCard() {
    const { isFetchingStravaDetails, connectStrava, disconnectStrava, stravaUserDetails, stravaUserStats, getUserInfo, getUserStats, getRuns, stravaRuns } = useStravaStore();
    const { authUser } = useAuthStore();

    const isStravaConnected = !!authUser?.stravaAuth?.accessToken;

    useEffect(() => {
        if(isStravaConnected) {
            getUserInfo();
            getUserStats();
            getRuns();
        }
    }, [isStravaConnected]);

    const weeklyRunsCount = stravaRuns?.length || 0;
    const weeklyDistance = ((stravaRuns?.reduce((sum, run) => sum + run.distance, 0) || 0) / 1000).toFixed(2);
    
    return (
        <div className="flex flex-col justify-between h-full w-full">
            <h2 className="text-slate-300 md:text-lg text-md font-semibold uppercase tracking-wider mb-2">{ !isStravaConnected ? "Connect to Strava" : "Strava Details" }</h2>

            <div className="flex flex-col md:flex-row justify-between h-full">
                { !isStravaConnected ? (
                    <>
                        <div>
                            <h3 className="text-slate-400 md:text-md text-sm font-semibold uppercase mb-2">You are not connected to strava yet</h3>
                            <p className="text-slate-500 md:text-sm text-xs italic leading-relaxed">Join for better run details on your workouts</p>
                        </div>

                        <div className="mt-10">
                            <button className="cursor-pointer rounded-sm overflow-hidden shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-500 active:scale-95" onClick={connectStrava}><img src="./btn_strava_connect_with_orange.svg" alt="Connect with Strava" /></button>
                            <img src="./api_logo_cptblWith_strava_stack_white.svg" className="md:w-30 w-20 ml-auto mt-10 block" alt="Compatible with Strava" />
                        </div>
                    </>
                ) : (
                    <>
                        { isFetchingStravaDetails || !stravaUserDetails || !stravaUserStats ? (
                            <div className="pt-24 flex justify-center">
                                <PageLoader />
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col md:flex-row w-full h-full gap-8">
                                    <div className="md:w-1/3 shrink-0 flex flex-col md:h-full">
                                        <h3>Account Info</h3>
                                        <div className="flex flex-col md:flex-row gap-3 mb-4">
                                            <img src={stravaUserDetails.profilePic} alt="User strava profile pic"  className="h-12 w-12 rounded-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                            
                                            <div className="flex flex-col">
                                                <p className="text-sm md:text-md font-semibold">{stravaUserDetails.username}</p>
                                                <p className="text-xs md:text-sm text-slate-400">{stravaUserDetails.firstname} {stravaUserDetails.lastname}</p>
                                            </div>
                                        </div>

                                        <div className="pt-2 border-t border-slate-800 mb-5">
                                            {stravaUserDetails.clubs.length > 0 ? (
                                                stravaUserDetails.clubs.length === 1 ? (
                                                <span>Club: {stravaUserDetails.clubs[0].name}</span>
                                                ) : (
                                                <>
                                                <h4 className="text-xs md:text-sm">Clubs:</h4>
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        {stravaUserDetails.clubs.map((club, index) => (
                                                        <li className="text-xs text-slate-300" key={index}>{club.name}</li>
                                                        ))}
                                                    </ul>
                                                </>
                                                )
                                            ) : null}
                                        </div>
                                        
                                        <button 
                                            onClick={disconnectStrava}
                                            className="mt-auto mb-4 md:mb-0 w-fit bg-strava hover:bg-[#E34402] text-white text-xs md:text-sm font-bold uppercase tracking-wide py-2.5 px-6 rounded-sm shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-500 active:scale-95 cursor-pointer"
                                        >
                                            Disconnect from Strava
                                        </button>
                                    </div>

                                    <div className="mt-5 md:mt-0 mb-3 md:mb-0 flex-1 flex flex-col md:w-2/3">
                                            <h3>Runs: </h3>
                                            <div className="flex flex-col md:flex-row justify-between w-full h-full">
                                                <div>
                                                    <p className="text-sm md:text-md font-semibold">Distance this week: {weeklyDistance} km, Runs: {weeklyRunsCount}</p>
                                                    <p className="text-xs md:text-sm text-slate-400">Distance this month: {stravaUserStats.recentRunTotalsDistance} km. Runs: {stravaUserStats.recentRunTotalsCount}</p>
                                                    <p className="text-xs md:text-sm text-slate-400">Distance this year: {stravaUserStats.ytdRunTotalsDistance} km. Runs: {stravaUserStats.ytdRunTotalsCount}</p>
                                                    <p className="text-xs md:text-sm text-slate-400">Distance from start: {stravaUserStats.allRunTotalsDistance} km. Runs: {stravaUserStats.allRunTotalsCount}</p>
                                                </div>

                                                <div className="flex flex-col items-end h-full mt-5 md:mt-0">
                                                    <h4>Check more: </h4>
                                                    <a 
                                                        href={`https://www.strava.com/athletes/${stravaUserDetails.id}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-orange-500 hover:text-orange-400 text-sm font-semibold flex gap-1 transition-colors items-start mb-10"
                                                    >
                                                        View Full Profile <ExternalLink size={16} />
                                                    </a>
                                                    <img src="./api_logo_pwrdBy_strava_stack_white.svg" className="md:w-30 w-20 ml-auto mt-auto block" alt="Powered by Strava" />
                                                </div>
                                            </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}