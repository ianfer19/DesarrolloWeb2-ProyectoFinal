<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductoTipoController extends Controller
{
    public function getProductosTipo()
    {
        try {
            $productosTipo = DB::table('productos_tipo')
                ->whereNull('fechaeliminacion')
                ->orderBy('id_producto_tipo')
                ->get();
    
            return response()->json($productosTipo, 200);
        } catch (\Exception $e) {
            // Devolver el mensaje de error en la respuesta JSON
            return response()->json(['message' => 'Error interno del servidor: ' . $e->getMessage()], 500);
        }
    }
    
    

    public function getProductosTipoCocina2()
    {
        try {
            $productosCocina = DB::table('pedidos as p')
                ->join('detalles_pedido as dp', 'p.id_pedido', '=', 'dp.id_pedido')
                ->join('productos as prod', 'dp.id_producto', '=', 'prod.id_producto')
                ->join('productos_tipo as pt', 'prod.id_tipo', '=', 'pt.id_producto_tipo')
                ->whereIn('pt.id_producto_tipo', [10, 13])
                ->select('p.*')
                ->get();

            if ($productosCocina->isEmpty()) {
                return response()->json(['message' => 'En este momento no hay pedidos de Asados o Dorilocos.'], 404);
            }

            return response()->json($productosCocina, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error interno del servidor'], 500);
        }
    }

    public function postProductoTipo(Request $request)
    {
        try {
            $nombre = $request->input('nombre');

            $id = DB::table('productos_tipo')
                ->insertGetId(['nombre' => $nombre]);

            return response()->json(['id' => $id], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error interno del servidor'], 500);
        }
    }

    public function updateProductoTipo(Request $request, $id)
    {
        try {
            $nombre = $request->input('nombre');

            DB::table('productos_tipo')
                ->where('id_producto_tipo', $id)
                ->update(['nombre' => $nombre]);

            return response()->json(['message' => 'Tipo de producto actualizado correctamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error interno del servidor'], 500);
        }
    }

    public function deleteProductoTipo($id)
    {
        try {
            DB::table('productos_tipo')
                ->where('id_producto_tipo', $id)
                ->update(['fechaeliminacion' => now()]);

            return response()->json(['message' => 'Tipo de producto eliminado correctamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error interno del servidor'], 500);
        }
    }
}
