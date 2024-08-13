import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const UploadContainer = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background-color: #FFFD98;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #283F1C;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  color: #555;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  resize: vertical;
  min-height: 100px;
`;

const FileInput = styled.input`
  margin-bottom: 15px;
`;

const Button = styled(motion.button)`
  background-color: #3F612D;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  align-self: flex-start;

  &:hover {
    background-color: #283F1C;
  }
`;

const ErrorMessage = styled.p`
  color: #d32f2f;
  margin-top: 10px;
`;

const SuccessMessage = styled.p`
  color: #388e3c;
  margin-top: 10px;
`;

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creatorLink, setCreatorLink] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file || !title) {
      setError('Please select a file and provide a title');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('creatorLink', creatorLink);

    try {
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded successfully', response.data);
      setSuccess('Image uploaded successfully!');
      // Reset form fields
      setFile(null);
      setTitle('');
      setDescription('');
      setCreatorLink('');
      // Reset file input
      e.target.reset();
    } catch (error) {
      console.error('Error uploading file:', error.response ? error.response.data : error.message);
      setError('Error uploading file. Please try again.');
    }
  };

  return (
    <UploadContainer>
      <Title>Upload New Image</Title>
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="file">Select Image:</Label>
        <FileInput type="file" id="file" onChange={handleFileChange} accept="image/*" />
        
        <Label htmlFor="title">Title:</Label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter image title"
          required
        />
        
        <Label htmlFor="description">Description:</Label>
        <TextArea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter image description"
        />
        
        <Label htmlFor="creatorLink">Creator's Link:</Label>
        <Input
          type="url"
          id="creatorLink"
          value={creatorLink}
          onChange={(e) => setCreatorLink(e.target.value)}
          placeholder="Enter creator's link"
        />
        
        <Button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Upload
        </Button>
      </Form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
    </UploadContainer>
  );
};

export default UploadForm;