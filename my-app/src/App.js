import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './views/Home/Home';
import Cars from './views/Cars/Cars';
import Contacts from './views/Contacts/Contacts';
import Login from './views/Login/Login';
import Register from './views/Register/Register';
import Ticket from './views/Ticket/Ticket';
import UserList from './views/UserList/UserList';
import UserForm from './views/UserForm/UserForm';
import ComprasList from './views/Compras/ComprasList';
import ComprasForm from './views/Compras/ComprasForm';
import ProductosList from './views/ProductosList/ProductosList';
import ProductosForm from './views/ProductosForm/ProductosForm';
import ProfileView from './views/Profile/ProfileView';
import EditProfileForm from './views/Profile/EditProfileForm';
import CarDetail from './views/CarDetail/CarDetail';
import AdminPanel from './views/AdminPanel/AdminPanel';
import RenterPanel from './views/RenterPanel/RenterPanel';
import RenterRegister from './views/RenterRegister/RenterRegister';
import DashboardA from './views/DashboardA/DashboardA';
import DashboardR from './views/DashboardR/DashboardR';
import RenterRoute from './components/RenterRoute';
import ConnectionStatus from "./components/ConnectionStatus"; // NUEVO CAMBIO

// Nuevas importaciones para ofertas y cupones
import OfertasList from './views/OfertasList/OfertasList';
import OfertasForm from './views/OfertasForm/OfertasForm';
import CuponesList from './views/CuponesList/CuponesList';
import CuponesForm from './views/CuponesForm/CuponesForm';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    
    <Router>
      <div>
        {!["/login", "/register", "/renter-register"].includes(window.location.pathname) && <NavBar />}
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/ticket" element={<Ticket />} />
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={isAuthenticated ? <Navigate to="/" /> : <Register />} 
            />
            <Route 
              path="/renter-register" 
              element={isAuthenticated ? <Navigate to="/" /> : <RenterRegister />} 
            />
            <Route path="/usuarios" element={<UserList />} />
            <Route path="/usuarios/create" element={<UserForm />} />
            <Route path="/usuarios/edit/:id" element={<UserForm />} />
            <Route path="/compras" element={<ComprasList />} />
            <Route path="/compras/new" element={<ComprasForm />} />
            <Route path="/compras/edit/:id" element={<ComprasForm />} />
            <Route path="/productos" element={<ProductosList />} />
            <Route path="/productos/new" element={<ProductosForm />} />
            <Route path="/productos/edit/:id" element={<ProductosForm />} />
            <Route path="/profile" element={<ProfileView />} />
            <Route path="/profile/edit" element={<EditProfileForm />} />
            <Route path="/carros/:id" element={<CarDetail />} />

            {/* Rutas para ofertas */}
            <Route path="/ofertas" element={<OfertasList />} />
            <Route path="/ofertas/new" element={<OfertasForm />} />
            <Route path="/ofertas/edit/:id" element={<OfertasForm />} />

            {/* Rutas para cupones */}
            <Route path="/cupones" element={<CuponesList />} />
            <Route path="/cupones/new" element={<CuponesForm />} />
            <Route path="/cupones/edit/:id" element={<CuponesForm />} />

            {/* Rutas dentro del panel de administrador */}
            <Route path="/admin" element={<AdminPanel />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardA />} />
              <Route path="usuarios" element={<UserList />} />
              <Route path="productos" element={<ProductosList />} />
              <Route path="productos/new" element={<ProductosForm />} />
              <Route path="productos/edit/:id" element={<ProductosForm />} />
              <Route path="ofertas" element={<OfertasList />} />
              <Route path="ofertas/new" element={<OfertasForm />} />
              <Route path="ofertas/edit/:id" element={<OfertasForm />} />
              <Route path="cupones" element={<CuponesList />} />
              <Route path="cupones/new" element={<CuponesForm />} />
              <Route path="cupones/edit/:id" element={<CuponesForm />} />
              <Route path="profile" element={<ProfileView />} />
              <Route path="profile/edit" element={<EditProfileForm />} />
            </Route>

            {/* Rutas dentro del panel de arrendador */}
            <Route path="/renter" element={<RenterPanel />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardR />} />
              <Route path="productos" element={<ProductosList />} />
              <Route path="productos/new" element={<ProductosForm />} />
              <Route path="productos/edit/:id" element={<ProductosForm />} />
              <Route path="ofertas" element={<OfertasList />} />
              <Route path="ofertas/new" element={<OfertasForm />} />
              <Route path="ofertas/edit/:id" element={<OfertasForm />} />
              <Route path="cupones" element={<CuponesList />} />
              <Route path="cupones/new" element={<CuponesForm />} />
              <Route path="cupones/edit/:id" element={<CuponesForm />} />
              <Route path="profile" element={<ProfileView />} />
              <Route path="profile/edit" element={<EditProfileForm />} />
            </Route>
          </Routes>
        </div>
      </div>
      <ConnectionStatus /> {/* NUEVO CAMBIO */}
    </Router>
  );
}

export default App;
