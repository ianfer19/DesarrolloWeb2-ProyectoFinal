<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // Asegúrate de importar la clase DB si aún no lo has hecho

class ProductosController extends Controller
{

    public function getProductos()
    {
        try {
            $productos = DB::select("SELECT id_producto, nombre, id_tipo, precio FROM productos WHERE fechaeliminacion IS NULL ORDER BY id_producto");
    
            // Mapear los resultados para ajustar la estructura requerida
            $listarProductos = array_map(function($row) {
                return [
                    'id' => $row->id_producto,
                    'nombre' => $row->nombre,
                    'id_tipo' => $row->id_tipo,
                    'precio' => $row->precio
                ];
            }, $productos);
    
            return response()->json($listarProductos, 200);
        } catch (\Exception $e) {
            return response()->json(["message" => "Error al obtener productos: " . $e->getMessage()], 500);
        }
    }
    

    // Método para crear un nuevo producto
    public function postProducto(Request $request)
    {
        $id_tipo = $request->input('id_tipo');
        $nombre = $request->input('nombre');
        $precio = $request->input('precio');

        try {
            $producto = DB::selectOne("INSERT INTO Productos (id_tipo, nombre, precio) VALUES (?, ?, ?) RETURNING *", [$id_tipo, $nombre, $precio]);
            return response()->json($producto, 200);
        } catch (\Exception $e) {
            return response()->json(["message" => "Error al crear producto: " . $e->getMessage()], 500);
        }
    }

    // Método para actualizar un producto por su ID
    public function updateProducto(Request $request, $id)
    {
        $id_tipo = $request->input('id_tipo');
        $nombre = $request->input('nombre');
        $precio = $request->input('precio');

        try {
            $producto = DB::selectOne("UPDATE Productos SET id_tipo = ?, nombre = ?, precio = ? WHERE id_producto = ? RETURNING *", [$id_tipo, $nombre, $precio, $id]);
            return response()->json($producto, 200);
        } catch (\Exception $e) {
            return response()->json(["message" => "Error al actualizar producto: " . $e->getMessage()], 500);
        }
    }

    // Método para eliminar un producto por su ID
    public function deleteProducto($id)
    {
        try {
            DB::update("UPDATE Productos SET fechaEliminacion = now() WHERE id_producto = ?", [$id]);
            return response()->json(["message" => "Producto eliminado correctamente"], 200);
        } catch (\Exception $e) {
            return response()->json(["message" => "Error al eliminar producto: " . $e->getMessage()], 500);
        }
    }
}
