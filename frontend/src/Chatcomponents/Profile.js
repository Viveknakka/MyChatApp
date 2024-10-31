import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import { Avatar, TextField, Snackbar } from '@mui/material';
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose && (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function ProfileDialog(props) {
  const { user, setUser } = ChatState();
  const [newEmail, setNewEmail] = useState('');
  const [newPic, setNewPic] = useState('');
  const [previewPic, setPreviewPic] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPic, setIsEditingPic] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [name,setName]=useState('');

  useEffect(() => {
    // Update the local state when the user prop changes
    setName(props.user.name);
    setNewEmail(props.user.email);
    setNewPic(props.user.pic);
    setPreviewPic(props.user.pic);
  }, [props.user]);

  const handleSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleFileChange = async (e) => {
    const pics = e.target.files[0];
    if (!pics) {
      handleSnackbar('Please check an image!', 'warning');
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dn6lxcybf");

      try {
        const response = await axios.post("https://api.cloudinary.com/v1_1/dumugkpxd/image/upload", data);
        const pic_url = response.data.url.toString();
        setNewPic(pic_url);
        setPreviewPic(pic_url);
        handleSnackbar('Image uploaded successfully!', 'success');
      } catch (error) {
        console.error("Error uploading image:", error);
        handleSnackbar('Error uploading image. Please try again.', 'error');
      }
    } else {
      handleSnackbar('Please select a JPEG or PNG image!', 'warning');
    }
  };

  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
  };

  const handleSaveChanges = async (event) => {
    event.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const userInfo = JSON.parse(localStorage.getItem('userinfo'));
      const oldEmail = userInfo.email; 
      const { data } = await axios.put(
        `/api/user/updateprofile`,
        { newEmail, newPic, oldEmail },
        config
      );

      setUser(data);
      handleSnackbar('Profile updated successfully!', 'success');
      props.onClose();
      setIsEditingEmail(false);
      setIsEditingPic(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      handleSnackbar('Failed to update profile.', 'error');
    }
  };

  const handleCancel = () => {
    setNewEmail(props.user.email);
    setIsEditingEmail(false);
    setIsEditingPic(false);
    props.onClose();
  };

  return (
    <div>
      <BootstrapDialog
        onClose={props.onClose}
        aria-labelledby="customized-dialog-title"
        open={props.open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={props.onClose}>
          {`${name}'s Profile`}
         {/*{user._id === props.user._id ? "Edit Profile" : `${name}'s Profile`*/}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Avatar src={previewPic} alt={props.user.name} sx={{ margin: 'auto', height: '100px', width: '100px' }} />
            {user._id === props.user._id && (
              <IconButton
                color="primary"
                sx={{ position: 'absolute', bottom: 0, right: 0 }}
                onClick={() => setIsEditingPic(true)}
              >
                <EditIcon />
              </IconButton>
            )}
          </div>
          {isEditingPic && (
            <TextField
              type="file"
              inputProps={{ accept: 'image/*' }}
              onChange={handleFileChange}
              fullWidth
              margin="normal"
            />
          )}

          <Typography variant="body1" sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            {isEditingEmail && user._id === props.user._id ? (
              <TextField
                label="Email"
                type="email"
                value={newEmail}
                onChange={handleEmailChange}
                fullWidth
                margin="normal"
              />
            ) : (
              <>
                Email: {newEmail}
                {user._id === props.user._id && (
                  <IconButton
                    color="primary"
                    onClick={() => setIsEditingEmail(true)}
                    sx={{ ml: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </>
            )}
          </Typography>
        </DialogContent>

        <DialogActions>
          {user._id === props.user._id && (
            <Button autoFocus onClick={handleSaveChanges} variant="contained">
              Save Changes
            </Button>
          )}
          <Button onClick={handleCancel} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </div>
  );
}
