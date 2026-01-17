import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PeopleIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete';
import type { itemTeam } from '../../utils/entity';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { endpoint } from '../../utils/utils';


interface TeamActionsProps {
  team: itemTeam;
  onViewDetails?: (teamId: number) => void;
  onViewPlayers?: (teamId: number) => void;
  onUpdate?: (teamId: number) => void;
  onRemove?: (teamId: number) => void;
  loading?: boolean;
}

const TeamActionsAvaibs: React.FC<TeamActionsProps> = ({
  team,
  onRemove,
  loading = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'details' | 'players' | 'update' | null>(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (action: 'details' | 'players' | 'update' | 'remove') => {
    handleMenuClose();
    if (action === 'remove') {
      setShowConfirmation(true);
    } else {
      setSelectedAction(action);
      switch (action) {
        case 'details':
          navigate(`/team/details/${team.id}`);
          break;
        case 'players':
            navigate(`/players/${team.id}/${team.name}`);
          break;
        case 'update':
            navigate(`/team/update/${team.id}`);
          break;
      }
    }
  };

  const handleConfirmRemove = () => {
    const deleteTeams = async () => {
      try {
        const response = axios.delete(`${endpoint}teams/${team.id}`);
        if ((await response).status === 200) {
          alert('Data deleted with success')
        }
      } catch (error) {
        console.error('Error when deleting the teams', error, selectedAction)
        alert('Failed to delete the teams, please try again')       
      }
    }
    deleteTeams()
    setShowConfirmation(false);
    onRemove?.(team.id);
  };

  const handleCancelRemove = () => {
    setShowConfirmation(false);
  };


  return (
    <>
      {/* Bouton d'action */}
      <IconButton
        aria-label="actions"
        onClick={handleMenuOpen}
        disabled={loading}
        size="small"
        color="inherit"
      >
        {loading ? <CircularProgress size={20} /> : <MoreVertIcon />}
      </IconButton>

      {/* Menu déroulant */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleActionClick('details')}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          See more details
        </MenuItem>
        <MenuItem onClick={() => handleActionClick('players')}>
          <PeopleIcon fontSize="small" sx={{ mr: 1 }} />
          See the players
        </MenuItem>
        {/* <MenuItem onClick={() => handleActionClick('update')}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => handleActionClick('remove')}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem> */}
      </Menu>

      {/* Popup de confirmation pour la suppression */}
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
            Are you sure you want to delete the team <strong>{team.name}</strong> ?
          </Typography>
          {team.total_members && team.total_members > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              ⚠️ {team.total_members} player(s) will be affected.
            </Typography>
          )}
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
    </>
  );
};


export default TeamActionsAvaibs;