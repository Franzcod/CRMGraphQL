const {ApolloServer} =  require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const conectarDB = require('./config/db');

//Conectar base e datos

conectarDB();





//Servidor

const server = new ApolloServer({
    typeDefs,
    resolvers,
    
});

//Arrancar el Servidor
server.listen().then( ({url}) => {
    console.log(`El servidor esta listo en la URL ${url}`)
})