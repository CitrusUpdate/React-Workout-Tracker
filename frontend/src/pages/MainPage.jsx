import { useAuthStore } from "../store/useAuthStore";
import OnboardingModal from "../components/OnboardingModal";
import Cookies from 'js-cookie';

export default function MainPage() {
    const { logout, authUser } = useAuthStore();
    const needsOnboarding =  !Cookies.get('onboarding_complete') && !authUser?.profile?.age;

    return (
        <div>
            { needsOnboarding && <OnboardingModal /> }

            {/*logout button for tests*/}
            <button 
                onClick={logout}
                className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition cursor-pointer">
                Logout
            </button>
        </div>
    );
}