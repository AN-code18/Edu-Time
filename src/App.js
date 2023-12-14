import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "../src/pages/Home.jsx";
import Header from "./components/common/Header";
//import Catalog from "./pages/Catalog";
import About from "./pages/About";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import UpdatePassword from "./pages/UpdatePassword.jsx";
import Error from "./pages/Error";
import Dashboard from "./pages/Dashboard.jsx";
import OpenRoute from "./components/core/Auth/OpenRoute.jsx";
import PrivateRoute from "./components/core/Auth/PrivateRoute.jsx";
import MyProfile from "./components/core/Dashboard/MyProfile.jsx";
import Settings from "./components/core/Dashboard/Settings";

function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        {/*<Route path="catalog/:catalogName" element={<Catalog />} />*/}
        {/* <Route path="courses/:courseId" element={<CourseDetails />} /> */}

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route
          path="signup"
          element={
            <OpenRoute>
              <SignUp />
            </OpenRoute>
          }
        />
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />

        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />}/>
         <Route path="dashboard/Settings" element={<Settings />}/>
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
