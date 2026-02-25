const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const app = express();
const PORT = 4000;

// DEFINIR EL ESQUEMA DE GRAPHQL
const typeDefs = gql`
    type Libro {
        id: ID!
        titulo: String!
        autor: String!
    }   
    type Query {
        libros: [Libro] #Obtener todos los libros
        libro(id: ID!): Libro #Obtener un libro por ID
    }
        
    type Mutation {
        agregarLibro(titulo: String!, autor: String!): Libro #Agregar un nuevo libro
        actualizarLibro(id: ID!, titulo: String, autor: String): Libro #Actualizar un libro existente
        eliminarLibro(id: ID!): String #Eliminar un libro
    }
`;

// BASE DE DATOS (en memoria)

let libros = [
    { id: 1, titulo: 'Cien Años de Soledad', autor: 'Gabriel García Márquez' },
    { id: 2, titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes' },
    { id: 3, titulo: 'La Sombra del Viento', autor: 'Carlos Ruiz Zafón' }
];

// DEFINIR LOS RESOLVERS
const resolvers = {
    Query: {
        libros: () => libros,
        libro: (parent, args) => libros.find(libro => libro.id === parseInt(args.id))
    },
    Mutation: {
        agregarLibro: (parent, { titulo, autor }) => {
            const nuevoLibro = { id: String(libros.length + 1), titulo, autor };
            libros.push(nuevoLibro);
            return nuevoLibro;
        }
    }
};

// CREAR EL SERVIDOR DE APOLLO
async function startServer() {
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    server.applyMiddleware({ app });

    app.listen(PORT, () => {
        console.log(`Servidor GraphQL corriendo en http://localhost:${PORT}${server.graphqlPath}`);
    });
}

startServer();