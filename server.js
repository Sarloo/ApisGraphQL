// Importa Express para crear el servidor HTTP y las rutas API.
const express = require('express');
// Crea la aplicacion de Express.
const app = express();
// Puerto donde correra el servidor local.
const PORT = 3000; 

// Habilita lectura de JSON en el body de las peticiones.
app.use(express.json());
// Sirve archivos estaticos desde la carpeta public (HTML, CSS, JS).
app.use(express.static('public'));

// BASE DE DATOS EN MEMORIA (se reinicia al apagar el servidor).

// Arreglo inicial de libros.
let libros = [
    { id: 1, titulo: 'Cien Años de Soledad', autor: 'Gabriel García Márquez' },
    { id: 2, titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes' },
    { id: 3, titulo: 'La Sombra del Viento', autor: 'Carlos Ruiz Zafón' }
]
// Contador para asignar IDs unicos al crear nuevos libros.
let nextId = 4;

// GET /api/libros -> devuelve todos los libros.
app.get('/api/libros', (req, res) => {
    // Responde con el arreglo actual en formato JSON.
    res.json(libros);
});

// POST /api/libros -> agrega un nuevo libro.
app.post('/api/libros', (req, res) => {
    // Valida que se reciban titulo y autor.
    if (!req.body.titulo || !req.body.autor) {
        return res.status(400).json({ message: 'Titulo y autor son obligatorios' });
    }

    // Construye el nuevo libro con ID incremental.
    const nuevoLibro = {
        id: nextId++,
        titulo: req.body.titulo,
        autor: req.body.autor
    };

    // Guarda el libro en memoria.
    libros.push(nuevoLibro);
    // Devuelve el recurso creado con codigo 201.
    res.status(201).json(nuevoLibro);
}); 

// PUT /api/libros/:id -> actualiza un libro existente.
app.put('/api/libros/:id', (req, res) => {
    // Convierte el ID de parametro (string) a numero.
    const libroId = parseInt(req.params.id);
    // Busca el libro por ID.
    const libro = libros.find(b => b.id === libroId);

    // Si existe, actualiza solo los campos enviados.
    if (libro) {
        libro.titulo = req.body.titulo || libro.titulo;
        libro.autor = req.body.autor || libro.autor;
        // Responde con el libro actualizado.
        res.json(libro);
    } else {
        // Si no existe, responde 404.
        res.status(404).json({ message: 'Libro no encontrado' });
    }
});

// DELETE /api/libros/:id -> elimina un libro por ID.
app.delete('/api/libros/:id', (req, res) => {
    // Convierte el ID de parametro a numero.
    const libroId = parseInt(req.params.id);
    // Busca el indice del libro en el arreglo.
    const index = libros.findIndex(b => b.id === libroId);

    // Si se encontro, elimina una posicion.
    if (index !== -1) {
        libros.splice(index, 1);
        // Confirma eliminacion.
        res.json({ message: 'Libro eliminado' });
    } else {
        // Si no existe, responde 404.
        res.status(404).json({ message: 'Libro no encontrado' });
    }
});

// Inicia el servidor y muestra la URL local.
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
