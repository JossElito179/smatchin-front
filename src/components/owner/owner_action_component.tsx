import React, { use, useState } from 'react';
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
    Divider,
    Alert,
    CircularProgress,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { itemOwner } from '../../utils/entity';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { endpoint } from '../../utils/utils';


interface OwnerActionsProps {
    owner: itemOwner;
    onViewDetails?: (ownerId: number) => void;
    onViewPlayers?: (ownerId: number) => void;
    onUpdate?: (ownerId: number) => void;
    onRemove?: (ownerId: number) => void;
    loading?: boolean;
}

const OwnerActions: React.FC<OwnerActionsProps> = ({
    owner,
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

    const handleActionClick = (action: 'update' | 'remove') => {
        handleMenuClose();
        if (action === 'remove') {
            setShowConfirmation(true);
        } else {
            setSelectedAction(action);
            switch (action) {
                case 'update':
                    navigate(`/owner/update/${owner.id}`);
                    break;
            }
        }
    };

    const handleConfirmRemove = () => {
        const deleteowners = async () => {
            try {
                const response = axios.delete(`${endpoint}users/${owner.id}`);
                if ((await response).status === 200) {
                    alert('Data deleted with success')
                }
            } catch (error) {
                console.error('Error when deleting the owners', error)
                alert('Failed to delete the owners, please try again')
            }
        }
        deleteowners()
        setShowConfirmation(false);
        onRemove?.(owner.id);
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
                <MenuItem onClick={() => handleActionClick('update')}>
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
                </MenuItem>
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
                        This action is irreversible. All owner data will be deleted.
                    </Alert>
                    <Typography>
                        Are you sure you want to delete the owner <strong>{owner.name}</strong> ?
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
        </>
    );
};

export default OwnerActions;