import PrivateRoute from '@components/PrivateRoute';
import Home from '@pages/home/Index';
import Login from '@layouts/Login';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        {/* Start route group need protect */}
        {/* <Route element={<PrivateRoute><Outlet /></PrivateRoute>}> */}
          <Route
            path="/"
            element={
              <Home />
            }
          />
          <Route
            path="/dashboard"
            element={
              <Home />
            }
          />
        {/* </Route> */}
        {/* End route group need protect */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
