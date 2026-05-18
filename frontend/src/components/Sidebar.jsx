import { useState } from "react";
import { Link } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { PanelRightOpen, PanelRightClose } from 'lucide-react';

export default function Sidebar() {
    const { authUser } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const avatarSrc = authUser.profilePic || "/default.png";

    {/* for responsive design hide sidebar on medium devices on small show */}
    return (
        <header className={`block md:hidden fixed right-0 inset-y-0 bg-slate-950 w-24 h-full shadow-md shadow-blue-500 z-50 transition-all duration-300  ${isOpen ? 'w-64' : 'w-16'}`}>
            <nav className="flex flex-col items-center justify-between h-full text-xl">
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-white hover:text-blue-500 transition self-end cursor-pointer"
                >
                    { isOpen ? <PanelRightClose size={28} /> : <PanelRightOpen size={28} /> }
                </button>

                {/*show only if sidebar is open*/}
                { isOpen && (
                    <>
                        <div className="flex-1 flex justify-start ml-2">
                            <Link to={"/"} onClick={() => setIsOpen(false)} className="hover:opacity-80 transition"><h1 className="text-2xl font-bold tracking-tight">Workout <span className="text-blue-500">Tracker</span></h1></Link>
                        </div>
                        {/*links **/}
                        <div className="flex-1 flex flex-col justify-center gap-4">
                            <Link to={"/"} onClick={() => setIsOpen(false)} className="hover:text-blue-500 transition">Home</Link>
                            <Link to={"/trainings"} onClick={() => setIsOpen(false)} className="hover:text-blue-500 transition">Trainings</Link>
                        </div>
                        {/*avatar */}
                        <div className="flex-1 flex justify-end mr-2 mt-4">
                            <Link to={"/profile"} onClick={() => setIsOpen(false)}><img className="w-12 h-12 rounded-full object-cover" src={avatarSrc} alt="User avatar" /></Link>
                        </div>
                    </>
                )}
            </nav>
        </header>
    );
}
