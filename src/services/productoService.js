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
            await api.post(
                '/productos',
                formData
            );


        return response.data;

    },


    // =================================================
    // ACTUALIZAR PRODUCTO
    // PROPIETARIO
    // =================================================

    async actualizarProducto(
        id,
        formData
    ) {

        if (
            !(formData instanceof FormData)
        ) {

            throw new Error(
                'actualizarProducto debe recibir un FormData'
            );

        }


        const response =
            await api.put(
                `/productos/${id}`,
                formData
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
        formData
    ) {

        if (
            !(formData instanceof FormData)
        ) {

            throw new Error(
                'actualizarProductoAdmin debe recibir un FormData'
            );

        }


        const response =
            await api.put(
                `/productos/admin/${id}`,
                formData
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