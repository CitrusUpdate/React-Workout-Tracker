import { useAuthStore } from "../store/useAuthStore";

export default function MainPage() {
    const { logout } = useAuthStore();

    return (
        <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center px-4">
            <h1 className="text-3xl font-bold text-white mb-8">
                Welcome in <span className="text-blue-500">Workout Tracker</span>!
            </h1>
            
            {/*logout button for tests*/}
            <button 
                onClick={logout}
                className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition cursor-pointer"
            >
                Logout
            </button>

        </div>
    );
}