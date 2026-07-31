
import api from './api.js';


const productoService = {

    // =================================================
    // OBTENER TODOS LOS PRODUCTOS
    // =================================================

    async obtenerProductos() {

        const response =
            await api.get(
                '/productos'
            );

        return response.data;

    },


    // =================================================
    // CREAR PRODUCTO
    // =================================================

    async crearProducto(formData) {

        if (
            !(formData instanceof FormData)
        ) {

            throw new Error(
                'crearProducto debe recibir un FormData'
            );

        }


        const response =
            await fetch(
                'http://localhost:3000/productos',
                {
                    method: 'POST',

                    body: formData
                }
            );


        const resultado =
            await response.json();


        if (
            !response.ok
        ) {

            throw new Error(

                resultado.mensaje ||

                'No se pudo crear el producto'

            );

        }


        return resultado;

    },


    // =================================================
    // ACTUALIZAR PRODUCTO
    // PROPIETARIO
    // =================================================

    async actualizarProducto(
        id,
        producto
    ) {

        const response =
            await api.put(

                `/productos/${id}`,

                producto

            );


        return response.data;

    },


    // =================================================
    // ELIMINAR PRODUCTO
    // PROPIETARIO
    // =================================================

    async eliminarProducto(
        productoId,
        usuarioId
    ) {

        const response =
            await api.delete(

                `/productos/${productoId}`,

                {
                    data: {

                        usuario_id:
                            usuarioId

                    }
                }

            );


        return response.data;

    },


    // =================================================
    // ACTUALIZAR PRODUCTO
    // ADMINISTRADOR
    // =================================================

    async actualizarProductoAdmin(
        id,
        producto
    ) {

        const response =
            await api.put(

                `/productos/admin/${id}`,

                producto

            );


        return response.data;

    },


    // =================================================
    // ELIMINAR PRODUCTO
    // ADMINISTRADOR
    // =================================================

    async eliminarProductoAdmin(
        id
    ) {

        const response =
            await api.delete(

                `/productos/admin/${id}`

            );


        return response.data;

    }

};


export default productoService;
     