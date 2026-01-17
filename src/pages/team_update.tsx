import { useParams } from "react-router-dom";
import HeaderComponent from "../components/header_component";
import MenuComponent from "../components/menu_component";
import TeamUpdateComponent from "../components/team/team_update_component";

export default function TeamUpdate() {
    const { id_team } = useParams();
    return (
        <div className="team-add-page w-full min-h-screen bg-gray-900 text-white relative">
            <HeaderComponent pageName="Update this team" />
            <div className="container-list ">
                <div className="p-5">
                    <TeamUpdateComponent id={id_team} />
                </div>
            </div>
            <MenuComponent />
        </div>
    )
}