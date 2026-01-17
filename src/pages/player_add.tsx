import { useParams } from "react-router-dom";
import HeaderComponent from "../components/header_component";
import MenuComponent from "../components/menu_component";
import PlayerAddComponent from "../components/players/players_add_component";

export default function PlayerAdd() {
    const { id_team, name } = useParams();

    return (
        <div className="player-add-page w-full min-h-screen bg-gray-900 text-white">
            <HeaderComponent pageName="Add a new player" />
            <div className="container-list ">
                <div className="p-5">
                    <PlayerAddComponent id_teams={id_team} name={name} />
                </div>
            </div>
            <MenuComponent />
        </div>
    )
}