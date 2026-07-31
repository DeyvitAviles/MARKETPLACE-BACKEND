
import api from './api.js';


// =====================================================
// OBTENER TODAS LAS CATEGORÍAS
// =====================================================

export async function obtenerCategorias() {

    const response =
        await api.get(
            '/categorias'
        );

    return response.data;

}


// =====================================================
// CREAR CATEGORÍA
// =====================================================

export async function crearCategoria(
    categoria
) {

    const response =
        await api.post(
            '/categorias',
            categoria
        );

    return response.data;

}


// =====================================================
// ACTUALIZAR CATEGORÍA
// =====================================================

export async function actualizarCategoria(
    id,
    categoria
) {

    const response =
        await api.put(

            `/categorias/${id}`,

            categoria

        );

    return response.data;

}


// =====================================================
// ELIMINAR CATEGORÍA
// =====================================================

export async function eliminarCategoria(
    id
) {

    const response =
        await api.delete(

            `/categorias/${id}`

        );

    return response.data;

}


// =====================================================
// SERVICIO POR DEFECTO
// =====================================================
// Esto permite que ProductosView.vue pueda usar:
//
// import categoriaService from '../services/categoriaService.js';
//
// Y luego:
//
// categoriaService.obtenerCategorias();
//
// =====================================================

const categoriaService = {

    obtenerCategorias,

    crearCategoria,

    actualizarCategoria,

    eliminarCategoria

};


export default categoriaService;
   