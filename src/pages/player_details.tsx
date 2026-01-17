import { useNavigate, useParams } from "react-router-dom";
import HeaderComponent from "../components/header_component";
import MenuComponent from "../components/menu_component";
import { useEffect, useState } from "react";
import axios from "axios";
import PlayerDetailsComponent from "../components/players/players_details_component";
import { endpoint } from "../utils/utils";

export default function PlayerDetails() {

    const { id_player } = useParams<{ id_player: string }>();
    const [player, setPlayer] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    function createPlayerObject(data: any) {
        return {
            id_players: data.id_players,
            name: data.name,
            first_name: data.first_name,
            birth_date: data.birth_date,
            profil_img: data.profil_img,
            bacc_file: data.bacc_file,
            cin_file: data.cin_file,
            id_teams: data.id_teams,
            id_positions: data.id_positions,
            is_starter: data.is_starter,
            position: data.position ? {
                id_positions: data.position.id_positions,
                name: data.position.name,
                acronym: data.position.acronym,
            } : undefined,
            team: {
                id_teams: data.team.id_teams,
                name: data.team.name,
                logo: data.team.logo,
                is_active: true,
            },
            stats: {
                games_played: data.stats?.games_played || 0,
                points_per_game: data.stats?.points_per_game || 0,
                rebounds_per_game: data.stats?.rebounds_per_game || 0,
                assists_per_game: data.stats?.assists_per_game || 0,
                field_goal_percentage: data.stats?.field_goal_percentage || 0,
            }
        }
    }

    async function fetchPlayer() {
        try {
            setLoading(true);
            const response = await axios.get(endpoint+'players/' + id_player);

            const data_ = response.data;

            const player = createPlayerObject(data_);
            setPlayer(player);
            console.log('Fetched player data:', player);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        console.log('Chargement initial des données');
        fetchPlayer();
    }, []);


    const handleEdit = () => {
        navigate('/player/update/' + id_player);
    };

    const handleDelete = () => {
        console.log('Supprimer le joueur');
    };

    const handleGoToTeam = () => {
        console.log('Voir l\'équipe');
    };
    return (
        <div className="owner-add-page w-full min-h-screen bg-gray-900 text-white">
            <HeaderComponent pageName="Player details" />
            <div className="container-list ">
                <div className="p-5">
                    <PlayerDetailsComponent
                        player={player}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onGoToTeam={handleGoToTeam}
                    />
                </div>
            </div>
            <MenuComponent />
        </div>
    )
}