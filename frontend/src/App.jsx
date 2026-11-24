import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import AOS from "aos";
import "aos/dist/aos.css";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

// Student
import StudentDashboard from "./pages/Student/Dashboard";
import SubmitResearchIdea from "./pages/Student/SubmitResearchIdea";
import Results from "./pages/Student/Results";
import PlagiarismChecker from "./pages/Student/PlagiarismChecker";

// Auth
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Supervisor
import Dashboard from "./pages/Supervisor/Dashboard";
import RecommendedIdeas from "./pages/Supervisor/RecommendedIdeas";
import RecommendationDetails from "./pages/Supervisor/RecommendationDetails";
import MySupervisions from "./pages/Supervisor/MySupervisions";
import SupervisionDetails from "./pages/Supervisor/SupervisionDetails";


function App() {

  useEffect(() => {

    AOS.init({
      duration: 900,
      once: true,
      easing: "ease-out",
    });

  }, []);


  return (

    <Routes>

      {/* ================================================== */}
      {/* PUBLIC ROUTES */}
      {/* ================================================== */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* ================================================== */}
      {/* STUDENT ROUTES */}
      {/* ================================================== */}

      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/submit-idea"
        element={
          <ProtectedRoute allowedRole="student">
            <SubmitResearchIdea />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/results"
        element={
          <ProtectedRoute allowedRole="student">
            <Results />
          </ProtectedRoute>
        }
      />

      <Route
  path="/student/plagiarism"
  element={
    <ProtectedRoute allowedRole="student">
      <PlagiarismChecker />
    </ProtectedRoute>
  }
/>


      {/* ================================================== */}
      {/* SUPERVISOR ROUTES */}
      {/* ================================================== */}

      <Route
        path="/supervisor/dashboard"
        element={
          <ProtectedRoute allowedRole="supervisor">
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/supervisor/recommendations"
        element={
          <ProtectedRoute allowedRole="supervisor">
            <RecommendedIdeas />
          </ProtectedRoute>
        }
      />

      <Route
        path="/supervisor/recommendations/:id"
        element={
          <ProtectedRoute allowedRole="supervisor">
            <RecommendationDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/supervisor/supervisions"
        element={
          <ProtectedRoute allowedRole="supervisor">
            <MySupervisions />
          </ProtectedRoute>
        }
      />

      <Route
        path="/supervisor/supervisions/:id"
        element={
          <ProtectedRoute allowedRole="supervisor">
            <SupervisionDetails />
          </ProtectedRoute>
        }
      />

    </Routes>

  );
}

export default App;