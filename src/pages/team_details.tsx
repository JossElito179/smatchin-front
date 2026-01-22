import { useParams } from "react-router-dom";
import HeaderComponent from "../components/header_component";
import MenuComponent from "../components/menu_component";
import TeamInfo from "../components/team/team_details_component";
import { useEffect, useState } from "react";
import axios from "axios";
import { endpoint } from "../utils/utils";
import LoadingSpinner from "../components/LoadSpinner";

export default function TeamDetails() {

    const { id_team } = useParams<{ id_team: string }>();
    const [team, setTeam] = useState<any>();
    const [starter, setStarter] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    function createPlayerObject(data: any) {
        return {
            id: data.id_players,
            name: data.name,
            firstName: data.first_name,
            age: data.birth_date ? new Date().getFullYear() - new Date(data.birth_date).getFullYear() + ' YO' : '',
            role: data.is_starter ? 'Starter' : 'Bench',
            position: data.position.acronym
        }
    }

    async function fetchTeam() {
        try {
            setLoading(true);
            const response = await axios.get(endpoint + 'teams/' + id_team);

            const data_ = response.data;

            setTeam(data_);
            console.log('Fetched team data:', data_, loading);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchStarter() {
        try {
            setLoading(true);
            const response = await axios.post(endpoint + 'players/searchPlayer', {
                id_teams: id_team,
            });

            const data_ = response.data;

            const players = data_.map((item: any) => createPlayerObject(item));

            setStarter(players);
            console.log('Fetched starter data:', players);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        console.log('Chargement initial des données');
        fetchTeam();
        fetchStarter();
    }, []);

    const exampleData = {
        teamName: team?.name,
        schoolName: team?.name,
        teamLogo: team?.logo,
        teamPhoto: team?.team_img,
        season: new Date().getFullYear() + '',
        owner: team?.user.name + ' ' + team?.user.first_name,
        record: "15-5",
        members: starter?.map((player: any) => ({
            id: player.id,
            name: player.name,
            firstName: player.firstName,
            age: player.age,
            role: player.role,
            position: player.position
        }))
    };

    if (loading) {
        return (
            <LoadingSpinner text="Loading team list..." />
        )
    }

    return (
        <div className="owner-add-page w-full min-h-screen bg-gray-900 text-white">
            <HeaderComponent pageName="Team details" />
            <div className="container-list ">
                <div className="p-5">
                    <TeamInfo {...exampleData} />
                </div>
            </div>
            <MenuComponent />
        </div>
    )
}