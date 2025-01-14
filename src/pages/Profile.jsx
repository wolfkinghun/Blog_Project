import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useConfirm } from 'material-ui-confirm';
import { BarLoader } from 'react-spinners';
import { motion } from 'framer-motion';

import Toastify from '../components/Toastify';
import { UserContext } from '../context/UserContext';
import { deletePhoto, uploadFile } from '../utility/uploadFile';
import { extractUrlAndId } from '../utility/utils';
import { useTheme } from '../context/ThemeContext';

export const Profile = () => {
  const { user, updateUser, msg, deletAccount } = useContext(UserContext);
  const { darkMode } = useTheme(); // Access dark mode state
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const confirm = useConfirm();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      displayName: user?.displayName || '',
    },
  });

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  useEffect(() => {
    if (user?.photoURL) {
      setAvatar(extractUrlAndId(user.photoURL).url);
    }
  }, [user]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const file = data?.file ? data.file[0] : null;
      const { url, id } = file ? await uploadFile(file) : {};
      updateUser(data.displayName, file ? `${url}/${id}` : undefined);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const avatarParts = user?.photoURL?.split('/');
    const avatarId = avatarParts?.[avatarParts.length - 1];

    try {
      await confirm({
        title: 'Biztos ki szeretnéd törölni a fiókod?',
        description: 'Ez egy visszavonhatatlan művelet',
        confirmationText: 'Igen',
        cancellationText: 'Mégsem',
      });
      await deletAccount();
      if (avatarId) deletePhoto(avatarId);
      navigate('/');
    } catch (error) {
      console.error('Mégsem:', error);
    }
  };

  return (
    <div
      className="page d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: darkMode ? '#222' : '#f9f9f9', // Dark or light background
        color: darkMode ? '#fff' : '#333', // Text color based on theme
        minHeight: '100vh',
      }}
    >
      <motion.div
        className="profile-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: '400px',
          width: '100%',
          backgroundColor: darkMode ? '#333' : '#fff', // Card background color
          color: darkMode ? '#fff' : '#000', // Card text color
          borderRadius: '8px',
          padding: '20px',
          boxShadow: darkMode
            ? '0px 4px 10px rgba(255, 255, 255, 0.1)'
            : '0px 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3 className="text-center">Felhasználói fiók beállításai</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
          <div className="form-group">
            <label>Felhasználónév:</label>
            <input
              {...register('displayName')}
              placeholder="Felhasználónév"
              type="text"
              className="form-control"
              style={{
                backgroundColor: darkMode ? '#444' : '#fff', // Input background
                color: darkMode ? '#fff' : '#000', // Input text color
                border: darkMode ? '1px solid #666' : '1px solid #ccc',
              }}
            />
          </div>

          <div className="form-group">
            <input
              type="file"
              {...register('file', {
                validate: (value) => {
                  if (!value[0]) return true;
                  const fileExtension = value[0]?.name.split('.').pop().toLowerCase();
                  const acceptedFormats = ['jpg', 'png'];
                  if (!acceptedFormats.includes(fileExtension)) return 'Érvénytelen fájlformátum!';
                  if (value[0].size > 1 * 1024 * 1024) return 'Az engedélyezett fájl mérete 1MB.';
                  return true;
                },
              })}
              onChange={(e) => setAvatar(URL.createObjectURL(e.target.files[0]))}
              className="form-control"
              style={{
                backgroundColor: darkMode ? '#444' : '#fff',
                color: darkMode ? '#fff' : '#000',
                border: darkMode ? '1px solid #666' : '1px solid #ccc',
              }}
            />
            {errors?.file && <p className="text-danger">{errors.file.message}</p>}
          </div>

          <motion.input
            type="submit"
            className="btn w-100"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            value="Mentés"
            style={{
              backgroundColor: darkMode ? '#4caf50' : '#007bff', // Button color
              color: '#fff',
              border: 'none',
            }}
          />
        </form>

        {loading && <BarLoader color={darkMode ? '#4caf50' : '#007bff'} className="my-3" />}
        {msg && <Toastify {...msg} />}
        {avatar && (
          <img
            src={avatar}
            alt="Avatar"
            className="img-thumbnail my-3 mx-auto d-block"
            style={{
              border: darkMode ? '2px solid #4caf50' : '2px solid #007bff', // Avatar border color
            }}
          />
        )}

        <motion.button
          className="btn w-100"
          onClick={handleDelete}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            backgroundColor: darkMode ? '#e53935' : '#dc3545', // Delete button color
            color: '#fff',
            border: 'none',
          }}
        >
          Felhasználói fiók törlése
        </motion.button>
      </motion.div>
    </div>
  );
};
