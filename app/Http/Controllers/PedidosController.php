<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PedidosController extends Controller
{
    // Método para obtener todos los pedidos
    public function getPedidos(Request $request)
    {
        try {
            $pedidos = DB::table('pedidos')
                ->join('clientes', 'pedidos.id_cliente', '=', 'clientes.id_cliente')
                ->select('pedidos.*', 'clientes.nombre as nombre_cliente')
                ->whereNull('pedidos.fechaeliminacion')
                ->orderBy('pedidos.id_pedido')
                ->get();
            
            return response()->json($pedidos, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error interno del servidor: ' . $e->getMessage()], 500);
        }
    }

    // Método para obtener un pedido por su ID
    public function getPedidoById(Request $request, $id)
    {
        try {
            $pedido = DB::table('pedidos')
                ->where('id_pedido', $id)
                ->whereNull('pedidos.fechaeliminacion')
                ->first();
            
            if (!$pedido) {
                return response()->json(['message' => 'Pedido no encontrado'], 404);
            }

            return response()->json($pedido, 200);
        } catch (\Exception $error) {
            Log::error("Error al obtener pedido por ID: " . $error->getMessage());
            return response()->json(['message' => 'Error interno del servidor'], 500);
        }
    }

    // Método para obtener todos los pedidos de empleados
    public function getPedidosEmpleados(Request $request)
    {
        try {
            $pedidosEmpleados = DB::table('pedidos')
                ->join('clientes', 'pedidos.id_cliente', '=', 'clientes.id_cliente')
                ->select('pedidos.*', 'clientes.nombre as nombre_cliente')
                ->whereRaw('(pedidos.estado IS NULL OR pedidos.estado <> 3)')
                ->whereNull('pedidos.fechaeliminacion')
                ->orderByRaw('CASE WHEN pedidos.estado IS NULL THEN 1 ELSE 0 END, pedidos.estado DESC')
                ->get();
            
            return response()->json($pedidosEmpleados, 200);
        } catch (\Exception $e) {
            // Devolver el mensaje de error en la respuesta JSON
            return response()->json(['message' => 'Error interno del servidor: ' . $e->getMessage()], 500);
        }
    }

// Método para crear un nuevo pedido
public function postPedido(Request $request)
{
    $request->validate([
        'id_cliente' => 'required|integer',
        'id_mesa' => 'required|integer',
        'fecha_pedido' => 'required|date',
        'tipo_pedido' => 'required|string',
        'total_pedido' => 'required|numeric',
    ]);

    try {
        $data = [
            'id_cliente' => $request->id_cliente,
            'id_mesa' => $request->id_mesa,
            'fecha_pedido' => $request->fecha_pedido,
            'tipo_pedido' => $request->tipo_pedido,
            'total_pedido' => $request->total_pedido,
        ];

        $id_pedido = DB::table('pedidos')->insertGetId($data, 'id_pedido');

        $data['id_pedido'] = $id_pedido;

        return response()->json($data, 200);
    } catch (\Exception $e) {
        // Devolver el mensaje de error en la respuesta JSON
        return response()->json(['error' => $e->getMessage()], 500);
    }
}



    // Método para actualizar un pedido por su ID
    public function updatePedido(Request $request, $id)
    {
        $request->validate([
            'id_cliente' => 'required|integer',
            'id_mesa' => 'required|integer',
            'fecha_pedido' => 'required|date',
            'tipo_pedido' => 'required|string',
            'total_pedido' => 'required|numeric',
            'estado' => 'nullable|integer',
        ]);

        try {
            $updated = DB::table('pedidos')
                ->where('id_pedido', $id)
                ->update([
                    'id_cliente' => $request->id_cliente,
                    'id_mesa' => $request->id_mesa,
                    'fecha_pedido' => $request->fecha_pedido,
                    'tipo_pedido' => $request->tipo_pedido,
                    'total_pedido' => $request->total_pedido,
                    'estado' => $request->estado,
                ]);

            if (!$updated) {
                return response()->json(['message' => 'Pedido no encontrado'], 404);
            }

            return response()->json($updated, 200);
        } catch (\Exception $error) {
            Log::error("Error al actualizar pedido: " . $error->getMessage());
            return response()->json(['message' => 'Error interno del servidor'], 500);
        }
    }

    // Método para eliminar un pedido por su ID
    public function deletePedido(Request $request, $id)
    {
        try {
            $deleted = DB::table('pedidos')
                ->where('id_pedido', $id)
                ->update(['fechaeliminacion' => now()]);
            
            if (!$deleted) {
                return response()->json(['message' => 'Pedido no encontrado'], 404);
            }

            return response()->json(['message' => 'Pedido eliminado correctamente'], 200);
        } catch (\Exception $error) {
            Log::error("Error al eliminar pedido: " . $error->getMessage());
            return response()->json(['message' => 'Error interno del servidor'], 500);
        }
    }
}
