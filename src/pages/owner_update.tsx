import { useParams } from "react-router-dom";
import HeaderComponent from "../components/header_component";
import MenuComponent from "../components/menu_component";
import OwnerUpdateComponent from "../components/owner/owner_update_component";

export default function OwnerUpdate() {
    const { id_user } = useParams();

    return (
        <div className="owner-add-page w-full min-h-screen bg-gray-900 text-white">
            <HeaderComponent pageName="Update this owner" />
            <div className="container-list ">
                <div className="p-5">
                    <OwnerUpdateComponent id_user={id_user} />
                </div>
            </div>
            <MenuComponent />
        </div>
    )
}