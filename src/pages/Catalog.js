import { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs } from "firebase/firestore";

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="section"
    >
      <Container>
        <h2 className="section-title text-center">Nuestro Catálogo</h2>
        <Row className="g-4">
          {products.map(product => (
            <Col key={product.id} lg={4} md={6}>
              <motion.div
                className="product-card rounded-3 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="img-fluid w-100"
                  style={{ height: '300px', objectFit: 'cover' }}
                />
                <div className="p-4">
                  <h3 className="h5 mb-3">{product.name}</h3>
                  <p className="text-muted small mb-3">{product.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="h5 text-primary">${product.price}</span>
                  </div>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </motion.div>
  );
};

export default Catalog;