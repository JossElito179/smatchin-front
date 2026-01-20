import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import { AiOutlineDribbble } from "react-icons/ai";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import {
    Person,
    Groups,
    AccountCircle,
} from '@mui/icons-material';
import { VscFileMedia } from 'react-icons/vsc';
import { useEffect, useState } from 'react';
import axios from 'axios';
import type { itemTeam } from '../../utils/entity';
import TeamActions from './team_action_component';
import TeamActionsAvaibs from './team_actions_avaibs';
import { endpoint, endpointFile } from '../../utils/utils';

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
    logo: string,
    id_owner: number,
    owner: string,
    is_male: boolean,
    total_members: number
) {
    return { id, name, logo, id_owner, owner, is_male, total_members };
}


export default function TeamListComponent() {
    const [load, setLoading] = useState(true);
    const [rows, setRows] = useState<itemTeam[]>([]);
    const [canHandledResponse, setCanHandledResponse] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const userId = localStorage.getItem('id_user');
    const [user, setUser] = useState<any>(null);
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [genderFilter, setGenderFilter] = useState<string>('all');
    const id_user = localStorage.getItem('id_user');

    const handleViewDetails = (teamId: number) => {
        console.log('Voir détails:', teamId);
    };

    const handleViewPlayers = (teamId: number) => {
        console.log('Voir joueurs:', teamId);
    };

    const handleUpdate = (teamId: number) => {
        console.log('Modifier:', teamId, load);
    };

    const handleRemove = async (teamId: number) => {
        setLoadingId(teamId);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Supprimer:', teamId);
        } finally {
            setLoadingId(null);
        }
    };


    async function fetchUserRole() {
        try {
            setLoading(true);
            const response = await axios.get(endpoint + 'users/find/' + userId);
            setUser(response.data);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGenderFilter(event.target.value);
    };


    async function fetchCanHandle() {
        try {
            const response = await axios.post(endpoint + 'teams/all/with-search/user-id', {
                query: searchTerm || '',
                id_user: userId
            });
            setCanHandledResponse(response.data);
            console.log(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    async function fetchData(searchTerm?: string, isMaleVals = 'all') {
        try {
            setLoading(true);

            console.log('User role:', user?.role);
            if (user?.role == false) {
                await fetchCanHandle();
                console.log('nandalo tato')
            }
            const response = await axios.post(endpoint + 'teams/all/with-search', {
                query: searchTerm || '',
                is_male: isMaleVals === 'all' ? null : isMaleVals === 'male' ? true : false

            });

            const data_ = response.data;

            const preRows = data_.map((item: any) =>
                createData(
                    item.id,
                    item.name,
                    item.logo,
                    item.user.id,
                    item.user.name + ' ' + item.user.first_name,
                    item.is_male,
                    item.players.length
                )
            );

            setRows(preRows);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUserRole();
    }, []);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);


    useEffect(() => {
        console.log('Chargement initial des données');
        fetchData(searchTerm, genderFilter);
    }, [searchTerm, genderFilter]);


    return (
        <div>
            <div className="search-container flex items-center w-full justify-center mb-5">
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search owners/ teams..." className="search-input p-3 m-5 rounded bg-gray-800 border border-gray-700 w-1/3" />
            </div>
            <div className="filter-container flex items-center justify-center -mt-9">
                <FormControl>
                    <RadioGroup
                        row
                        value={genderFilter}
                        onChange={handleGenderChange}
                        name="is_male">
                        <FormControlLabel value="all"
                            control={
                                <Radio
                                    sx={{
                                        color: "#fcf7ff",
                                        "&.Mui-checked": { color: "#9c27b0" },
                                        "&.Mui-focusVisible": {
                                            outline: "2px solid #9c27b0",
                                            outlineOffset: "2px",
                                        },
                                    }}
                                />
                            }
                            label="All"
                        />
                        <FormControlLabel value="male"
                            control={
                                <Radio
                                    sx={{
                                        color: "#fcf7ff",
                                        "&.Mui-checked": { color: "#9c27b0" },
                                        "&.Mui-focusVisible": {
                                            outline: "2px solid #9c27b0",
                                            outlineOffset: "2px",
                                        },
                                    }}
                                />
                            }
                            label="Male"
                        />
                        <FormControlLabel value="female"
                            control={
                                <Radio
                                    sx={{
                                        color: "#fcf7ff",
                                        "&.Mui-checked": { color: "#9c27b0" },
                                        "&.Mui-focusVisible": {
                                            outline: "2px solid #9c27b0",
                                            outlineOffset: "2px",
                                        },
                                    }}
                                />
                            }
                            label="Female"
                        />
                    </RadioGroup>
                </FormControl>
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
                                                Team name
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Groups fontSize="small" className="text-orange-200" />
                                                Team gender
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <div className="flex items-center justify-center gap-2">
                                                <AiOutlineDribbble fontSize="small" className="text-orange-200" />
                                                Total members
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <div className="flex items-center justify-center gap-2">
                                                <AccountCircle fontSize="small" className="text-orange-200" />
                                                Owner
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">Actions</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row, index) => (
                                        <StyledTableRow
                                            key={index}
                                            className={`group ${id_user === row.id_owner+'' ? 'bg-linear-to-r from-amber-950/20 to-amber-950/10 border-l-4 border-l-amber-500' : ''}`}
                                        >
                                            <StyledTableCell component="th" scope="row">
                                                <div className="flex">
                                                    <div className="flex items-center gap-3">
                                                        {
                                                            row.logo ? (
                                                                <div className='rounded-full w-10 h-10 hover:scale(1.1)'>
                                                                    <a
                                                                        href={`${endpointFile}${row.logo}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        <img
                                                                            src={`${endpointFile}${row.logo}`}
                                                                            alt={`${row.name}`}
                                                                            className="w-full h-full object-cover transition-all hover:scale-110 rounded-full"
                                                                        />
                                                                    </a>
                                                                </div>
                                                            ) : (
                                                                <Avatar
                                                                    sx={{
                                                                        width: 36,
                                                                        height: 36,
                                                                        bgcolor: user?.id === row.id_owner ? 'rgba(255, 140, 0, 0.2)' : 'rgba(255, 140, 0, 0.1)',
                                                                        border: user?.id === row.id_owner ? '2px solid rgba(255, 140, 0, 0.5)' : '1px solid rgba(255, 140, 0, 0.3)',
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
                                                                </Avatar>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="flex items-center gap-3 ml-3">
                                                        <div>
                                                            <div className={`font-semibold ${user?.id === row.id_owner ? 'text-amber-300' : 'text-white'}`}>
                                                                {row.name}
                                                            </div>
                                                            {/* <div className="text-sm text-gray-300">{row.logo}</div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {
                                                    row.is_male === true ? (
                                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${user?.id === row.id_owner
                                                                ? 'bg-amber-800/40 text-amber-200 border border-amber-700/50'
                                                                : 'bg-amber-900/30 text-amber-300'
                                                            }`}>
                                                            Male
                                                        </span>
                                                    ) : (
                                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${user?.id === row.id_owner
                                                                ? 'bg-pink-800/40 text-pink-200 border border-pink-700/50'
                                                                : 'bg-pink-900/30 text-pink-300'
                                                            }`}>
                                                            Female
                                                        </span>
                                                    )
                                                }
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${user?.id === row.id_owner
                                                        ? 'bg-purple-800/40 text-purple-200 border border-purple-700/50'
                                                        : 'bg-purple-900/30 text-purple-300'
                                                    }`}>
                                                    {row.total_members}
                                                </span>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <div className={`flex items-center justify-center gap-2 ${user?.id === row.id_owner ? 'text-amber-300' : 'text-gray-300'
                                                    }`}>
                                                    {row.owner}
                                                    {user?.id === row.id_owner && (
                                                        <span className="ml-1 text-amber-400 text-xs font-semibold">(You)</span>
                                                    )}
                                                </div>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {
                                                    user?.role == true ? (
                                                        <TeamActions
                                                            team={row}
                                                            onViewDetails={handleViewDetails}
                                                            onViewPlayers={handleViewPlayers}
                                                            onUpdate={handleUpdate}
                                                            onRemove={handleRemove}
                                                            loading={loadingId === row.id}
                                                        />
                                                    ) : user?.role == false && Array.isArray(canHandledResponse) &&
                                                        canHandledResponse.some((p: any) => p.id === row.id) ? (
                                                        <TeamActions
                                                            team={row}
                                                            onViewDetails={handleViewDetails}
                                                            onViewPlayers={handleViewPlayers}
                                                            onUpdate={handleUpdate}
                                                            onRemove={handleRemove}
                                                            loading={loadingId === row.id}
                                                        />
                                                    ) : (
                                                        <TeamActionsAvaibs
                                                            team={row}
                                                            onViewDetails={handleViewDetails}
                                                            onViewPlayers={handleViewPlayers}
                                                            onUpdate={handleUpdate}
                                                            onRemove={handleRemove}
                                                            loading={loadingId === row.id}
                                                        />
                                                    )
                                                }
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </DarkTableContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}