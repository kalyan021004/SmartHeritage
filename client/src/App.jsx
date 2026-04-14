import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css"

import HomePage from './pages/HomePage';
import SiteDetailPage from './pages/SiteDetailPage';
import TourPage from './pages/TourPage';
import ChatPage from './pages/ChatPage';
import QuizPage from './pages/QuizPage';
import ExplorePage from './pages/ExplorePage';
import CategoryPage from './pages/CategoryPage';
import TrailPage from './pages/TrailPage';
import CommunityPage from './pages/CommunityPage';
import StatePage from './pages/StatePage';
import StatesPage from "./pages/StatesPage";
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import SectionPage from "./pages/SectionPage";


import Navbar from './components/HomeComponents/Navbar';
import ProtectedRoute from "./components/ProtectedRoute";

import { LoginPage, RegisterPage } from './pages/AuthPages';
import Footer from './components/HomeComponents/Footer';

export default function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* PUBLIC ROUTES */}

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route path="/" element={<HomePage />} />


        {/* PROTECT EVERYTHING ELSE */}

        <Route
          path="*"
          element={

            <ProtectedRoute>

              <Routes>

                
                <Route
                  path="/site/:slug"
                  element={<SiteDetailPage />}
                />

                <Route
                  path="/tour/:slug"
                  element={<TourPage />}
                />

                <Route
                  path="/chat/:slug"
                  element={<ChatPage />}
                />

                <Route
                  path="/quiz/:slug"
                  element={<QuizPage />}
                />

                <Route
                  path="/explore"
                  element={<ExplorePage />}
                />

                <Route
                  path="/category"
                  element={<CategoryPage />}
                />

                <Route
                  path="/trail"
                  element={<TrailPage />}
                />

                <Route
                  path="/community"
                  element={<CommunityPage />}
                />

                <Route
                  path="/state/:stateName"
                  element={<StatePage />}
                />

                <Route
                  path="/states"
                  element={<StatesPage />}
                />

                <Route
                  path="/about"
                  element={<AboutPage />}
                />

                <Route
                  path="/blogs"
                  element={<BlogPage />}
                />

                <Route
                  path="/site/:slug/:section"
                  element={<SectionPage />}
                />

              </Routes>

            </ProtectedRoute>

          }
        />

      </Routes>
      <Footer></Footer>
  
    </BrowserRouter>

  );

}