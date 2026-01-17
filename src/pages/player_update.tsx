import { useParams } from "react-router-dom";
import HeaderComponent from "../components/header_component";
import MenuComponent from "../components/menu_component";
import PlayerAddComponent from "../components/players/players_add_component";
import PlayerUpdateComponent from "../components/players/players_update_component";

export default function PlayerUpdate() {
    const { id_player } = useParams();

    return (
        <div className="player-add-page w-full min-h-screen bg-gray-900 text-white">
            <HeaderComponent pageName="Update this player" />
            <div className="container-list ">
                <div className="p-5">
                    <PlayerUpdateComponent id_player={id_player} />
                </div>
            </div>
            <MenuComponent />
        </div>
    )
}