import { Link } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

export default function Navbar() {
    const { authUser } = useAuthStore();
    const avatarSrc = authUser.profilePic || "/default.png";
    
    {/* for responsive design hide navbar on small devices on medium show */}
    return (
        <header className="hidden md:block fixed top-0 inset-x-0 bg-slate-950 w-full h-24 shadow-md shadow-blue-500 z-40">
            <nav className="flex items-center justify-between h-full lg:text-xl md:text-lg sm:text-base">
                {/*logo*/}
                <div className="flex-1 flex justify-start md:ml-4 ml-2">
                    <Link to={"/"} className="hover:opacity-80 transition"><h1 className="text-2xl font-bold tracking-tight">Workout <span className="text-blue-500">Tracker</span></h1></Link>
                    </div>
                {/*links */}
                <div className="flex-1 flex justify-center md:gap-8 gap-4">
                    <Link to={"/"} className="hover:text-blue-500 transition">Home</Link>
                    <Link to={"/trainings"} className="hover:text-blue-500 transition">Trainings</Link>
                </div>
                {/*avatar */}
                <div className="flex-1 flex justify-end md:mr-4 mr-2">
                    <Link to={"/profile"}><img className="md:w-12 md:h-12 w-10 h-10  rounded-full object-cover" src={avatarSrc} alt="User avatar" /></Link>
                </div>
            </nav>
        </header>
    );
}