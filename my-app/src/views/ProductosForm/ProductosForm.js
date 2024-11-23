import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductosForm.css';

function ProductosForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [modelo, setModelo] = useState('');
  const [cilindros, setCilindros] = useState('');
  const [potencia, setPotencia] = useState('');
  const [precioDiario, setPrecioDiario] = useState('');
  const [motor, setMotor] = useState('');
  const [fotoPrincipal, setFotoPrincipal] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [marca, setMarca] = useState('');
  const [fotosAdicionales, setFotosAdicionales] = useState([]); // Nuevo estado para fotos adicionales

  const [colors, setColors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [motors, setMotors] = useState([]);
  const [colorSeleccionado, setColorSeleccionado] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setNombreUsuario(userInfo.nombre);
    }

    if (id) {
      axios.get(`http://localhost:8080/api/autos/detailed/${id}`)
        .then(response => {
          const carData = response.data;
          setModelo(carData.modelo);
          setCilindros(carData.cilindros);
          setPotencia(carData.potencia);
          setPrecioDiario(carData.precio_diario);
          setMotor(carData.id_motor);
          setNombreUsuario(carData.nombre_usuario);
          setColorSeleccionado(carData.id_color);
          setCategoriaSeleccionada(carData.id_categoria);
          setDescripcion(carData.descripcion);
          setMarca(carData.marca);
        })
        .catch(error => {
          console.error('Error fetching car data:', error);
        });
    }

    const fetchOptions = async () => {
      try {
        const colorsResponse = await axios.get('http://localhost:8080/api/colors');
        setColors(colorsResponse.data);

        const categoriesResponse = await axios.get('http://localhost:8080/api/categorias');
        setCategories(categoriesResponse.data);

        const motorsResponse = await axios.get('http://localhost:8080/api/motores');
        setMotors(motorsResponse.data);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const id_usuario = userInfo ? userInfo.id_usuario : null;

    const carData = {
      modelo,
      cilindros,
      potencia,
      precio_diario: precioDiario,
      id_motor: motor,
      id_color: colorSeleccionado,
      id_categoria: categoriaSeleccionada,
      id_usuario,
      foto_principal: fotoPrincipal ? await convertirFotoAFirebase(fotoPrincipal) : null,
      descripcion,
      marca,
    };

    try {
      let response;
      if (id) {
        response = await axios.put(`http://localhost:8080/api/autos/${id}`, carData, {
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        response = await axios.post('http://localhost:8080/api/autos', carData, {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Guardar fotos adicionales
      await Promise.all(fotosAdicionales.map(async (foto) => {
        await axios.post('http://localhost:8080/api/fotos_autos', {
          id_auto: id || response.data.id_auto, // Usar el ID del auto recién creado o editado
          url_foto: await convertirFotoAFirebase(foto),
        });
      }));

      const userRole = userInfo.id_rol;
      if (userRole === 3) {
        navigate('/admin/productos');
      } else if (userRole === 2) {
        navigate('/renter/productos');
      }

    } catch (error) {
      console.error('Error saving car:', error.response?.data || error.message);
    }
  };

  const convertirFotoAFirebase = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddPhotos = (e) => {
    const files = Array.from(e.target.files);
    if (fotosAdicionales.length + files.length > 5) {
      alert('No puedes subir más de 5 fotos adicionales.');
      return;
    }
    setFotosAdicionales([...fotosAdicionales, ...files]);
  };

  return (
    <div className="styled-form-container">
      <form onSubmit={handleSubmit} className="styled-form">
        <h1>{id ? 'Editar Carro' : 'Agregar Nuevo Carro'}</h1>

        <div className="styled-form-row">
          <div className="styled-form-group">
            <label>Modelo</label>
            <input 
              type="text"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              required
            />
          </div>
          <div className="styled-form-group">
            <label>Cilindros</label>
            <input 
              type="number"
              value={cilindros}
              onChange={(e) => setCilindros(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="styled-form-row">
          <div className="styled-form-group">
            <label>Potencia</label>
            <input 
              type="number"
              value={potencia}
              onChange={(e) => setPotencia(e.target.value)}
              required
            />
          </div>
          <div className="styled-form-group">
            <label>Precio Diario</label>
            <input 
              type="number"
              value={precioDiario}
              onChange={(e) => setPrecioDiario(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="styled-form-row">
          <div className="styled-form-group">
            <label>Marca</label>
            <input 
              type="text"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              required
            />
          </div>
          <div className="styled-form-group">
            <label>Descripción</label>
            <textarea 
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="styled-form-row">
          <div className="styled-form-group">
            <label>Motor</label>
            <select value={motor} onChange={(e) => setMotor(e.target.value)} required>
              <option value="">Selecciona un motor</option>
              {motors.map(motor => (
                <option key={motor.id_motor} value={motor.id_motor}>{motor.tipo_motor}</option>
              ))}
            </select>
          </div>
          <div className="styled-form-group">
            <label>Color</label>
            <select value={colorSeleccionado} onChange={(e) => setColorSeleccionado(e.target.value)} required>
              <option value="">Selecciona un color</option>
              {colors.map(color => (
                <option key={color.id_color} value={color.id_color}>{color.descripcion}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="styled-form-group">
          <label>Categoría</label>
          <select value={categoriaSeleccionada} onChange={(e) => setCategoriaSeleccionada(e.target.value)} required>
            <option value="">Selecciona una categoría</option>
            {categories.map(category => (
              <option key={category.id_categoria} value={category.id_categoria}>{category.nombre_categoria}</option>
            ))}
          </select>
        </div>

        <div className="styled-form-group">
          <label>Foto Principal</label>
          <input 
            type="file"
            onChange={(e) => setFotoPrincipal(e.target.files[0])}
          />
        </div>

        <div className="styled-form-group">
          <label>Fotos Adicionales (máx. 5)</label>
          <input 
            type="file"
            multiple
            accept="image/*"
            onChange={handleAddPhotos}
          />
        </div>

        <div className="styled-form-group">
          <label>Subido por</label>
          <input 
            type="text"
            value={nombreUsuario}
            readOnly
          />
        </div>

        <button type="submit" className="styled-form-button">
          {id ? 'Guardar Cambios' : 'Agregar Carro'}
        </button>
      </form>
    </div>
  );
}

export default ProductosForm;
