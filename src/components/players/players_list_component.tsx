import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { AiOutlineDribbble } from "react-icons/ai";
import { TbListDetails } from "react-icons/tb";
import {
    Person,
    CalendarMonth,
} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { VscFileMedia, VscHeart } from 'react-icons/vsc';
import { useEffect, useState } from 'react';
import type { itemPlayer } from '../../utils/entity';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { endpoint } from '../../utils/utils';
import LoadingSpinner from '../LoadSpinner';

const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#2a1a2e',
        color: '#f0e0e0',
        fontSize: 16,
        fontWeight: 600,
        borderBottom: '2px solid #bd7800',
        padding: '16px 12px',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        color: '#f0e0e0',
        borderBottom: '1px solid #3d2c48',
        padding: '14px 12px',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: 'rgba(255, 140, 0, 0.05)',
        },
    },
}));

const StyledTableRow = styled(TableRow)(() => ({
    backgroundColor: '#1a0f2a',
    '&:nth-of-type(even)': {
        backgroundColor: '#291e3b',
    },
    '&:hover': {
        backgroundColor: '#3d1a5d',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(255, 140, 0, 0.1)',
    },
    transition: 'all 0.3s ease',
}));

const DarkTableContainer = styled(TableContainer)(() => ({
    borderRadius: '12px',
    overflow: 'hidden',
    background: 'linear-gradient(145deg, #1a0f2a 0%, #291e3b 100%)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(255, 140, 0, 0.1)',
    border: '1px solid rgba(255, 140, 0, 0.2)',
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #ff8c00, transparent)',
    },
}));

function createData(
    id: number,
    name: string,
    first_name: string,
    age: number,
    role: string,
    profil_img: string,
    birth_date: string
) {
    return { id, name, first_name, age, role, profil_img, birth_date };
}

export default function PlayersListComponent({ id, name }: { id: string | undefined; name: string | undefined }) {
    const [load, setLoading] = useState(true);
    const [rows, setRows] = useState<itemPlayer[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const userId = localStorage.getItem('id_user');
    const [user, setUser] = useState<any>(null);
    const [canHandle, setCanHandle] = useState(false);
    const navigate = useNavigate();
    const [canHandledResponse, setCanHandledResponse] = useState([]);

    async function fetchUserRole() {
        try {
            setLoading(true);
            const response = await axios.get(endpoint + 'users/find/' + userId);
            console.log(response.data);
            setUser(response.data);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchCanHandle() {
        try {
            const response = await axios.post(
                endpoint + 'teams/all/with-search/user-id',
                { id_user: userId }
            );

            const teams = response.data;

            setCanHandledResponse(teams);


            let canHandle = false;
            let is = 0;
            teams.forEach((element: any) => {
                if (Number(element.id) == Number(id)) {
                    is++;
                }
            });

            console.log(is);
            if (is > 0) {
                canHandle = true;
            }

            setCanHandle(canHandle);
            localStorage.setItem('canHandle', canHandle ? 'true' : 'false');
            console.log(canHandle, load, canHandledResponse);
        } catch (error) {
            console.error(error);
        }
    }




    async function fetchData(searchTerm?: string) {
        try {
            setLoading(true);
            await fetchUserRole();
            setCanHandle(true)
            if (user?.role == false) {
                await fetchCanHandle();
            }
            const response = await axios.post(endpoint + 'players/searchPlayer', {
                searchTerm: searchTerm || '',
                id_teams: id
            });

            const data_ = response.data;

            console.log('Données récupérées:', data_);

            const preRows = data_.map((item: any) =>
                createData(
                    item.id_players,
                    item.name,
                    item.first_name,
                    item.age,
                    item.position.acronym,
                    item.profil_img,
                    item.birth_date
                )
            );

            setRows(preRows);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    function handleAddplayer() {
        navigate(`/player/add/${id}/${name || 'team'}`);
    }

    function handleShowDetails(id_player: number) {
        navigate(`/player/details/${id_player}`);
    }


    useEffect(() => {
        if (searchTerm !== undefined) {
            console.log('Recherche avec terme:', searchTerm);
            fetchData(searchTerm);
        }
    }, [searchTerm]);

    function exportPlayerWithImages(): void {
        const exportData = async () => {
            try {
                const response = await axios.get(endpoint + `players/export/${id}`, {
                    responseType: 'blob',
                });

                const url = window.URL.createObjectURL(new Blob([response.data]));

                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `players_${name}.zip`);

                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                console.log('ZIP export successful');

            } catch (error) {
                console.error('Failed to export ZIP', error);
                alert('Failed to export ZIP file with images');
            }
        };
        exportData();
    }

    if (load) {
        return (
            <LoadingSpinner text="Loading player list..." />
        )
    }

    return (
        <div>
            <div className="retour pt-5 max-w-7xl mx-auto">
                <IconButton
                    onClick={() => navigate('/teams')}
                    color="primary"
                    aria-label="retour"
                    sx={{
                        marginBottom: 2,
                        border: '1px solid rgba(255, 255, 255, 0.23)',
                        '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.04)'
                        }
                    }}
                >
                    <ArrowBackIcon className=" text-purple-700" fontSize="medium" />
                </IconButton>
            </div>
            <div className="search-container flex items-center w-full justify-center mb-5">
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search players..." className="search-input p-3 m-5 rounded bg-gray-800 border border-gray-700 w-1/3" />
            </div>
            <div className="w-full flex flex-col items-center justify-center">

                <div
                    className="md:w-full w-[90%] max-w-6xl overflow-x-auto md:overflow-x-hidden"
                    style={{ maxHeight: '400px', overflowY: 'auto' }}
                >
                    <div className="min-w-175">
                        <DarkTableContainer>
                            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>
                                            <div className="flex items-center gap-2">
                                                <Person fontSize="small" className="text-orange-200" />
                                                Full name
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <div className="flex items-center justify-center gap-2">
                                                <CalendarMonth fontSize="small" className="text-orange-200" />
                                                Birth date
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <div className="flex items-center justify-center gap-2">
                                                <VscHeart fontSize="small" className="text-orange-200" />
                                                Age
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <div className="flex items-center justify-center gap-2">
                                                <AiOutlineDribbble fontSize="small" className="text-orange-200" />
                                                Role
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">Details</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row, index) => (
                                        <StyledTableRow key={index} className="group">
                                            <StyledTableCell component="th" scope="row">
                                                <div className="flex">
                                                    <div className="flex items-center gap-3">
                                                        {
                                                            row.profil_img ? (
                                                                <div className='rounded-full w-10 h-10 hover:scale(1.1)'>
                                                                    <a
                                                                        href={row.profil_img}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        <img
                                                                            src={row.profil_img}
                                                                            alt={`${row.name}`}
                                                                            className="w-full h-full object-cover rounded-full transition-all hover:scale-110"
                                                                        />
                                                                    </a>

                                                                </div>
                                                            ) : (
                                                                <Avatar
                                                                    sx={{
                                                                        width: 36,
                                                                        height: 36,
                                                                        bgcolor: 'rgba(255, 140, 0, 0.1)',
                                                                        border: '1px solid rgba(255, 140, 0, 0.3)',
                                                                        color: '#ff8c00',
                                                                        cursor: 'pointer',
                                                                        transition: 'all 0.3s',
                                                                        '&:hover': {
                                                                            transform: 'scale(1.1)',
                                                                            boxShadow: '0 0 20px rgba(255, 140, 0, 0.4)',
                                                                        },
                                                                    }}
                                                                >
                                                                    <VscFileMedia />
                                                                </Avatar>)
                                                        }
                                                    </div>
                                                    <div className="flex items-center gap-3 ml-3">
                                                        <div>
                                                            <div className="flex items-center gap-3">
                                                                <div>
                                                                    <div className="font-semibold text-white">{row.name}</div>
                                                                    <div className="text-sm text-gray-300">{row.first_name}</div>
                                                                </div>
                                                            </div>
                                                            {/* <div className="text-sm text-gray-300">{row.age}</div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </StyledTableCell>

                                            <StyledTableCell align="center">
                                                <span className="inline-block px-3 py-1 rounded-full bg-purple-900/30 text-purple-300 text-sm font-medium">
                                                    {row.birth_date}
                                                </span>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <span className="inline-block px-3 py-1 rounded-full bg-purple-900/30 text-purple-300 text-sm font-medium">
                                                    {row.birth_date ? new Date().getFullYear() - new Date(row.birth_date).getFullYear() : 'N/A'}
                                                </span>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <div className="flex items-center justify-center gap-2 text-gray-300">
                                                    {row.role}
                                                </div>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <IconButton
                                                    onClick={() => handleShowDetails(row.id)}
                                                    size="small"
                                                    className='text-sm'
                                                    sx={{
                                                        color: '#b8a394',
                                                        '&:hover': {
                                                            size: 'small',
                                                            color: '#ff8c00',
                                                            backgroundColor: 'rgba(255, 140, 0, 0.1)',
                                                        },
                                                    }}
                                                >
                                                    <TbListDetails />
                                                </IconButton>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </DarkTableContainer>
                    </div>
                </div>
                {
                    canHandle == true ? (
                        <>
                            <div className="mt-4 p-3 mb-7 flex justify-around">
                                <button onClick={handleAddplayer} className="px-4 py-2 mr-1.5 bg-purple-900 hover:bg-purple-700 text-white rounded-md">
                                    Add Player
                                </button>
                                <button onClick={exportPlayerWithImages} className="px-4 py-2 ml-1.5 bg-orange-900 hover:bg-orange-700 text-white rounded-md">
                                    Export Player
                                </button>
                            </div>
                        </>
                    ) : (
                        <></>
                    )
                }

            </div>
        </div>
    );
}