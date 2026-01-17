import HeaderComponent from "../components/header_component";
import MenuComponent from "../components/menu_component";
import TeamAddComponent from "../components/team/team_add_component";

export default function TeamAdd() {

    return (
        <div className="team-add-page w-full min-h-screen bg-gray-900 text-white relative">
            <HeaderComponent pageName="Add a new team" />
            <div className="container-list ">
                <div className="p-5">
                    <TeamAddComponent />
                </div>
            </div>
            <MenuComponent />
        </div>
    )
}