import { useEffect, useState } from "react";
import Dock from "../bits-components/DockItems";
import { CiBasketball } from "react-icons/ci";
import { IoPeopleOutline } from "react-icons/io5";
import { LuUserPlus } from "react-icons/lu";
import { RiApps2AddLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { endpoint } from "../utils/utils";

export default function MenuComponent() {

    const navigate = useNavigate();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const id_user = localStorage.getItem('id_user');

    async function fetchUserRole() {
        try {
            setLoading(true);
            const response = await axios.get(endpoint+'users/find/' + id_user);

            const data_ = response.data;
            setUserData(data_);

        } catch (error) {
            console.error('Error fetching data:', error, loading);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUserRole();
    }, []);

    let items = [
        { icon: <IoPeopleOutline size={18} />, label: 'Owner list', onClick: () => navigate('/owners') },
        { icon: <CiBasketball size={18} />, label: 'Team list', onClick: () => navigate('/teams') },
        { icon: <LuUserPlus size={18} />, label: 'Add Owner', onClick: () => navigate('/owner/add') },
        { icon: <RiApps2AddLine size={18} />, label: 'Add team', onClick: () => navigate('/team/add') },
    ];

    const role = userData?.role;

    if (role === false) {
        items = [
            { icon: <CiBasketball size={18} />, label: 'Team list', onClick: () => navigate('/teams') },
        ];
        return (
            <div className="menu-component">
                <Dock
                    panelHeight={50}
                    baseItemSize={30}
                    items={items}
                />
            </div>);
    }
    return (
        <div className="menu-component">
            <Dock
                panelHeight={50}
                baseItemSize={30}
                items={items}
            />
        </div>
    )
}