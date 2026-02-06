import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Avatar, FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import {
  Phone,
  Person,
  Groups,
  AccountCircle,
  Email
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import type { itemOwner } from '../../utils/entity';
import OwnerActions from './owner_action_component';
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
  phone_number: string,
  email: string,
  team: string,
  profil_img?: string,
) {
  return { id, name, first_name, phone_number, email, team, profil_img };
}

export default function OwnerListCom() {
  const [load, setLoading] = useState(true);
  const [rows, setRows] = useState<itemOwner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [genderFilter, setGenderFilter] = useState<string>('all');

  const handleUpdate = (teamId: number) => {
    console.log('Modifier:', teamId);
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

  function formatTeams(teams: any[]) {
    console.log(teams)
    if (!teams || teams.length === 0) return 'No Team';

    const map = new Map<string, { male: boolean; female: boolean }>();

    teams.forEach(team => {
      if (!map.has(team.name)) {
        map.set(team.name, { male: false, female: false });
      }

      if (team.is_male) {
        map.get(team.name)!.male = true;
      } else {
        map.get(team.name)!.female = true;
      }
    });

    return Array.from(map.entries())
      .map(([name, gender]) => {
        if (gender.male && gender.female) return `${name} H/D`;
        if (gender.male) return `${name} H`;
        return `${name} D`;
      })
      .join(', ');
  }

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGenderFilter(event.target.value);
  };


  async function fetchData(searchTerm?: string, isMaleVals = 'all') {
    try {
      if (!searchTerm) {
        setLoading(true);
      }
      console.log(isMaleVals === 'all' ? null : isMaleVals === 'male' ? true : false)
      const response = await axios.post(endpoint + 'users/all/with-search', {
        query: searchTerm || '',
        is_male: isMaleVals === 'all' ? null : isMaleVals === 'male' ? true : false
      });

      console.log('response', response, load)
      const data_ = response.data;

      const preRows = data_.map((item: any) =>
        createData(
          item.id,
          item.name,
          item.first_name,
          item.phone_number,
          item.email,
          formatTeams(item.teams),
          item.profil_img
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
    console.log('Chargement initial des données');
    fetchData('', 'all');
  }, []);

  useEffect(() => {
    console.log('Chargement initial des données');
    fetchData(searchTerm, genderFilter);
  }, [searchTerm, genderFilter]);

  if (load) {
    return (
      <LoadingSpinner text="Loading owner list..." />
    )
  }


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
                        Full Name
                      </div>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <div className="flex items-center justify-center gap-2">
                        <Email fontSize="small" className="text-orange-200" />
                        Email
                      </div>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <div className="flex items-center justify-center gap-2">
                        <Phone fontSize="small" className="text-orange-200" />
                        Phone Number
                      </div>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <div className="flex items-center justify-center gap-2">
                        <Groups fontSize="small" className="text-orange-200" />
                        Team
                      </div>
                    </StyledTableCell>
                    <StyledTableCell align="center">Profile</StyledTableCell>
                    <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <StyledTableRow key={index} className="group">
                      <StyledTableCell component="th" scope="row">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-semibold text-white">{row.name}</div>
                            <div className="text-sm text-gray-300">{row.first_name}</div>
                          </div>
                        </div>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <span className="inline-block px-3 py-1 rounded-full bg-purple-900/30 text-purple-300 text-sm font-medium">
                          {row.email}
                        </span>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <div className="flex items-center justify-center gap-2 text-gray-300">
                          <Phone fontSize="small" className="text-amber-300" />
                          {row.phone_number}
                        </div>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <span className={`px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-900/40 text-purple-300`}>
                          {row.team}
                        </span>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <div className="flex justify-center">
                          {
                            row.profil_img ? (
                              <div className='rounded-full w-10 h-10 transition-all hover:scale-110'>
                                <a
                                  href={row.profil_img}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    src={row.profil_img}
                                    alt={`${row.first_name} ${row.name}`}
                                    className="w-full h-full object-cover rounded-full"
                                  />
                                </a>

                              </div>
                            ) : (
                              <>
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
                                  <AccountCircle />
                                </Avatar>
                              </>
                            )
                          }

                        </div>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <OwnerActions
                          owner={row}
                          onUpdate={handleUpdate}
                          onRemove={handleRemove}
                          loading={loadingId === row.id}
                        />
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