import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";


import { API_URL_ELIMINAR } from "./App";

const PeliculaCard = ({ pelicula, showSinopsis = false, onDelete }) => {
    const RenderSinopsis = (sinopsis) => {
        if (showSinopsis)
            return (
                <Card.Text>
                    {sinopsis}
                </Card.Text>
            );
        return null;
    };

    const handleDelete = async () => {
        const confirmacion = window.confirm(`¿Estás seguro de que deseas eliminar la película "${pelicula.titulo}"?`);
        if (!confirmacion) return;

        try {
            const response = await fetch(`${API_URL_ELIMINAR}/${pelicula.peliculaId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('No se pudo eliminar la película.');
            }

            alert('Película eliminada exitosamente.');
            onDelete(pelicula.peliculaId); // Notifica al padre que elimine la película del estado.
        } catch (error) {
            console.error(error);
            alert('Hubo un problema al eliminar la película.');
        }
    };

    return (
        <>
            {showSinopsis === true
                ? (
                    <Card style={{ maxWidth: '50rem' }} className="mx-auto">
                        <Card.Header className="small text-end">{pelicula.anio}</Card.Header>
                        <Row className="g-0">
                            <Col sm={4}>
                                <Card.Img
                                    variant="top"
                                    src={pelicula.poster !== 'N/A' ? pelicula.poster : 'https://via.placeholder.com/400'}
                                />
                            </Col>
                            <Col sm={8}>
                                <Card.Body>
                                    <Card.Title>{pelicula.titulo}</Card.Title>
                                    <Card.Subtitle className="mb-2 small text-body-secondary">PELÍCULA</Card.Subtitle>
                                    {RenderSinopsis(pelicula.sinopsis)}
                                </Card.Body>
                            </Col>
                        </Row>
                        <Card.Footer className="small text-uppercase">
                        <Link to={`/editar/${pelicula.peliculaId}`} className="card-link text-decoration-none">Editar</Link>

                            <button
                                className="btn btn-link text-decoration-none text-danger"
                                onClick={handleDelete}
                            >
                                Eliminar
                            </button>
                        </Card.Footer>
                    </Card>
                ) : (
                    <Card style={{ maxWidth: '20rem' }} className="mx-auto h-100">
                        <Card.Header className="small text-end">{pelicula.anio}</Card.Header>
                        <Card.Img
                            variant="top"
                            src={pelicula.poster !== 'N/A' ? pelicula.poster : 'https://via.placeholder.com/400'}
                        />
                        <Card.Body>
                            <Card.Title>{pelicula.titulo}</Card.Title>
                            <Card.Subtitle className="mb-2 small text-body-secondary">PELÍCULA</Card.Subtitle>
                        </Card.Body>
                        <Card.Footer className="small">
                            <Link to={`/Detalles/${pelicula.peliculaId}`} className="card-link text-decoration-none">Detalles</Link>
                        </Card.Footer>
                    </Card>
                )
            }
        </>
    );
};

export default PeliculaCard;
