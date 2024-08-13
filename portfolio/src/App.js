import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import styled from 'styled-components';
import UploadForm from './UploadForm';
import ImageList from './ImageList';
const AppContainer = styled.div`
  font-family: Arial, sans-serif;
  max-width: 1500px;
  margin: 0 auto;
  padding: 10px;
`;

const Navigation = styled.nav`
  background-color: #3F612D;
  padding: 10px 0;
  border-radius: 50px;
`;

const NavList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
`;

const NavItem = styled.li`
  margin: 0 15px;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 18px;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
    background-color: #283F1C;
    border-radius: 50px;
    padding: 5px;
  }
`;

const HomeContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

const HomeTitle = styled.h1`
  color: #3F612D;
  font-size: 2.5em;
  margin-bottom: 20px;
`;

const HomeDescription = styled.p`
  font-size: 1.2em;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
`;

const App = () => {
  return (
    <Router>
      <AppContainer>
        <Navigation>
          <NavList>
            <NavItem>
              <NavLink to="/">Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/upload">Upload</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/images">Image List</NavLink>
            </NavItem>
          </NavList>
        </Navigation>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadForm />} />
          <Route path="/images" element={<ImageList />} />
        </Routes>
      </AppContainer>
    </Router>
  );
};

const Home = () => (
  <HomeContainer>
    <HomeTitle>Welcome to the Image Upload App</HomeTitle>
    <HomeDescription>
      This application allows you to easily upload, manage, and showcase your images. 
      You can add titles, descriptions, and creator links to each image, making it perfect 
      for photographers, artists, or anyone who wants to create a beautiful image gallery. 
      Use the navigation above to upload new images or view your existing collection.
    </HomeDescription>
  </HomeContainer>
);

export default App;