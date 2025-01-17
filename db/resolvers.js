
const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});



const crearToken = ( usuario, secreta, expiresIn ) => {
    console.log(usuario);

    const {id, email, nombre, apellido} = usuario;

    return jwt.sign( { id, email, nombre, apellido } , secreta, {expiresIn} )
}

//Resolver

const resolvers = {

    Query: {
        obtenerUsuario: async ( _ , {token}) => {
            const usuarioId = await jwt.verify( token, process.env.SECRETA)

            return usuarioId
        }
    },

    Mutation: {
        nuevoUsuario: async ( _ , {input} ) => {

            const {email, password}  = input;
            
            //Revisar si el usuraio esta registrado

            const existeUsuario = await Usuario.findOne({email});

            if(existeUsuario){
                throw new Error ('El usuario ya esta registrado');
            }
           
            //Hashear su password
            //intalar libreria : npm i bcryptjs

            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password,salt);

            //Gaurdarlo en Base de Datos

            try{
                const usuario = new Usuario(input);
                usuario.save(); //Guardado
                return usuario;
            } catch{
                console.log(error);
            }

        },

        autenticarUsuario: async ( _ , {input}) => {

            const { email , password } = input;

            //Si el usuario existe
            const existeUsuario = await Usuario.findOne({email});
            if(!existeUsuario){
                throw new Error ('El usuario no existe');
            }

            //Revisar si el password es correcto

            const passwordCorrecto = await bcryptjs.compare( password, existeUsuario.password);

            if(!passwordCorrecto){
                throw new Error("El password es incorrecto");
            }



            //Crear token

            return {
                token: crearToken(existeUsuario, process.env.SECRETA, '24h' )
            }

        },
        nuevoProducto: async ( _ , {input}) => {
            try {
                const producto = new Producto(input);

                //Almacenar en Base de Datos
                const resultado = await producto.save();
                return resultado;
                
            } catch (error) {
                console.log(error);
            }
        }

    }

}

module.exports = resolvers;