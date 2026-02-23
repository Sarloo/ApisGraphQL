// Endpoint base del backend para la coleccion de libros.
const API_URL = '/api/libros';

// Referencias a elementos del DOM para manipular formulario y lista.
const form = document.getElementById('libro-form');
const inputId = document.getElementById('libro-id');
const inputTitulo = document.getElementById('titulo');
const inputAutor = document.getElementById('autor');
const guardarBtn = document.getElementById('guardar-btn');
const cancelarBtn = document.getElementById('cancelar-btn');
const listaLibros = document.getElementById('lista-libros');

// Consulta todos los libros al backend y los renderiza.
async function obtenerLibros() {
  const response = await fetch(API_URL);
  const libros = await response.json();
  renderLibros(libros);
}

// Pinta la lista completa en el DOM.
function renderLibros(libros) {
  // Mensaje por defecto cuando no hay datos.
  if (!libros.length) {
    listaLibros.innerHTML = '<li class="libro-item">No hay libros registrados.</li>';
    return;
  }

  // Construye cada tarjeta con sus botones de accion.
  listaLibros.innerHTML = libros
    .map(
      (libro) => `
      <li class="libro-item">
        <h3>${escapeHtml(libro.titulo)}</h3>
        <p>Autor: ${escapeHtml(libro.autor)}</p>
        <div class="item-actions">
          <button class="btn-editar" data-id="${libro.id}" data-titulo="${escapeHtml(libro.titulo)}" data-autor="${escapeHtml(libro.autor)}">Editar</button>
          <button class="btn-eliminar" data-id="${libro.id}">Eliminar</button>
        </div>
      </li>
    `
    )
    .join('');
}

// Llena el formulario con un libro existente para editarlo.
function activarModoEdicion(libro) {
  inputId.value = libro.id;
  inputTitulo.value = libro.titulo;
  inputAutor.value = libro.autor;
  guardarBtn.textContent = 'Guardar cambios';
  cancelarBtn.classList.remove('hidden');
}

// Regresa el formulario al estado inicial (modo crear).
function limpiarFormulario() {
  form.reset();
  inputId.value = '';
  guardarBtn.textContent = 'Agregar libro';
  cancelarBtn.classList.add('hidden');
}

// Maneja el submit del formulario para crear o actualizar.
form.addEventListener('submit', async (event) => {
  // Evita que el navegador recargue la pagina al enviar.
  event.preventDefault();

  // Lee y limpia los valores ingresados.
  const payload = {
    titulo: inputTitulo.value.trim(),
    autor: inputAutor.value.trim(),
  };

  // Validacion basica en cliente.
  if (!payload.titulo || !payload.autor) return;

  // Si hay ID estamos editando, si no estamos creando.
  const libroId = inputId.value;
  const method = libroId ? 'PUT' : 'POST';
  const url = libroId ? `${API_URL}/${libroId}` : API_URL;

  // Envia la peticion al backend.
  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  // Limpia y vuelve a cargar el listado actualizado.
  limpiarFormulario();
  await obtenerLibros();
});

// Permite salir del modo edicion sin guardar cambios.
cancelarBtn.addEventListener('click', () => {
  limpiarFormulario();
});

// Delegacion de eventos para botones dinamicos de cada item.
listaLibros.addEventListener('click', async (event) => {
  const target = event.target;

  // Elimina un libro por su ID.
  if (target.classList.contains('btn-eliminar')) {
    const id = target.dataset.id;
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    await obtenerLibros();
    return;
  }

  // Activa edicion cargando los datos en el formulario.
  if (target.classList.contains('btn-editar')) {
    activarModoEdicion({
      id: target.dataset.id,
      titulo: target.dataset.titulo,
      autor: target.dataset.autor,
    });
  }
});

// Escapa texto para evitar inyeccion HTML al renderizar.
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Carga inicial de datos al abrir la pagina.
obtenerLibros();
