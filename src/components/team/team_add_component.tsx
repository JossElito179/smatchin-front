import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    FormControlLabel,
    Checkbox,
    Button,
    Avatar,
    Stack,
    Card,
    CardContent,
    Grid,
    IconButton,
    Switch,
} from '@mui/material';
import {
    CloudUpload as CloudUploadIcon,
    School as SchoolIcon,
    People as PeopleIcon,
    Person as PersonIcon,
    Female as FemaleIcon,
    Male as MaleIcon,
    CheckCircle as CheckCircleIcon,
    Edit as EditIcon,
    SportsBasketballTwoTone,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { endpoint } from '../../utils/utils';


const TeamAddComponent = () => {
    const [gender, setGender] = useState<'male' | 'female' | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [groupPhotoFile, setGroupPhotoFile] = useState<File | null>(null);
    const [selectedOwner, setSelectedOwner] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [load, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);
    const navigate = useNavigate();

    async function fetchUserData() {
        try {
            setLoading(true);
            const response = await axios.get(endpoint + 'users/all');

            const data_ = response.data;

            setUserData(data_);

        } catch (error) {
            console.error('Error fetching data:', error, load);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log('Chargement initial des données');
        fetchUserData();
    }, []);


    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setLogoFile(event.target.files[0]);
        }
    };

    const handleGroupPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setGroupPhotoFile(event.target.files[0]);
        }
    };

    const handleSubmit = () => {
        const addOwnerData = async () => {
            try {
                const formData = new FormData();
                formData.append('name', teamName);
                formData.append('id_users', selectedOwner);
                formData.append('is_admin', isAdmin ? '1' : '0');
                formData.append('is_male', gender === 'male' ? '1' : '0');

                if (logoFile) {
                    formData.append('logoImg', logoFile);
                }
                if (groupPhotoFile) {
                    formData.append('teamImg', groupPhotoFile);
                }
                for (const [key, value] of formData.entries()) {
                    console.log(key, value);
                }


                const response = await axios.post(endpoint + 'teams', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setTeamName('');
                setGroupPhotoFile(null);
                setSelectedOwner('');
                setGender(null);
                setLogoFile(null);
                alert('Team added successfully!');
                console.log(response)
            } catch (error) {
                console.error('Error adding team:', error);
                alert('Failed to add team. Please try again.');
            }
        }
        addOwnerData();
    };

    return (
        <Box sx={{ py: 4, px: 2 }}>
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
            <Container maxWidth="lg">
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        overflow: 'hidden',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                    }}
                >
                    <Box sx={{ p: 4 }}>
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Stack spacing={3}>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            border: '1px solid rgba(102, 126, 234, 0.15)',
                                            borderRadius: 2,
                                            background: 'white',
                                        }}
                                    >
                                        <CardContent sx={{ p: 2.5 }}>
                                            <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                                                <Avatar
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        bgcolor: 'rgba(102, 126, 234, 0.08)',
                                                        color: '#667eea',
                                                    }}
                                                >
                                                    <SchoolIcon fontSize="small" />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                                        Team Logo
                                                    </Typography>
                                                </Box>
                                            </Stack>

                                            <Box
                                                sx={{
                                                    border: '1px dashed rgba(102, 126, 234, 0.3)',
                                                    borderRadius: 1.5,
                                                    p: 2,
                                                    textAlign: 'center',
                                                    background: 'rgba(102, 126, 234, 0.02)',
                                                }}
                                            >
                                                <CloudUploadIcon
                                                    sx={{
                                                        fontSize: 32,
                                                        color: '#667eea',
                                                        mb: 1,
                                                        opacity: 0.7,
                                                    }}
                                                />
                                                <Typography variant="body2" sx={{ mb: 1, color: '#667eea' }}>
                                                    {logoFile ? logoFile.name : 'Click to upload'}
                                                </Typography>
                                                <Button
                                                    variant="outlined"
                                                    component="label"
                                                    size="small"
                                                    sx={{
                                                        borderColor: '#667eea',
                                                        color: '#667eea',
                                                        fontSize: '0.8rem',
                                                        py: 0.5,
                                                        minWidth: 'auto',
                                                    }}
                                                >
                                                    Browse
                                                    <input
                                                        type="file"
                                                        hidden
                                                        accept="image/*"
                                                        onChange={handleLogoUpload}
                                                    />
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>

                                    <Card
                                        variant="outlined"
                                        sx={{
                                            border: '1px solid rgba(118, 75, 162, 0.15)',
                                            borderRadius: 2,
                                            background: 'white',
                                        }}
                                    >
                                        <CardContent sx={{ p: 2.5 }}>
                                            <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                                                <Avatar
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        bgcolor: 'rgba(118, 75, 162, 0.08)',
                                                        color: '#764ba2',
                                                    }}
                                                >
                                                    <PeopleIcon fontSize="small" />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                                        Group Photo
                                                    </Typography>
                                                </Box>
                                            </Stack>

                                            <Box
                                                sx={{
                                                    border: '1px dashed rgba(118, 75, 162, 0.3)',
                                                    borderRadius: 1.5,
                                                    p: 2,
                                                    textAlign: 'center',
                                                    background: 'rgba(118, 75, 162, 0.02)',
                                                }}
                                            >
                                                <PeopleIcon
                                                    sx={{
                                                        fontSize: 32,
                                                        color: '#764ba2',
                                                        mb: 1,
                                                        opacity: 0.7,
                                                    }}
                                                />
                                                <Typography variant="body2" sx={{ mb: 1, color: '#764ba2' }}>
                                                    {groupPhotoFile ? groupPhotoFile.name : 'Click to upload'}
                                                </Typography>
                                                <Button
                                                    variant="outlined"
                                                    component="label"
                                                    size="small"
                                                    sx={{
                                                        borderColor: '#764ba2',
                                                        color: '#764ba2',
                                                        fontSize: '0.8rem',
                                                        py: 0.5,
                                                        minWidth: 'auto',
                                                    }}
                                                >
                                                    Browse
                                                    <input
                                                        type="file"
                                                        hidden
                                                        accept="image/*"
                                                        onChange={handleGroupPhotoUpload}
                                                    />
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Stack>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        border: '1px solid rgba(255, 107, 53, 0.15)',
                                        borderRadius: 2,
                                        background: 'white',
                                        height: '100%',
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
                                            <Avatar
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    bgcolor: 'rgba(255, 107, 53, 0.08)',
                                                    color: '#ff6b35',
                                                }}
                                            >
                                                <PersonIcon fontSize="small" />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                                    Owner & Team Information
                                                </Typography>
                                            </Box>
                                        </Stack>

                                        <Stack spacing={3}>
                                            <Box sx={{ mb: 4 }}>
                                                <Typography variant="subtitle2" sx={{ mb: 2, color: '#666', fontWeight: 500 }}>
                                                    Team Name
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        border: '1px solid rgba(0, 0, 0, 0.1)',
                                                        borderRadius: 2,
                                                        p: 1.5,
                                                        background: 'white',
                                                        transition: 'all 0.3s ease',
                                                        '&:focus-within': {
                                                            borderColor: '#ff6b35',
                                                            boxShadow: '0 0 0 2px rgba(255, 107, 53, 0.1)',
                                                        },
                                                    }}
                                                >
                                                    <SportsBasketballTwoTone sx={{ mr: 2, color: 'rgba(0, 0, 0, 0.3)' }} />
                                                    <input
                                                        type="text"
                                                        value={teamName}
                                                        onChange={(e) => setTeamName(e.target.value)}
                                                        placeholder="Enter team name"
                                                        style={{
                                                            border: 'none',
                                                            outline: 'none',
                                                            width: '100%',
                                                            fontSize: '16px',
                                                            background: 'transparent',
                                                            color: '#333',
                                                        }}
                                                    />
                                                    {teamName && (
                                                        <IconButton size="small">
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    )}
                                                </Box>
                                            </Box>

                                            <Box sx={{ mb: 4 }}>
                                                <Typography variant="subtitle2" sx={{ mb: 2, color: '#666', fontWeight: 500 }}>
                                                    Owner name
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        border: '1px solid rgba(0, 0, 0, 0.1)',
                                                        borderRadius: 2,
                                                        p: 1.5,
                                                        background: 'white',
                                                        transition: 'all 0.3s ease',
                                                        '&:focus-within': {
                                                            borderColor: '#ff6b35',
                                                            boxShadow: '0 0 0 2px rgba(255, 107, 53, 0.1)',
                                                        },
                                                    }}
                                                >
                                                    <PersonIcon sx={{ mr: 2, color: 'rgba(0, 0, 0, 0.3)' }} />

                                                    <select
                                                        value={selectedOwner}
                                                        onChange={(e) => setSelectedOwner(e.target.value)}
                                                        style={{
                                                            border: 'none',
                                                            outline: 'none',
                                                            width: '100%',
                                                            fontSize: '16px',
                                                            background: 'transparent',
                                                            color: '#333',
                                                            appearance: 'none',
                                                            WebkitAppearance: 'none',
                                                            MozAppearance: 'none',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        <option value="" disabled>
                                                            Select owner
                                                        </option>
                                                        {
                                                            userData && userData.map((user: any) => (
                                                                <option key={user.id} value={user.id}>
                                                                    {user.name} {user.first_name}
                                                                </option>
                                                            ))
                                                        }
                                                    </select>

                                                    {selectedOwner && (
                                                        <IconButton size="small">
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    )}
                                                </Box>

                                            </Box>


                                            <Box>
                                                <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
                                                    <Box>
                                                        <FormControlLabel
                                                            control={
                                                                <Switch
                                                                    size="small"
                                                                    checked={isAdmin}
                                                                    onChange={(e) => setIsAdmin(e.target.checked)}
                                                                    color="primary"
                                                                />
                                                            }
                                                            label={
                                                                <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                                    Is Admin
                                                                </Typography>
                                                            }
                                                        />
                                                    </Box>
                                                </Stack>
                                                <Typography variant="subtitle2" sx={{ color: '#666', fontWeight: 500 }}>
                                                    Gender
                                                </Typography>
                                                <Stack direction="row" spacing={3}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={gender === 'male'}
                                                                onChange={() => setGender(gender === 'male' ? null : 'male')}
                                                                icon={
                                                                    <Box
                                                                        sx={{
                                                                            width: 24,
                                                                            height: 24,
                                                                            border: '2px solid rgba(0, 0, 0, 0.2)',
                                                                            borderRadius: '50%',
                                                                        }}
                                                                    />
                                                                }
                                                                checkedIcon={
                                                                    <Box
                                                                        sx={{
                                                                            width: 24,
                                                                            height: 24,
                                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                            borderRadius: '50%',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            color: 'white',
                                                                        }}
                                                                    >
                                                                        <CheckCircleIcon fontSize="small" />
                                                                    </Box>
                                                                }
                                                            />
                                                        }
                                                        label={
                                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                                <MaleIcon sx={{ color: '#667eea' }} />
                                                                <Typography>Male</Typography>
                                                            </Stack>
                                                        }
                                                        sx={{
                                                            '& .MuiFormControlLabel-label': {
                                                                color: gender === 'male' ? '#667eea' : 'inherit',
                                                                fontWeight: gender === 'male' ? 600 : 400,
                                                            },
                                                        }}
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={gender === 'female'}
                                                                onChange={() => setGender(gender === 'female' ? null : 'female')}
                                                                icon={
                                                                    <Box
                                                                        sx={{
                                                                            width: 24,
                                                                            height: 24,
                                                                            border: '2px solid rgba(0, 0, 0, 0.2)',
                                                                            borderRadius: '50%',
                                                                        }}
                                                                    />
                                                                }
                                                                checkedIcon={
                                                                    <Box
                                                                        sx={{
                                                                            width: 24,
                                                                            height: 24,
                                                                            background: 'linear-gradient(135deg, #ff6b35 0%, #ffa726 100%)',
                                                                            borderRadius: '50%',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            color: 'white',
                                                                        }}
                                                                    >
                                                                        <CheckCircleIcon fontSize="small" />
                                                                    </Box>
                                                                }
                                                            />
                                                        }
                                                        label={
                                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                                <FemaleIcon sx={{ color: '#ff6b35' }} />
                                                                <Typography>Female</Typography>
                                                            </Stack>
                                                        }
                                                        sx={{
                                                            '& .MuiFormControlLabel-label': {
                                                                color: gender === 'female' ? '#ff6b35' : 'inherit',
                                                                fontWeight: gender === 'female' ? 600 : 400,
                                                            },
                                                        }}
                                                    />
                                                </Stack>
                                            </Box>

                                            {/* Submit Button */}
                                            <Box sx={{ textAlign: 'center', pt: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    size="medium"
                                                    onClick={handleSubmit}
                                                    startIcon={<CheckCircleIcon />}
                                                    sx={{
                                                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                                        color: 'white',
                                                        px: 4,
                                                        py: 1,
                                                        borderRadius: 2,
                                                        fontSize: '0.9rem',
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    Add Team
                                                </Button>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default TeamAddComponent;