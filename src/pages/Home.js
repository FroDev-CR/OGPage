import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <section className="section bg-light">
        <Container>
          <h2 className="section-title text-center">Quiénes Somos</h2>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <p className="lead mb-5">
                En Olympus Garden, fusionamos la pasión por los TCG con un espacio 
                diseñado para verdaderos entusiastas.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section">
        <Container>
          <h2 className="section-title text-center">Calendario de Eventos</h2>
          {/* Componente de calendario aquí */}
        </Container>
      </section>

      <section className="section bg-dark text-light">
        <Container>
          <Row className="g-5">
            <Col md={4} className="text-center">
              <h3>Ubicación</h3>
              <p>Av. Principal 1234<br/>Santiago, Chile</p>
            </Col>
            <Col md={4} className="text-center">
              <h3>Teléfono</h3>
              <p>+56 9 8765 4321</p>
            </Col>
            <Col md={4} className="text-center">
              <h3>Email</h3>
              <p>contacto@olympusgarden.cl</p>
            </Col>
          </Row>
        </Container>
      </section>
    </motion.div>
  );
};

export default Home;