import HeaderComponent from "../components/header_component";
import MenuComponent from "../components/menu_component";
import OwnerAddComponent from "../components/owner/owner_add_component";

export default function OwnerAdd() {

    return (
        <div className="owner-add-page w-full min-h-screen bg-gray-900 text-white">
            <HeaderComponent pageName="Add a new owner" />
            <div className="container-list ">
                <div className="p-5">
                    <OwnerAddComponent />
                </div>
            </div>
            <MenuComponent />
        </div>
    )
}