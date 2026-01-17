import { useParams } from "react-router-dom";
import HeaderComponent from "../components/header_component";
import MenuComponent from "../components/menu_component";
import PlayersListComponent from "../components/players/players_list_component";

export default function PlayerList() {
    const { id_team } = useParams<{ id_team: string }>();
    const { name } = useParams<{ name: string }>();
    return (
        <div className="player-list-page w-full min-h-screen bg-gray-900 text-white">
            <HeaderComponent pageName={`Players list of ${name}`} />
            <div className="container-list">
                <div>
                    <PlayersListComponent id={id_team} name={name} />
                </div>
            </div>
            <MenuComponent />
        </div>
    )
}