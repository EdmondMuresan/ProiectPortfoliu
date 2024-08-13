import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Gallery = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #FFFD98;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const ImageCard = styled(motion.div)`
  background-color: #2E282A;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  padding-top: 75%; // 4:3 aspect ratio
`;

const StyledImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageInfo = styled.div`
  padding: 15px;
`;

const Title = styled.h3`
  margin: 0 0 10px;
  font-size: 20px;
  color: #FFFD98;
`;

const Description = styled.p`
  margin: 0 0 10px;
  font-size: 14px;
  color: #FFFD98;
`;

const CreatorLink = styled.a`
  color: #FFFD98;
  text-decoration: none;
  font-size: 14px;
  text-decoration: underline;
  &:hover {
    text-decoration: underline;
  }
`;

const Button = styled.button`
  background-color: #3F612D;
  color: white;
  border: none;
  padding: 5px 10px;
  margin-right: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #283F1C;
  }
`;

const EditForm = styled.div`
  padding: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
`;
const ImageList = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', creatorLink: '' });
  const [isSimpleView, setIsSimpleView] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);
  
  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:3000/upload/images');
      console.log('Fetched images:', response.data); 
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to load images');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/upload/images/${id}`);
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      setError('Failed to delete image');
    }
  };

  const handleEdit = (image) => {
    setEditingId(image.id);
    setEditForm({ title: image.title, description: image.description, creatorLink: image.creatorLink });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/upload/images/${editingId}`, editForm);
      setEditingId(null);
      fetchImages();
    } catch (error) {
      console.error('Error updating image:', error);
      setError('Failed to update image');
    }
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const toggleVisibility = async (id) => {
    try {
      const imageToUpdate = images.find(img => img.id === id);
      const newVisibility = !imageToUpdate.visible;
      await axios.put(`http://localhost:3000/upload/images/${id}`, {
        ...imageToUpdate,
        visible: newVisibility
      });
      setImages(images.map(image => 
        image.id === id ? { ...image, visible: newVisibility } : image
      ));
    } catch (error) {
      console.error('Error toggling image visibility:', error);
      setError('Failed to toggle image visibility');
    }
  };

  const renderFullView = () => (
    <GalleryGrid>
      {images.map((image) => (
        <ImageCard
          key={image.id || image.filename}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ opacity: image.visible ? 1 : 0.5 }}
        >
          <ImageWrapper>
            <StyledImage
              src={`http://localhost:3000/uploads/${image.filename}`}
              alt={image.title}
            />
          </ImageWrapper>
          {editingId === image.id ? (
            <EditForm>
              <Input
                name="title"
                value={editForm.title}
                onChange={handleChange}
                placeholder="Title"
              />
              <Textarea
                name="description"
                value={editForm.description}
                onChange={handleChange}
                placeholder="Description"
              />
              <Input
                name="creatorLink"
                value={editForm.creatorLink}
                onChange={handleChange}
                placeholder="Creator's Link"
              />
              <Button onClick={handleUpdate}>Save</Button>
              <Button onClick={() => setEditingId(null)}>Cancel</Button>
            </EditForm>
          ) : (
            <ImageInfo>
              <Title>{image.title}</Title>
              <Description>{image.description}</Description>
              <CreatorLink href={image.creatorLink} target="_blank" rel="noopener noreferrer">
                Creator's Link
              </CreatorLink>
              <div style={{ marginTop: '10px' }}>
                <Button onClick={() => handleEdit(image)}>Edit</Button>
                <Button onClick={() => handleDelete(image.id)}>Delete</Button>
                <Button onClick={() => toggleVisibility(image.id)}>
                  {image.visible ? 'On' : 'Off'}
                </Button>
              </div>
            </ImageInfo>
          )}
        </ImageCard>
      ))}
    </GalleryGrid>
  );

  const renderSimpleView = () => (
    <GalleryGrid>
      {images.filter(image => image.visible).map((image) => (
        <ImageCard
          key={image.id || image.filename}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ImageWrapper>
            <StyledImage
              src={`http://localhost:3000/uploads/${image.filename}`}
              alt={image.title}
            />
          </ImageWrapper>
          <ImageInfo>
            <Title>{image.title}</Title>
            <Description>{image.description}</Description>
            <CreatorLink href={image.creatorLink} target="_blank" rel="noopener noreferrer">
                Creator's Link
              </CreatorLink>
          </ImageInfo>
        </ImageCard>
      ))}
    </GalleryGrid>
  );

  return (
    <Gallery>
      {error && <p>{error}</p>}
      <Button onClick={() => setIsSimpleView(!isSimpleView)}>
        {isSimpleView ? 'Switch to Full View' : 'Switch to Simple View'}
      </Button>
      {isSimpleView ? renderSimpleView() : renderFullView()}
    </Gallery>
  );
};
export default ImageList;