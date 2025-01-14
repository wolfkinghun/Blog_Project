import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { useTheme } from '../context/ThemeContext';
import { UserContext } from '../context/UserContext';
import { CategContext } from '../context/Context';
import { uploadFile } from '../utility/uploadFile';
import { addPost, readPost, updatePost } from '../utility/crudUtility';
import { CatDropdown } from '../components/Dropdown';
import Alerts from '../components/Alerts';
import { Story } from '../components/Story';
import { Home } from './Home';

export const AddEditPost = () => {
  const { categories } = useContext(CategContext);
  const { user } = useContext(UserContext);
  const { darkMode } = useTheme(); // Access dark mode state
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [story, setStory] = useState(null);
  const [enableBtn, setEnableBtn] = useState(false);
  const [selectedCateg, setSelectedCateg] = useState(null);
  const [post, setPost] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (params?.id) readPost(params.id, setPost);
  }, [params.id]);

  useEffect(() => {
    if (post) {
      setValue("title", post.title);
      setSelectedCateg(post.category);
      setStory(post.story);
      setPhoto(post.photo.url);
    }
  }, [post]);

  const onSubmit = async (data) => {
    setLoading(true);
    if (params.id) {
      try {
        updatePost(params.id, { ...data, category: selectedCateg, story });
        setUploaded(true);
        setTimeout(() => {
          navigate("/posts/");
        }, 2000);
      } catch (error) {
        console.log("update: ", error);
      } finally {
        setLoading(false);
      }
    } else {
      let newPostData = {
        ...data,
        story,
        author: user.displayName,
        userId: user.uid,
        category: selectedCateg,
        likes: [],
      };
      try {
        const file = data.file[0];
        const { url, id } = file ? await uploadFile(file) : null;
        delete newPostData.file;
        newPostData = { ...newPostData, photo: { url, id } };
        addPost(newPostData);
        setUploaded(true);
        reset();
        setPhoto(null);
        setStory(null);
        setTimeout(() => {
          navigate("/posts/");
        }, 2000);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!selectedCateg || !story || story.length <= 10) setEnableBtn(true);
    else setEnableBtn(false);
  }, [selectedCateg, story]);

  if (!user) return <Home />;

  return (
    <div
      className="page"
      style={{
        backgroundColor: darkMode ? '#222' : '#f9f9f9',
        color: darkMode ? '#fff' : '#333',
        minHeight: '100vh',
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="post-form"
        style={{
          backgroundColor: darkMode ? '#333' : '#fff',
          color: darkMode ? '#fff' : '#000',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: darkMode ? '0px 4px 10px rgba(255, 255, 255, 0.1)' : '0px 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="form-group">
          <label htmlFor="title" style={{ color: darkMode ? '#fff' : '#000' }}>
            A bejegyzés
          </label>
          <input
            id="title"
            type="text"
            {...register('title', { required: 'A cím megadása kötelező.' })}
            className="form-control"
            style={{
              backgroundColor: darkMode ? '#444' : '#fff',
              color: darkMode ? '#fff' : '#000',
              border: darkMode ? '1px solid #666' : '1px solid #ccc',
            }}
          />
          <p className="text-danger">{errors?.title?.message}</p>
        </div>

        <CatDropdown categories={categories} setSelectedCateg={setSelectedCateg} selectedCateg={selectedCateg} />

        <Story setStory={setStory} uploaded={uploaded} story={story} />

        <div className="form-group">
          <label htmlFor="file" style={{ color: darkMode ? '#fff' : '#000' }}>
            Fájl
          </label>
          <input
            disabled={params.id}
            id="file"
            type="file"
            {...register("file", params.id ? {} : {
              required: !params.id,
              validate: (value) => {
                if (!value[0]) return true;
                const fileExtension = value[0]?.name.split(".").pop().toLowerCase();
                const acceptedFormats = ['jpg', 'png'];
                if (!acceptedFormats.includes(fileExtension)) return "Invalid file format!";
                if (value[0].size > 1 * 3000 * 2024) return "Az engedélyezett fájl mérete 1MB";
                return true;
              }
            })}
            className="form-control"
            onChange={(e) => setPhoto(URL.createObjectURL(e.target.files[0]))}
            style={{
              backgroundColor: darkMode ? '#444' : '#fff',
              color: darkMode ? '#fff' : '#000',
              border: darkMode ? '1px solid #666' : '1px solid #ccc',
            }}
          />
          <p className="text-danger">{errors?.file?.message}</p>
          <p className="text-danger">{errors?.file && "fotó megadása kötelező"}</p>
        </div>

        <div className="form-group">
          <button
            type="submit"
            className="btn"
            disabled={enableBtn}
            style={{
              backgroundColor: darkMode ? '#007bff' : '#4caf50',
              color: '#fff',
              border: 'none',
            }}
          >
            {loading ? 'Töltés...' : params.id ? 'Poszt frissítése' : 'Bejegyzés hozzáadása'}
          </button>
        </div>
      </form>

      {loading && <BarLoader color={darkMode ? '#007bff' : '#4caf50'} />}
      {uploaded && <Alerts txt="Sikeres feltőltés" />}
      {photo && (
        <img
          src={photo}
          alt="Preview"
          className="img-thumbnail mt-3"
          style={{
            border: darkMode ? '2px solid #4caf50' : '2px solid #007bff',
          }}
        />
      )}
    </div>
  );
};
