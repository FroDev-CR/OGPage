import { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Form, Button, Alert, Modal, Row, Col } from 'react-bootstrap';
import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Configuración inicial
  const collections = {
    events: {
      fields: ['title', 'date', 'description', 'price', 'image'],
      labels: {
        title: 'Título del Evento*',
        date: 'Fecha y Hora*',
        description: 'Descripción',
        price: 'Precio de Inscripción*',
        image: 'Imagen Promocional'
      },
      required: ['title', 'date', 'price']
    },
    products: {
      fields: ['name', 'description', 'price', 'image', 'category'],
      labels: {
        name: 'Nombre del Producto*',
        description: 'Descripción',
        price: 'Precio*',
        image: 'Imagen del Producto',
        category: 'Categoría'
      },
      required: ['name', 'price']
    }
  };

  // Cargar datos
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const eventsCol = collection(db, 'events');
          const eventsSnapshot = await getDocs(eventsCol);
          setEvents(eventsSnapshot.docs.map(d => ({
            id: d.id,
            title: d.data().title || 'Sin título',
            description: d.data().description || '',
            price: d.data().price || 0,
            date: d.data().date?.toDate() || new Date(),
            image: d.data().image || ''
          })));

          const productsCol = collection(db, 'products');
          const productsSnapshot = await getDocs(productsCol);
          setProducts(productsSnapshot.docs.map(d => ({
            id: d.id,
            name: d.data().name || 'Sin nombre',
            description: d.data().description || '',
            price: d.data().price || 0,
            image: d.data().image || '',
            category: d.data().category || 'Sin categoría'
          })));
        } catch (error) {
          setError('Error cargando datos');
        }
      };
      fetchData();
    }
  }, [user]);

  // Subir imagen a Storage
  const uploadImage = async (file) => {
    try {
      setUploading(true);
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setUploading(false);
      return url;
    } catch (err) {
      setError('Error subiendo imagen');
      setUploading(false);
      return null;
    }
  };

  // Manejar envío de formulario
  const handleSubmit = async (e, type) => {
    e.preventDefault();
    try {
      // Validación de campos requeridos
      const missingFields = collections[type].required.filter(field => !formData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      }

      // Subir imagen si existe
      let imageUrl = formData.image;
      if (formData.imageFile) {
        imageUrl = await uploadImage(formData.imageFile);
        if (!imageUrl) throw new Error('Error subiendo imagen');
      }

      // Crear o actualizar
      const dataToSave = {
        ...formData,
        image: imageUrl,
        ...(type === 'events' && { date: formData.date || new Date() })
      };

      if (currentItem) {
        await updateDoc(doc(db, type, currentItem.id), dataToSave);
        setSuccess('Actualizado exitosamente!');
      } else {
        await addDoc(collection(db, type), {
          ...dataToSave,
          createdAt: new Date()
        });
        setSuccess('Creado exitosamente!');
      }

      resetForm();
    } catch (err) {
      setError(err.message);
    }
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 3000);
  };

  // Editar elemento
  const handleEdit = (item, type) => {
    setCurrentItem(item);
    setFormData({
      ...item,
      date: item.date?.toDate ? item.date.toDate() : item.date
    });
    setShowModal(true);
  };

  // Eliminar elemento
  const handleDelete = async (id, type) => {
    if (window.confirm('¿Confirmar eliminación?')) {
      try {
        await deleteDoc(doc(db, type, id));
        if (type === 'events') {
          setEvents(events.filter(e => e.id !== id));
        } else {
          setProducts(products.filter(p => p.id !== id));
        }
      } catch (error) {
        setError('Error eliminando el elemento');
      }
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({});
    setCurrentItem(null);
    setShowModal(false);
  };

  // Login
  if (!user) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <div className="auth-box p-5 rounded-3 shadow">
          <h2 className="text-center mb-4">Acceso Administrativo</h2>
          <Form onSubmit={async (e) => {
            e.preventDefault();
            const { email, password } = e.target.elements;
            try {
              const userCred = await signInWithEmailAndPassword(
                getAuth(), 
                email.value, 
                password.value
              );
              setUser(userCred.user);
            } catch (err) {
              setError('Credenciales incorrectas');
            }
          }}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" required />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" name="password" required />
            </Form.Group>
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
            <Button variant="primary" type="submit" className="w-100">
              Ingresar
            </Button>
          </Form>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-5 admin-panel">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Panel de Administración</h2>
        <Button variant="danger" onClick={() => setUser(null)}>
          Cerrar Sesión
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
        {Object.entries(collections).map(([key, config]) => (
          <Tab key={key} eventKey={key} title={key === 'events' ? 'Eventos' : 'Productos'}>
            <Button 
              variant="success" 
              className="my-4"
              onClick={() => {
                setCurrentItem(null);
                setShowModal(true);
              }}
            >
              Crear Nuevo {key === 'events' ? 'Evento' : 'Producto'}
            </Button>

            <Row xs={1} md={2} lg={3} className="g-4">
              {(key === 'events' ? events : products).map(item => (
                <Col key={item.id}>
                  <div className="card h-100 shadow-sm">
                    <img 
                      src={item.image || 'https://via.placeholder.com/200x200'} 
                      alt={item.title || item.name}
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{item.title || item.name}</h5>
                      <p className="card-text text-muted small">
                        {item.description?.substring(0, 100) || 'Sin descripción'}...
                      </p>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleEdit(item, key)}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDelete(item.id, key)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Tab>
        ))}
      </Tabs>

      {/* Modal de edición */}
      <Modal show={showModal} onHide={resetForm} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {currentItem ? 'Editar' : 'Crear Nuevo'} {activeTab === 'events' ? 'Evento' : 'Producto'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => handleSubmit(e, activeTab)}>
            {collections[activeTab].fields.map(field => (
              <Form.Group key={field} className="mb-3">
                <Form.Label>
                  {collections[activeTab].labels[field]}
                  {collections[activeTab].required.includes(field) && ' *'}
                </Form.Label>
                
                {field === 'date' ? (
                  <DatePicker
                    selected={formData.date || new Date()}
                    onChange={date => setFormData({...formData, date})}
                    showTimeSelect
                    dateFormat="Pp"
                    className="form-control"
                  />
                ) : field === 'image' ? (
                  <>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => 
                        setFormData({...formData, imageFile: e.target.files[0]})
                      }
                    />
                    {uploading && <small className="text-muted">Subiendo imagen...</small>}
                  </>
                ) : (
                  <Form.Control
                    type={field === 'price' ? 'number' : 'text'}
                    value={formData[field] || ''}
                    onChange={(e) => 
                      setFormData({...formData, [field]: e.target.value})
                    }
                    required={collections[activeTab].required.includes(field)}
                  />
                )}
              </Form.Group>
            ))}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="secondary" onClick={resetForm}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" disabled={uploading}>
                {currentItem ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminPanel;