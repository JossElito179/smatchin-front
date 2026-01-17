import HeaderComponent from "../components/header_component";
import MenuComponent from "../components/menu_component";
import OwnerListComponent from "../components/owner/owner_list_component";

export default function OwnerList() {

    return (
        <div className="owner-list-page w-full min-h-screen bg-gray-900 text-white">
            <HeaderComponent pageName="List of owners" />
            <div className="container-list">
                <div>
                    <OwnerListComponent />
                </div>
            </div>
            <MenuComponent />
        </div>
    )
}