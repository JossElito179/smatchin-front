import React, { useEffect, useState } from 'react';
import {
  User,
  Calendar,
  Shirt,
  Trophy,
  Target,
  Users,
  MapPin,
  Edit,
  Trash2,
  Award,
  TrendingUp,
  Activity,
  Heart,
  Star,
  Clock,
  DeleteIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import axios from 'axios';
import { endpoint, endpointFile } from '../../utils/utils';

interface PlayerDetails {
  id_players: number;
  name: string;
  first_name: string;
  birth_date: string;
  profil_img?: string;
  bacc_file?: string;
  cin_file?: string;
  id_teams: number;
  id_positions: number;
  is_starter: boolean;
  position?: {
    id_positions: number;
    name: string;
    acronym: string;
  };
  team?: {
    id_teams: number;
    name: string;
    logo?: string;
    is_active: boolean;
  };
  stats?: {
    games_played: number;
    points_per_game: number;
    rebounds_per_game: number;
    assists_per_game: number;
    field_goal_percentage: number;
  };
}

interface PlayerDetailsProps {
  player: PlayerDetails;
  onEdit?: () => void;
  onDelete?: () => void;
  onGoToTeam?: () => void;
}

const PlayerDetailsComponent: React.FC<PlayerDetailsProps> = ({
  player,
  onEdit,
  onDelete,
  onGoToTeam
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'stats' | 'documents'>('info');
  const navigate = useNavigate();
  const id_user = localStorage.getItem('id_user');
  const canHandle = localStorage.getItem('canHandle');
  const [canRealHandle, setCanRealHandle] = useState<string | null>('');
  const [load, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);


  async function fetchUserRole() {
    try {
      setLoading(true);
      console.log(id_user, 'id_user');
      const response = await axios.get(endpoint + 'users/find/' + id_user);
      console.log(endpoint + 'users/find/', response);

      setUser(response.data);

      console.log(response.data);
      console.log(canHandle);

      if (response.data?.role == false) {
        setCanRealHandle(canHandle);
      }

      console.log(canRealHandle);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserRole();
  }, []);


  const handleConfirmRemove = () => {
    const deleteTeams = async () => {
      try {
        const response = axios.delete(endpoint + `players/${player.id_players}`);
        if ((await response).status === 200) {
          alert('Data deleted with success')
          setShowConfirmation(false)
          navigate('/teams')
        }
      } catch (error) {
        console.error('Error when deleting the teams', error)
        alert('Failed to delete the teams, please try again')
      }
    }
    deleteTeams()
    setShowConfirmation(false);
  };

  const handleCancelRemove = () => {
    setShowConfirmation(false);
  };


  // Calculer l'âge à partir de la date de naissance
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const defaultPlayer: PlayerDetails = {
    id_players: 1,
    name: "Garnier",
    first_name: "Alexandre",
    birth_date: "1995-03-15",
    profil_img: "", // URL de l'image
    bacc_file: "",
    cin_file: "",
    id_teams: 1,
    id_positions: 1,
    is_starter: true,
    position: {
      id_positions: 1,
      name: "Meneur",
      acronym: "PG"
    },
    team: {
      id_teams: 1,
      name: "Les Aigles",
      logo: "",
      is_active: true
    },
    stats: {
      games_played: 42,
      points_per_game: 18.5,
      rebounds_per_game: 4.2,
      assists_per_game: 7.8,
      field_goal_percentage: 46.3
    }
  };

  const currentPlayer = player || defaultPlayer;
  const age = calculateAge(currentPlayer.birth_date);

  function deleteItem(): void {
    setShowConfirmation(true);
  }

  return (
    <div className="min-h-screen  text-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <Dialog
          open={showConfirmation}
          onClose={handleCancelRemove}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" color="error">
              Confirm the deletion
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              This action is irreversible. All team data will be deleted.
            </Alert>
            <Typography>
              Are you sure you want to delete the team <strong>{player?.name}</strong> ?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelRemove} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handleConfirmRemove}
              color="error"
              variant="contained"
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Header avec actions */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Player Details
            </h1>
            <p className="text-gray-400">Player details and informations</p>
          </div>

          {
            user?.role == true ? (
              <>
                <div className="flex items-center gap-3">
                  <button
                    onClick={onEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                    Edit
                  </button>
                  <button
                    onClick={deleteItem}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-700/30 text-red-400 border border-red-600/30 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              </>
            ) : canRealHandle === 'true' ? (
              <>          <div className="flex items-center gap-3">
                <button
                  onClick={onEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Edit size={18} />
                  Edit
                </button>
                <button
                  onClick={deleteItem}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-700/30 text-red-400 border border-red-600/30 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div></>
            ) : (
              <></>
            )
          }

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Colonne gauche - Photo et info basique */}
          <div className="space-y-6">
            {/* Carte photo et nom */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-2xl">
              <div className="flex flex-col items-center">
                {/* Photo de profil */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full border-4 border-blue-500 overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800">
                    {currentPlayer.profil_img ? (
                      <img
                        src={`${endpointFile}${currentPlayer.profil_img}`}
                        alt={`${currentPlayer.first_name} ${currentPlayer.name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={64} className="text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Badge Starter */}
                  {currentPlayer.is_starter && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-full border border-yellow-500 shadow-lg">
                        <Star size={12} className="text-white" />
                        <span className="text-xs font-bold text-white">STARTER</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Nom et position */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {currentPlayer.first_name} {currentPlayer.name}
                  </h2>
                  <div className="flex items-center justify-center gap-2">
                    <div className="px-3 py-1 bg-blue-900/30 border border-blue-700/50 rounded-full">
                      <span className="text-blue-300 font-bold">{currentPlayer.position?.acronym || "PG"}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-300">{currentPlayer.position?.name || "Meneur"}</span>
                  </div>
                </div>

                {/* Info équipe */}
                <div
                  onClick={onGoToTeam}
                  className="cursor-pointer w-full p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700 hover:border-blue-500 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 flex items-center justify-center">
                        {currentPlayer.team?.logo ? (
                          <img
                            src={`${endpointFile}${currentPlayer.team.logo}`}
                            alt={currentPlayer.team.name}
                            className="w-full rounded-full h-full object-cover"
                          />
                        ) : (
                          <Users size={20} className="text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Team</div>
                        <div className="text-white font-medium group-hover:text-blue-400 transition-colors">
                          {currentPlayer.team?.name || "Les Aigles"}
                        </div>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${currentPlayer.team?.is_active ? 'bg-green-900/30 text-green-400 border border-green-700/50' : 'bg-red-900/30 text-red-400 border border-red-700/50'}`}>
                      {currentPlayer.team?.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte informations personnelles */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-2xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User size={20} className="text-blue-400" />
                Personal Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={16} />
                    <span>Birth date</span>
                  </div>
                  <div className="text-white font-medium">
                    {formatDate(currentPlayer.birth_date)}
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Heart size={16} />
                    <span>Age</span>
                  </div>
                  <div className="text-white font-medium">
                    {age} YO
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Shirt size={16} />
                    <span>Status</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${currentPlayer.is_starter ? 'bg-green-900/30 text-green-400 border border-green-700/50' : 'bg-blue-900/30 text-blue-400 border border-blue-700/50'}`}>
                    {currentPlayer.is_starter ? 'Starter' : 'Substitute'}
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Target size={16} />
                    <span>Number ID</span>
                  </div>
                  <div className="text-white font-medium">
                    #{currentPlayer.id_players.toString().padStart(4, '0')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne centrale - Onglets de contenu */}
          <div className="lg:col-span-2 space-y-6">
            {/* Navigation par onglets */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
              <div className="flex border-b border-gray-700">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'info' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
                >
                  Informations
                </button>
                {/* <button
                  onClick={() => setActiveTab('stats')}
                  className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'stats' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
                >
                  Statistiques
                </button> */}
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'documents' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
                >
                  Documents
                </button>
              </div>

              {/* Contenu des onglets */}
              <div className="p-6">
                {activeTab === 'info' && (
                  <div className="space-y-6">
                    {/* Section position */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Position et Rôle</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gradient-to-r from-blue-900/20 to-blue-900/10 rounded-xl border border-blue-700/30">
                          <div className="text-sm text-blue-300 mb-1">Position</div>
                          <div className="text-xl font-bold text-white">{currentPlayer.position?.acronym}</div>
                          <div className="text-gray-300">{currentPlayer.position?.name}</div>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-green-900/20 to-green-900/10 rounded-xl border border-green-700/30">
                          <div className="text-sm text-green-300 mb-1">Team Status</div>
                          <div className="text-xl font-bold text-white">
                            {currentPlayer.is_starter ? 'Starter' : 'Substitute'}
                          </div>
                          <div className="text-gray-300">
                            {currentPlayer.is_starter ? 'In the starting five' : 'On the bench'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section équipe */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Current Team</h4>
                      <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 flex items-center justify-center">
                              {currentPlayer.team?.logo ? (
                                <img
                                  src={`${endpointFile}${currentPlayer.team.logo}`}
                                  alt={currentPlayer.team.name}
                                  className="w-auto h-auto rounded-full object-cover"
                                />
                              ) : (
                                <Users size={24} className="text-gray-400" />
                              )}
                            </div>
                            <div>
                              <div className="text-white font-medium text-lg">
                                {currentPlayer.team?.name || "Les Aigles"}
                              </div>
                              <div className="text-gray-400 text-sm">Basketball Team</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">Team ID</div>
                            <div className="text-white font-medium">#{currentPlayer.id_teams}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* {activeTab === 'stats' && currentPlayer.stats && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-gradient-to-r from-purple-900/20 to-purple-900/10 rounded-xl border border-purple-700/30">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-purple-300">Points par match</div>
                          <TrendingUp size={16} className="text-purple-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {currentPlayer.stats.points_per_game}
                        </div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min(currentPlayer.stats.points_per_game / 30 * 100, 100)}%` }} />
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-green-900/20 to-green-900/10 rounded-xl border border-green-700/30">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-green-300">Rebonds par match</div>
                          <Activity size={16} className="text-green-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {currentPlayer.stats.rebounds_per_game}
                        </div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(currentPlayer.stats.rebounds_per_game / 15 * 100, 100)}%` }} />
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-blue-900/20 to-blue-900/10 rounded-xl border border-blue-700/30">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-blue-300">Passes par match</div>
                          <Award size={16} className="text-blue-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {currentPlayer.stats.assists_per_game}
                        </div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(currentPlayer.stats.assists_per_game / 12 * 100, 100)}%` }} />
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-yellow-900/20 to-yellow-900/10 rounded-xl border border-yellow-700/30">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-yellow-300">% de réussite</div>
                          <Target size={16} className="text-yellow-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {currentPlayer.stats.field_goal_percentage}%
                        </div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${currentPlayer.stats.field_goal_percentage}%` }} />
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-red-900/20 to-red-900/10 rounded-xl border border-red-700/30">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-red-300">Matchs joués</div>
                          <Clock size={16} className="text-red-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {currentPlayer.stats.games_played}
                        </div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(currentPlayer.stats.games_played / 82 * 100, 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )} */}

                {activeTab === 'documents' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Administrative Documents</h4>
                      <div className="space-y-3">
                        <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-900/30 to-blue-900/10 border border-blue-700/30 flex items-center justify-center">
                                <Trophy size={20} className="text-blue-400" />
                              </div>
                              <div>
                                <div className="text-white font-medium">BAC Diploma</div>
                                <div className="text-gray-400 text-sm">Administrative file</div>
                              </div>
                            </div>
                            <div>
                              {currentPlayer.bacc_file ? (
                                <Link to={`${endpointFile}${currentPlayer.bacc_file}`} >
                                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                                    Watch the file
                                  </button>
                                </Link>

                              ) : (
                                <span className="text-gray-500 text-sm">Not provided</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-900/30 to-green-900/10 border border-green-700/30 flex items-center justify-center">
                                <User size={20} className="text-green-400" />
                              </div>
                              <div>
                                <div className="text-white font-medium">Identity Card</div>
                                <div className="text-gray-400 text-sm">Identity Document</div>
                              </div>
                            </div>
                            <div>
                              {currentPlayer.cin_file ? (
                                <Link to={`${endpointFile}${currentPlayer.cin_file}`}>
                                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors">
                                    Watch the file
                                  </button>
                                </Link>
                              ) : (
                                <span className="text-gray-500 text-sm">Not provided</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section ID et dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700">
                <div className="text-sm text-gray-400 mb-1">Player ID</div>
                <div className="text-xl font-bold text-white">
                  #{currentPlayer.id_players.toString().padStart(4, '0')}
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700">
                <div className="text-sm text-gray-400 mb-1">Team ID</div>
                <div className="text-xl font-bold text-white">#{currentPlayer.id_teams}</div>
              </div>

              <div className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700">
                <div className="text-sm text-gray-400 mb-1">Position ID</div>
                <div className="text-xl font-bold text-white">#{currentPlayer.id_positions}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailsComponent;