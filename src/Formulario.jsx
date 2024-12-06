import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL_EDITAR } from "./App"; // Si es necesario
import { API_URL } from "./App"; 
import { API_URL_CREAR } from "./App"; 
import { Container, Form, Button, Row, Col } from "react-bootstrap"; // Importamos los componentes de Bootstrap

const Formulario = () => {
    const { id } = useParams(); // Captura el parámetro "id" de la URL
    const navigate = useNavigate(); // Para redirigir al usuario después de guardar

    // Estados para los campos del formulario
    const [titulo, setTitulo] = useState("");
    const [sinopsis, setSinopsis] = useState("");
    const [anio, setAnio] = useState("");
    const [poster, setPoster] = useState("");
    const [categoriaId, setCategoriaId] = useState(""); // Para el ID de la categoría

    useEffect(() => {
        if (id) {
            // Si tenemos un ID, es porque estamos editando una película
            fetch(`${API_URL_EDITAR}/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    // Cargar los datos de la película en el formulario
                    setTitulo(data.titulo);
                    setSinopsis(data.director);
                    setAnio(data.anio);
                    setPoster(data.poster);
                    setCategoriaId(data.categoriaId); // Cargar el ID de la categoría
                })
                .catch((error) => {
                    console.error("Error al cargar los datos de la película:", error);
                });
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!titulo || !sinopsis || !anio || !poster) {
            alert("Por favor, completa todos los campos.");
            return;
        }
            
        const peliculaData = {
            titulo,
            director: sinopsis, // Cambia el nombre de la propiedad "sinopsis" a "director" según lo que espera tu backend
            anio,
            poster,
            categorias: [parseInt(categoriaId, 10)], // Convierte categoriaId en un arreglo de números
        };
        
       
        
        try {
            if (id) {
                // Si hay ID, editamos la película existente
                const response = await fetch(`${API_URL_EDITAR}/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(peliculaData),
                });

                if (response.ok) {
                    alert("Película editada con éxito.");
                } else {
                    alert("No se pudo editar la película.");
                }
            } else {
                // Si no hay ID, creamos una nueva película
                const response = await fetch(API_URL_CREAR, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(peliculaData),
                });

                if (response.ok) {
                    alert("Película creada con éxito.");
                } else {
                    alert("No se pudo crear la película.");
                }
            }

            // Después de guardar, redirigimos al usuario al Home
            navigate("/");
        } catch (error) {
            console.error("Error al guardar la película:", error);
            alert("Hubo un problema al guardar la película.");
        }
    };

    return (
        <Container className="my-5">
            <h1 className="mb-4">{id ? "Editar Película" : "Crear Nueva Película"}</h1>
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="formTitulo">
                            <Form.Label>Título</Form.Label>
                            <Form.Control
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                required
                                placeholder="Ingrese el título de la película"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formAnio">
                            <Form.Label>Año</Form.Label>
                            <Form.Control
                                type="number"
                                value={anio}
                                onChange={(e) => setAnio(e.target.value)}
                                required
                                placeholder="Ingrese el año de estreno"
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={12}>
                        <Form.Group controlId="formSinopsis">
                            <Form.Label>Sinopsis</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={sinopsis}
                                onChange={(e) => setSinopsis(e.target.value)}
                                required
                                placeholder="Ingrese una breve sinopsis de la película"
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={12}>
                        <Form.Group controlId="formPoster">
                            <Form.Label>Poster</Form.Label>
                            <Form.Control
                                type="text"
                                value={poster}
                                onChange={(e) => setPoster(e.target.value)}
                                required
                                placeholder="Ingrese la URL del póster de la película"
                            />
                        </Form.Group>
                    </Col>
                </Row>
             
                <Button variant="primary" type="submit">
                    {id ? "Actualizar" : "Crear"}
                </Button>
            </Form>
        </Container>
    );
};

export default Formulario;
