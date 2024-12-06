import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Detalles from "./Detalles";
import Formulario from "./Formulario";
import NotFound from "./NotFound";

const API_URL = 'http://localhost:3000/api/peliculas';
const API_URL_ELIMINAR = 'http://localhost:3000/api/peliculas';
const API_URL_EDITAR = 'http://localhost:3000/api/peliculas';
const API_URL_CREAR = 'http://localhost:3000/api/peliculas';

// Componente principal
const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="detalles/:id" element={<Detalles />} />
                    <Route path="crear" element={<Formulario />} /> {/* Ruta para crear */}
                    <Route path="editar/:id" element={<Formulario />} /> {/* Ruta para editar */}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
export { API_URL, API_URL_EDITAR, API_URL_ELIMINAR, API_URL_CREAR };
