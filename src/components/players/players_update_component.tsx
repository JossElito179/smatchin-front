import { CakeOutlined, CheckBox, People, Person, Person2, SportsBasketballOutlined } from "@mui/icons-material";
import { Avatar, Box, Button, Card, CardContent, Container, FormControlLabel, Grid, IconButton, Paper, Stack, Switch, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { VscFileBinary } from "react-icons/vsc";
import {
    Edit as EditIcon,
} from '@mui/icons-material';
import { endpoint, endpointFile } from "../../utils/utils";

const PlayerUpdateComponent = ({ id_player }: string | any) => {
    const [player, setPlayer] = useState<any>(null);
    const [profilFile, setprofilFile] = useState<File | null>(null);
    const [baccFile, setbaccFile] = useState<File | null>(null);
    const [cinFile, setcinFile] = useState<File | null>(null);
    const [playerName, setplayerName] = useState('');
    const [firstname, setFirstname] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [positions, setpositions] = useState('');
    const [isStarter, setIsStarter] = useState(false);
    const [id_team, setId_team] = useState(false);
    const [positionData, setPositionData] = useState<any>(null);
    const [load, setLoading] = useState(true);
    const [selectedPosition, setSelectedPosition] = useState<string>('');
    const [existingProfil, setExistingProfil] = useState<string | null>(null);
    const [existingBacc, setExistingBacc] = useState<string | null>(null);
    const [existingCin, setExistingCin] = useState<string | null>(null);

    async function fetchPositionData() {
        try {
            setLoading(true);
            const response = await axios.get(endpoint+'positions');

            const data_ = response.data;

            setPositionData(data_);
            console.log('Fetched position data:', data_);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log('Chargement initial des données');
        fetchPositionData();
        fetchPlayer();
    }, []);


    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setprofilFile(event.target.files[0]);
        }
    };

    const handleBaccUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setbaccFile(event.target.files[0]);
        }
    };

    const handleCinUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setcinFile(event.target.files[0]);
        }
    };

    async function fetchPlayer() {
        try {
            setLoading(true);
            const response = await axios.get(endpoint+'players/' + id_player);

            const data_ = response.data;
            setPlayer(data_);
            setplayerName(data_.name);
            setFirstname(data_.first_name);
            setBirthdate(data_.birth_date);
            setSelectedPosition(data_.id_positions);
            setIsStarter(data_.is_starter);
            setId_team(data_.id_teams)
            console.log('Fetched player data:', data_);

            setExistingProfil(data_.profil_img);
            setExistingBacc(data_.bacc_file);
            setExistingCin(data_.cin_file);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = () => {
        const addOwnerData = async () => {
            try {

                const formData = new FormData();
                formData.append('name', playerName);
                formData.append('first_name', firstname);
                formData.append('birth_date', birthdate);
                formData.append('id_positions', selectedPosition);
                formData.append('is_starter', isStarter ? 'true' : 'false');
                formData.append('id_teams', id_team + '');


                if (profilFile) {
                    formData.append('profilImg', profilFile);
                }
                if (baccFile) {
                    formData.append('baccFile', baccFile);
                }
                if (cinFile) {
                    formData.append('cinFile', cinFile);
                }

                for (const [key, value] of formData.entries()) {
                    console.log(key, value);
                }
                const response = await axios.put(endpoint+'players/' + id_player, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                alert('Player update successfully!');
            } catch (error) {
                console.error('Error adding team:', error);
                alert('Failed to update players. Please try again.');
            }
        }
        addOwnerData();
    };

    return (
        <Box sx={{ py: 4, px: 2 }}>
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
                                                <Person fontSize="small" />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                                    Player Information
                                                </Typography>
                                            </Box>
                                        </Stack>

                                        <Stack spacing={3}>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ mb: 1, color: '#666', fontWeight: 500, fontSize: '0.85rem' }}>
                                                    Player name
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    value={playerName}
                                                    onChange={(e) => setplayerName(e.target.value)}
                                                    placeholder="Enter player's name"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <Person2 sx={{ mr: 1, color: 'rgba(0, 0, 0, 0.3)', fontSize: '1rem' }} />
                                                        ),
                                                    }}
                                                />
                                            </Box>

                                            <Box>
                                                <Typography variant="subtitle2" sx={{ mb: 1, color: '#666', fontWeight: 500, fontSize: '0.85rem' }}>
                                                    First name
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    value={firstname}
                                                    onChange={(e) => setFirstname(e.target.value)}
                                                    placeholder="Enter first name"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <Person2 sx={{ mr: 1, color: 'rgba(0, 0, 0, 0.3)', fontSize: '1rem' }} />
                                                        ),
                                                    }}
                                                />
                                            </Box>

                                            <Box>
                                                <Typography variant="subtitle2" sx={{ mb: 1, color: '#666', fontWeight: 500, fontSize: '0.85rem' }}>
                                                    Birth date
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    type="date"
                                                    value={birthdate}
                                                    onChange={(e) => setBirthdate(e.target.value)}
                                                    InputLabelProps={{ shrink: true }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <CakeOutlined sx={{ mr: 1, color: 'rgba(0, 0, 0, 0.3)', fontSize: '1rem' }} />
                                                        ),
                                                    }}
                                                />
                                            </Box>

                                            <Box sx={{ mb: 4 }}>
                                                <Typography variant="subtitle2" sx={{ mb: 2, color: '#666', fontWeight: 500 }}>
                                                    Position
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
                                                    <SportsBasketballOutlined sx={{ mr: 1, color: 'rgba(0, 0, 0, 0.3)', fontSize: '1rem' }} />

                                                    <select
                                                        value={selectedPosition}
                                                        onChange={(e) => setSelectedPosition(e.target.value)}
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
                                                            Select position
                                                        </option>
                                                        {
                                                            positionData && positionData.map((position: any) => (
                                                                <option key={position.id_positions} value={position.id_positions}>
                                                                    {position.name} {position.acronym}
                                                                </option>
                                                            ))
                                                        }
                                                    </select>

                                                    {selectedPosition && (
                                                        <IconButton size="small">
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    )}
                                                </Box>

                                            </Box>
                                            <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
                                                <Avatar
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        bgcolor: 'rgba(118, 75, 162, 0.08)',
                                                        color: '#764ba2',
                                                    }}
                                                >
                                                    <VscFileBinary fontSize="small" />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                                        Profile Photo
                                                    </Typography>
                                                </Box>
                                            </Stack>

                                            <Box
                                                sx={{
                                                    border: '1px dashed rgba(118, 75, 162, 0.3)',
                                                    borderRadius: 1.5,
                                                    p: 4,
                                                    textAlign: 'center',
                                                    background: 'rgba(118, 75, 162, 0.02)',
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    minHeight: '200px',
                                                }}
                                            >
                                                {profilFile ? (
                                                    <>
                                                        <Avatar
                                                            src={URL.createObjectURL(profilFile)}
                                                            sx={{ width: 120, height: 120, mb: 2 }}
                                                        />
                                                        <Typography variant="body2" sx={{ color: '#764ba2', mb: 2 }}>
                                                            {profilFile.name}
                                                        </Typography>
                                                    </>
                                                ) : (
                                                    <>
                                                        <People
                                                            sx={{
                                                                fontSize: 64,
                                                                color: '#764ba2',
                                                                mb: 2,
                                                                opacity: 0.7,
                                                            }}
                                                        />
                                                        <Typography variant="body2" sx={{ color: '#764ba2', mb: 2 }}>
                                                            Click to upload profile photo
                                                        </Typography>
                                                    </>
                                                )}
                                                <Button
                                                    variant="outlined"
                                                    component="label"
                                                    size="small"
                                                    sx={{
                                                        borderColor: '#764ba2',
                                                        color: '#764ba2',
                                                        fontSize: '0.8rem',
                                                        py: 0.5,
                                                    }}
                                                >
                                                    {profilFile ? 'Change Photo' : 'Browse'}
                                                    <input
                                                        type="file"
                                                        hidden
                                                        accept="image/*"
                                                        onChange={handleLogoUpload}
                                                    />
                                                </Button>
                                                <div className="flex justify-center">
                                                    <img
                                                        style={{ width: 100 }}
                                                        src={
                                                            profilFile
                                                                ? URL.createObjectURL(profilFile)
                                                                : existingProfil
                                                                    ? `${endpointFile}${existingProfil}`
                                                                    : '/placeholder.png'
                                                        }
                                                        alt="no file added"
                                                    />
                                                </div>
                                                {profilFile && (
                                                    <Button
                                                        size="small"
                                                        sx={{ mt: 1, fontSize: '0.8rem' }}
                                                        onClick={() => setprofilFile(null)}
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        border: '1px solid rgba(118, 75, 162, 0.15)',
                                        borderRadius: 2,
                                        background: 'white',
                                        height: '100%',
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
                                            <Box>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            size="small"
                                                            checked={isStarter}
                                                            onChange={(e) => setIsStarter(e.target.checked)}
                                                            color="primary"
                                                        />
                                                    }
                                                    label={
                                                        <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                            Is starter
                                                        </Typography>
                                                    }
                                                />
                                            </Box>
                                        </Stack>
                                        <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>

                                            <Avatar
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    bgcolor: 'rgba(118, 75, 162, 0.08)',
                                                    color: '#764ba2',
                                                }}
                                            >
                                                <VscFileBinary fontSize="small" />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                                    Bacc File
                                                </Typography>
                                            </Box>
                                        </Stack>

                                        <Stack spacing={3}>
                                            <Box
                                                sx={{
                                                    border: '1px dashed rgba(118, 75, 162, 0.3)',
                                                    borderRadius: 1.5,
                                                    p: 4,
                                                    textAlign: 'center',
                                                    background: 'rgba(118, 75, 162, 0.02)',
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    minHeight: '200px',
                                                }}
                                            >
                                                { baccFile ? (
                                                    <>
                                                        <Avatar
                                                            src={URL.createObjectURL(baccFile)}
                                                            sx={{ width: 120, height: 120, mb: 2 }}
                                                        />
                                                        <Typography variant="body2" sx={{ color: '#764ba2', mb: 2 }}>
                                                            {baccFile.name}
                                                        </Typography>
                                                    </>
                                                ) : existingBacc ? (
                                                    <>
                                                        <People
                                                            sx={{
                                                                fontSize: 64,
                                                                color: '#764ba2',
                                                                mb: 2,
                                                                opacity: 0.7,
                                                            }}
                                                        />
                                                        <Typography variant="body2" sx={{ color: '#764ba2', mb: 2 }}>
                                                            {existingBacc}
                                                        </Typography>        
                                                    </>
                                                ) : (
                                                    <>
                                                        <People
                                                            sx={{
                                                                fontSize: 64,
                                                                color: '#764ba2',
                                                                mb: 2,
                                                                opacity: 0.7,
                                                            }}
                                                        />
                                                        <Typography variant="body2" sx={{ color: '#764ba2', mb: 2 }}>
                                                            Click to upload the bacc file
                                                        </Typography>
                                                    </>
                                                )}
                                                <Button
                                                    variant="outlined"
                                                    component="label"
                                                    size="small"
                                                    sx={{
                                                        borderColor: '#764ba2',
                                                        color: '#764ba2',
                                                        fontSize: '0.8rem',
                                                        py: 0.5,
                                                    }}
                                                >
                                                    {baccFile ? 'Change Photo' : 'Browse'}
                                                    <input
                                                        type="file"
                                                        hidden
                                                        accept="image/*"
                                                        onChange={handleBaccUpload}
                                                    />
                                                </Button>
                                                {baccFile && (
                                                    <Button
                                                        size="small"
                                                        sx={{ mt: 1, fontSize: '0.8rem' }}
                                                        onClick={() => setbaccFile(null)}
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </Box>
                                        </Stack>
                                        <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>

                                            <Avatar
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    bgcolor: 'rgba(118, 75, 162, 0.08)',
                                                    color: '#764ba2',
                                                }}
                                            >
                                                <VscFileBinary fontSize="small" />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                                    CIN File
                                                </Typography>
                                            </Box>
                                        </Stack>

                                        <Stack spacing={3}>
                                            <Box
                                                sx={{
                                                    border: '1px dashed rgba(118, 75, 162, 0.3)',
                                                    borderRadius: 1.5,
                                                    p: 4,
                                                    textAlign: 'center',
                                                    background: 'rgba(118, 75, 162, 0.02)',
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    minHeight: '200px',
                                                }}
                                            >
                                                {cinFile ? (
                                                    <>
                                                        <Avatar
                                                            src={URL.createObjectURL(cinFile)}
                                                            sx={{ width: 120, height: 120, mb: 2 }}
                                                        />
                                                        <Typography variant="body2" sx={{ color: '#764ba2', mb: 2 }}>
                                                            {cinFile.name}
                                                        </Typography>
                                                    </>
                                                    ) : existingCin ? (
                                                    <>
                                                        <People
                                                            sx={{
                                                                fontSize: 64,
                                                                color: '#764ba2',
                                                                mb: 2,
                                                                opacity: 0.7,
                                                            }}
                                                        />
                                                        <Typography variant="body2" sx={{ color: '#764ba2', mb: 2 }}>
                                                            {existingCin}
                                                        </Typography>        
                                                    </>
                                                ) : (
                                                    <>
                                                        <People
                                                            sx={{
                                                                fontSize: 64,
                                                                color: '#764ba2',
                                                                mb: 2,
                                                                opacity: 0.7,
                                                            }}
                                                        />
                                                        <Typography variant="body2" sx={{ color: '#764ba2', mb: 2 }}>
                                                            Click to upload CIN file
                                                        </Typography>
                                                    </>
                                                )}
                                                <Button
                                                    variant="outlined"
                                                    component="label"
                                                    size="small"
                                                    sx={{
                                                        borderColor: '#764ba2',
                                                        color: '#764ba2',
                                                        fontSize: '0.8rem',
                                                        py: 0.5,
                                                    }}
                                                >
                                                    {cinFile ? 'Change Photo' : 'Browse'}
                                                    <input
                                                        type="file"
                                                        hidden
                                                        accept="image/*"
                                                        onChange={handleCinUpload}
                                                    />
                                                </Button>
                                                {cinFile && (
                                                    <Button
                                                        size="small"
                                                        sx={{ mt: 1, fontSize: '0.8rem' }}
                                                        onClick={() => setcinFile(null)}
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </Box>
                                        </Stack>
                                        <Stack spacing={3}>
                                            <Box sx={{ textAlign: 'center', pt: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    size="medium"
                                                    onClick={handleSubmit}
                                                    startIcon={<CheckBox />}
                                                    sx={{
                                                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                                        color: 'white',
                                                        px: 4,
                                                        py: 1,
                                                        borderRadius: 2,
                                                        fontSize: '0.9rem',
                                                        fontWeight: 500,
                                                        width: '100%',
                                                    }}
                                                >
                                                    Update Player
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

export default PlayerUpdateComponent;