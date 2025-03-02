import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import EventCalendar from '../components/EventCalendar';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <section className="section bg-light">
        <Container>
          <h2 className="section-title">Quiénes Somos</h2>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <motion.p
                className="lead mb-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                En Olympus Garden fusionamos pasión por los TCG con un espacio único para jugadores.
              </motion.p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section">
        <Container>
          <h2 className="section-title">Calendario de Eventos</h2>
          <EventCalendar />
        </Container>
      </section>

      <section className="section bg-dark text-light">
        <Container>
          <Row className="g-4">
            <Col md={4} className="text-center">
              <h3>Ubicación</h3>
              <p>Av. Principal 1234<br/>Santiago, Chile</p>
            </Col>
            <Col md={4} className="text-center">
              <h3>Contacto</h3>
              <p>+56 9 8765 4321<br/>contacto@olympusgarden.cl</p>
            </Col>
            <Col md={4} className="text-center">
              <h3>Horarios</h3>
              <p>Lun-Vie: 10:00 - 20:00<br/>Sab-Dom: 11:00 - 22:00</p>
            </Col>
          </Row>
        </Container>
      </section>
    </motion.div>
  );
}