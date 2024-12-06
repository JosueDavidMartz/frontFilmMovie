import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import PeliculaCard from "./PeliculaCard";
import { useParams } from "react-router-dom";
import { API_URL } from "./App";

const Detalles = () =>{
    const { id } = useParams();
    const [pelicula, setPelicula] = useState();

    //Busca una pelicula
    const buscaPelicula = async (id) =>{
        let data = null;
        const response = await fetch(`${API_URL}/${id}`);
        if(response.ok)
            data = await response.json();
        setPelicula(data);

    }

    useEffect(() =>{
        buscaPelicula(id);
    }, [id]);

    return(
        <>
            <h2 className="text-center">Detalle de pelicula</h2>

            <Container className="mt-4">
                {(pelicula != null)
                    ? (
                        <PeliculaCard pelicula={pelicula} showSinopsis={true} key={pelicula.peliculaId} />
                    ) :
                    (
                        <Alert variant="warning">
                            No hay películas encontradas
                        </Alert>
                    )
                }
            </Container>
        </>
    )
}

export default Detalles;