import React from 'react';
import { 
  Users, 
  Calendar, 
  Shirt, 
  Trophy,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { endpointFile } from '../../utils/utils';

interface TeamMember {
  id: number;
  name: string;
  firstName: string;
  age: string;
  role: string;
  position: string; 
}

interface TeamInfoProps {
  teamName: string;
  schoolName: string;
  teamLogo: string;
  teamPhoto: string;
  members: TeamMember[];
  season: string;
  owner: string;
  record: string;
}

const TeamInfo: React.FC<TeamInfoProps> = ({
  teamName,
  schoolName,
  teamLogo,
  teamPhoto,
  members,
  season,
  owner,
  record
}) => {
    const navigate = useNavigate();

  return (
    <div className="min-h-screen  text-gray-100 p-4 md:p-6 lg:p-8">
      {/* En-tête */}
    <div className="retour max-w-7xl mx-auto">
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
        <ArrowBackIcon  className=" text-purple-700" fontSize="medium" />
      </IconButton>
    </div>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {schoolName}
            </h1>
            <div className="flex items-center gap-4">
              <h2 className="text-xl md:text-2xl font-semibold text-blue-400">
                {teamName}
              </h2>
              <div className="flex items-center gap-2 text-yellow-400">
                <Trophy size={20} />
                <span className="text-sm font-medium">Season {season}</span>
              </div>
            </div>
          </div>
          
          {/* Logo de l'équipe dans un cercle */}
          <div className="relative">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-blue-600 overflow-hidden shadow-2xl shadow-blue-900/50">
              {teamLogo ? (
                <img 
                  src={ `${endpointFile}${teamLogo}` } 
                  alt={`${teamName} logo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Shirt size={40} className="text-blue-400" />
                </div>
              )}
            </div>
            {/* Effet de brillance */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-pulse" />
          </div>
        </div>

        {/* Section principale avec photo d'équipe et statistiques */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Photo de groupe principale */}
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
              {teamPhoto ? (
                <img 
                  src={`${endpointFile}${teamPhoto}`} 
                  alt={`${teamName} team photo`}
                  className="w-full h-64 md:h-80 object-cover"
                />
              ) : (
                <div className="w-full h-64 md:h-80 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <Users size={80} className="text-gray-600" />
                </div>
              )}
              
              {/* Overlay d'informations */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-blue-400" />
                    <span className="text-sm font-medium">Season: {season}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-green-400" />
                    <span className="text-sm font-medium">Owner: {owner}</span>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <Trophy size={16} className="text-yellow-400" />
                    <span className="text-sm font-medium">{record}</span>
                  </div> */}
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-red-400" />
                    <span className="text-sm font-medium">{members.length} Players</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section statistiques rapides */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 shadow-xl">
              <h3 className="text-lg font-semibold mb-3 text-white">Team Stats</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Avg. Age</span>
                    <span className="text-white font-medium">
                      {(
                        members.reduce((acc, member) => {
                          const age = parseInt(member.age.replace(' YO', ''));
                          return acc + (isNaN(age) ? 22 : age);
                        }, 0) / members.length
                      ).toFixed(1)} years
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Starters</span>
                    <span className="text-white font-medium">
                      {members.filter(m => m.role === 'Starter').length} players
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '50%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 shadow-xl">
              <h3 className="text-lg font-semibold mb-3 text-white">Positions</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(members.map(m => m.position))).map((position) => (
                  <div
                    key={position}
                    className="px-3 py-1.5 bg-blue-900/30 border border-blue-700/50 rounded-lg"
                  >
                    <span className="text-blue-300 text-sm font-medium">{position}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des joueurs */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
          {/* En-tête du tableau */}
          <div className="px-6 py-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Team Roster</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm text-gray-300">Active</span>
                </div>
                <span className="text-sm text-blue-400 font-medium">
                  {members.length} Total Players
                </span>
              </div>
            </div>
          </div>

          {/* Corps du tableau */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
                  <th className="py-4 px-6 text-left">
                    <div className="flex items-center gap-2 text-blue-400 font-semibold">
                      <Users size={16} />
                      <span>Player</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left">
                    <div className="flex items-center gap-2 text-green-400 font-semibold">
                      <span>Age</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left">
                    <div className="flex items-center gap-2 text-yellow-400 font-semibold">
                      <Shirt size={16} />
                      <span>Role</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left">
                    <div className="flex items-center gap-2 text-red-400 font-semibold">
                      <span>Position</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left">
                    <div className="flex items-center gap-2 text-purple-400 font-semibold">
                      <Star size={16} />
                      <span>Status</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr 
                    key={member.id}
                    className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-gray-600">
                          <span className="text-xs font-bold text-white">
                            {member.firstName.charAt(0)}{member.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {member.firstName} {member.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            #{member.id.toString().padStart(2, '0')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30">
                        <span className="text-blue-300 font-medium">{member.age}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${member.role === 'Starter' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                        <span className={`font-medium ${member.role === 'Starter' ? 'text-green-400' : 'text-gray-300'}`}>
                          {member.role}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800 border border-gray-600">
                        <span className="text-white font-bold">{member.position}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-900/20 border border-green-700/30">
                        <span className="text-green-300 font-medium">Active</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pied du tableau */}
          <div className="px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-900 border-t border-gray-700">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Starter</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500" />
                  <span>Bench</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-blue-300">
                  JR: Joueur • CH: Coach• SF: Staff
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamInfo;