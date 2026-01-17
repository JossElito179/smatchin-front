import { useNavigate } from "react-router-dom";
import Logo from "../assets/530171883_122216480942251755_3185943683385628894_n.jpg";
import { VscDebugDisconnect } from "react-icons/vsc";

type HeaderProps = {
    pageName: string;
};


export default function HeaderComponent({ pageName }: HeaderProps) {

    const navigate =useNavigate()

    function logOut(){
        localStorage.removeItem('token');
        navigate('/');
    }

    return (
        <div className="heads flex items-center justify-between px-4 py-4 border-b border-gray-700">

            {/* Logo */}
            <div className="shrink-0">
                <button className="bg-white rounded-full p-2 px-4 flex items-center justify-center">
                    <img src={Logo} alt="logo" className="w-7 h-7 md:w-8 md:h-8" />
                    <span className="text-gray-900 font-medium align-middle mt-1 hidden md:inline" > Check.mg </span>
                </button>
            </div>

            {/* Page title */}
            <div className="flex-1 text-center">
                <h1 className="font-medium text-xl sm:text-2xl md:text-3xl lg:text-4xl truncate">
                    {pageName}
                </h1>
            </div>

            {/* Logout */}
            <div className="shrink-0">
                <button onClick={logOut} className="bg-gray-800 transition-all hover:scale-105 any-pointer-coarse: text-white rounded-full p-2  md:px-6 md:py-2 flex items-center">
                    <VscDebugDisconnect className="text-lg md:mr-2" />
                    <span className="hidden md:inline">Log out</span>
                </button>
            </div>

        </div>

    )
}