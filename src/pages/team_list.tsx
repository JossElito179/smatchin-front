import HeaderComponent from "../components/header_component";
import MenuComponent from "../components/menu_component";
import TeamListComponent from "../components/team/team_list_component";

export default function TeamList() {

    return (
        <div className="owner-list-page w-full min-h-screen bg-gray-900 text-white">
            <HeaderComponent pageName="List of teams" />
            <div className="container-list">
                <div>
                    <TeamListComponent />
                </div>
            </div>
            <MenuComponent />
        </div>
    )
}