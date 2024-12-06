import { useEffect, useState, useCallback } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import PeliculaCard from "./PeliculaCard";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { API_URL } from "./App";

const Home = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [escuchando, setEscuchando] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const hablar = (mensaje) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(mensaje);
    utterance.lang = "es-ES";
    synth.speak(utterance);
  };

  const buscarPeliculas = useCallback(
    async (titulo, e, isVoiceSearch = false) => {
      if (e) e.preventDefault();
      const response = await fetch(`${API_URL}?s=${titulo}`);
      const data = await response.json();

      setPeliculas(data);

      if (isVoiceSearch) {
        if (!data || data.length === 0) {
          hablar(`Lo siento, no hay resultados para ${titulo}`);
        } else if (data.length === 1) {
          hablar("Se encontró una película relacionada");
        } else {
          hablar("Se encontraron varias películas relacionadas");
        }
      }
    },
    [API_URL]
  );

  const procesarComando = useCallback(
    (texto) => {
      if (texto.includes("buscar")) {
        let query = texto.replace("buscar", "").replace("película", "").trim();
        setSearchTerm(query); // Actualiza el input con el texto limpio
        hablar(`Buscando ${query}`);
        buscarPeliculas(query, null, true); // isVoiceSearch = true
      }
    },
    [buscarPeliculas]
  );

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const recognitionInstance = new window.webkitSpeechRecognition();
      recognitionInstance.lang = "es-ES";
      recognitionInstance.interimResults = false;
      recognitionInstance.continuous = true;

      recognitionInstance.onresult = (event) => {
        const texto = event.results[event.results.length - 1][0].transcript.toLowerCase();
        procesarComando(texto);
      };

      recognitionInstance.onstart = () => setEscuchando(true);
      recognitionInstance.onend = () => setEscuchando(false);

      setRecognition(recognitionInstance);
    } else {
      alert("Tu navegador no soporta el reconocimiento de voz.");
    }
  }, [procesarComando]);

  useEffect(() => {
    buscarPeliculas("", null, false); // Carga inicial sin voz
  }, [buscarPeliculas]);

  const toggleRecognition = () => {
    if (!recognition) return;

    if (escuchando) {
      recognition.stop(); // Detener la escucha
    } else {
      recognition.start(); // Iniciar la escucha
    }
  };

  return (
    <>
      <h2 className="text-center">Catálogo de películas</h2>
      <div className="text-center mb-3">
        <Link to="/crear">
          <Button variant="primary">Agregar Nueva Película</Button>
        </Link>
      </div>

      <Form
        className="d-flex col-md-8 offset-med-2 col-lg-6 offset-lg-3 mt-4"
        onSubmit={(e) => buscarPeliculas(searchTerm, e, false)}
      >
        <Button
          variant="outline-info"
          onClick={toggleRecognition}
          className="d-flex align-items-center"
        >
          {escuchando ? <FaMicrophoneSlash size={30} /> : <FaMicrophone size={30} />}
        </Button>

        <Form.Control
          type="search"
          placeholder="Buscar por título"
          className="me-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="outline-primary" type="submit">
          Buscar
        </Button>
      </Form>

      <Container className="mt-4">
        {peliculas?.length > 0 ? (
          <>
            <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
              {peliculas.map((pelicula) => (
                <Col key={pelicula.peliculaId}>
                  <PeliculaCard pelicula={pelicula} key={pelicula.peliculaId} />
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <Alert variant="warning">No hay películas encontradas.</Alert>
        )}
      </Container>
    </>
  );
};

export default Home;
