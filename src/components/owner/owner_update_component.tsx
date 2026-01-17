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
    TextField,
    IconButton,
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
    Person2,
    Phone,
    Email,
} from '@mui/icons-material';
import { VscFileBinary } from 'react-icons/vsc';
import axios from 'axios';
import { endpoint, endpointFile } from '../../utils/utils';



const OwnerUpdateComponent = ({ id_user }: string | any) => {
    const [user, setUser] = useState<any>(null);
    const [profilImg, setProfilImg] = useState<File | null>(null);
    const [ownerName, setOwnerName] = useState('');
    const [firstname, setFirstname] = useState('');
    const [phone_number, setPhone_number] = useState('');
    const [load, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [existingProfil, setExistingProfil] = useState<string | null>(null);


    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setProfilImg(event.target.files[0]);
        }
    };

    async function fetchUser() {
        try {
            setLoading(true);
            const response = await axios.get(endpoint + 'users/' + id_user);

            const data_ = response.data;
            setUser(data_);
            setOwnerName(data_.name);
            setFirstname(data_.first_name);
            setPhone_number(data_.phone_number);
            setEmail(data_.email)
            console.log('Fetched player data:', data_);

            setExistingProfil(data_.profil_img);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log('Chargement initial des données');
        fetchUser();
    }, []);

    const handleSubmit = () => {
        const addOwnerData = async () => {
            try {

                const formData = new FormData();
                formData.append('name', ownerName);
                formData.append('first_name', firstname);
                formData.append('email', email);
                formData.append('phone_number', phone_number);

                if (profilImg) {
                    formData.append('profilImg', profilImg);
                }

                const response = await axios.put(endpoint + 'users/' + id_user, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                alert('Data of the user updated with success')
                setEmail('');
                setOwnerName('');
                setFirstname('');
                setPhone_number('');
                setProfilImg(null);
            } catch (error) {
                console.error('Error adding owner:', error);
                alert('Failed to add owner. Please try again.');
            }
        }
        addOwnerData();
    };


    return (
        <Box>
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
                        <Grid >
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
                                                Owner Information
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    <Stack spacing={3}>
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
                                                <input
                                                    type="text"
                                                    value={ownerName}
                                                    onChange={(e) => setOwnerName(e.target.value)}
                                                    placeholder="Enter owner's name"
                                                    style={{
                                                        border: 'none',
                                                        outline: 'none',
                                                        width: '100%',
                                                        fontSize: '16px',
                                                        background: 'transparent',
                                                        color: '#333',
                                                    }}
                                                />
                                                {ownerName && (
                                                    <IconButton size="small">
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </Box>

                                        <Box sx={{ mb: 4 }}>
                                            <Typography variant="subtitle2" sx={{ mb: 2, color: '#666', fontWeight: 500 }}>
                                                First name
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
                                                <Person2 sx={{ mr: 2, color: 'rgba(0, 0, 0, 0.3)' }} />
                                                <input
                                                    type="text"
                                                    value={firstname}
                                                    onChange={(e) => setFirstname(e.target.value)}
                                                    placeholder="Enter first name"
                                                    style={{
                                                        border: 'none',
                                                        outline: 'none',
                                                        width: '100%',
                                                        fontSize: '16px',
                                                        background: 'transparent',
                                                        color: '#333',
                                                    }}
                                                />
                                                {firstname && (
                                                    <IconButton size="small">
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </Box>

                                        <Box sx={{ mb: 4 }}>
                                            <Typography variant="subtitle2" sx={{ mb: 2, color: '#666', fontWeight: 500 }}>
                                                Email *
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
                                                <Email sx={{ mr: 2, color: 'rgba(0, 0, 0, 0.3)' }} />
                                                <input
                                                    type="text"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="Enter email"
                                                    style={{
                                                        border: 'none',
                                                        outline: 'none',
                                                        width: '100%',
                                                        fontSize: '16px',
                                                        background: 'transparent',
                                                        color: '#333',
                                                    }}
                                                />
                                                {firstname && (
                                                    <IconButton size="small">
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </Box>

                                        <Box sx={{ mb: 4 }}>
                                            <Typography variant="subtitle2" sx={{ mb: 2, color: '#666', fontWeight: 500 }}>
                                                Phone number
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
                                                <Phone sx={{ mr: 2, color: 'rgba(0, 0, 0, 0.3)' }} />
                                                <input
                                                    type="text"
                                                    value={phone_number}
                                                    onChange={(e) => setPhone_number(e.target.value)}
                                                    placeholder="Enter phone number"
                                                    style={{
                                                        border: 'none',
                                                        outline: 'none',
                                                        width: '100%',
                                                        fontSize: '16px',
                                                        background: 'transparent',
                                                        color: '#333',
                                                    }}
                                                />
                                                {phone_number && (
                                                    <IconButton size="small">
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </Box>

                                        <Box>
                                            <Stack spacing={3}>
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
                                                                <VscFileBinary fontSize="small" />
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                                                    Profil Photo
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
                                                                {profilImg ? profilImg.name : 'Click to upload'}
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
                                                                    onChange={handleLogoUpload}
                                                                />
                                                            </Button>
                                                            <div className="flex justify-center">
                                                                <img
                                                                    style={{ width: 100 }}
                                                                    src={
                                                                        profilImg
                                                                            ? URL.createObjectURL(profilImg)
                                                                            : existingProfil
                                                                                ? `${endpointFile}${existingProfil}`
                                                                                : '/placeholder.png'
                                                                    }
                                                                    alt="no file added"
                                                                />
                                                            </div>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
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
                                                Update Owner
                                            </Button>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default OwnerUpdateComponent;