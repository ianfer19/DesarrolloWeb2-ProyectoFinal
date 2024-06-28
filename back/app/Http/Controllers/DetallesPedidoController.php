<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class DetallesPedidoController extends Controller
{
    // Método para obtener todos los detalles de pedidos
    public function getDetallesPedido(Request $request)
    {
        try {
            $detallesPedido = DB::table('detalles_pedido')
                ->whereNull('fechaeliminacion')
                ->orderBy('id_detalle')
                ->get();

            return response()->json($detallesPedido, 200);
        } catch (\Exception $e) {
            Log::error("Error al obtener detalles de pedidos: " . $e->getMessage());
            return response()->json(['message' => 'Error interno del servidor'], 500);
        }
    }

    // Método para obtener detalles de pedido por su ID de pedido
    public function getDetallesPedidoByIdPedido(Request $request, $id)
    {
        try {
            $detallesPedido = DB::table('detalles_pedido')
                ->join('productos', 'detalles_pedido.id_producto', '=', 'productos.id_producto')
                ->select('detalles_pedido.*', 'productos.nombre AS nombre_producto')
                ->where('detalles_pedido.id_pedido', $id)
                ->whereNull('detalles_pedido.fechaeliminacion')
                ->orderBy('detalles_pedido.id_detalle')
                ->get();

            return response()->json($detallesPedido, 200);
        } catch (\Exception $e) {
            Log::error("Error al obtener detalles de pedido por ID de pedido: " . $e->getMessage());
            return response()->json(['message' => 'Error interno del servidor'], 500);
        }
    }

// Método para crear un nuevo detalle de pedido
public function postDetallePedido(Request $request)
{
    $request->validate([
        'id_pedido' => 'required|integer',
        'id_producto' => 'required|integer',
        'cantidad' => 'required|integer',
        'subtotal' => 'required|numeric',
        'nota' => 'nullable|string',
    ]);

    try {
        // Guardar los datos del request en una variable local
        $data = [
            'id_pedido' => $request->id_pedido,
            'id_producto' => $request->id_producto,
            'cantidad' => $request->cantidad,
            'subtotal' => $request->subtotal,
            'nota' => $request->nota,
        ];

        // Insertar el nuevo detalle de pedido en la base de datos
        DB::table('detalles_pedido')->insert($data);

        // Devolver los datos del detalle del pedido en la respuesta JSON
        return response()->json($data, 200);
    } catch (\Exception $e) {
        // Devolver el mensaje de error en la respuesta JSON
        return response()->json(['error' => $e->getMessage()], 500);
    }
}


    // Método para actualizar un detalle de pedido por su ID
    public function updateDetallePedido(Request $request, $id)
    {
        $request->validate([
            'id_pedido' => 'required|integer',
            'id_producto' => 'required|integer',
            'cantidad' => 'required|integer',
            'subtotal' => 'required|numeric',
            'nota' => 'nullable|string',
        ]);

        try {
            $updated = DB::table('detalles_pedido')
                ->where('id_detalle', $id)
                ->update([
                    'id_pedido' => $request->id_pedido,
                    'id_producto' => $request->id_producto,
                    'cantidad' => $request->cantidad,
                    'subtotal' => $request->subtotal,
                    'nota' => $request->nota,
                ]);

            if (!$updated) {
                return response()->json(['message' => 'Detalle de pedido no encontrado'], 404);
            }

            return response()->json($updated, 200);
        } catch (\Exception $e) {
            Log::error("Error al actualizar detalle de pedido: " . $e->getMessage());
            return response()->json(['message' => 'Error interno del servidor'], 500);
        }
    }

    // Método para eliminar un detalle de pedido por su ID
    public function deleteDetallePedido(Request $request, $id)
    {
        try {
            $deleted = DB::table('detalles_pedido')
                ->where('id_detalle', $id)
                ->update(['fechaeliminacion' => now()]);

            if (!$deleted) {
                return response()->json(['message' => 'Detalle de pedido no encontrado'], 404);
            }

            return response()->json(['message' => 'Detalle de pedido eliminado correctamente'], 200);
        } catch (\Exception $e) {
            Log::error("Error al eliminar detalle de pedido: " . $e->getMessage());
            return response()->json(['message' => 'Error interno del servidor'], 500);
        }
    }

    // Método para imprimir el detalle de un pedido
    public function imprimirDetallePedido(Request $request)
    {
        $ultimoPedido = DB::raw('SELECT p.id_pedido, p.id_mesa, u.nombre FROM Pedidos p LEFT JOIN usuarios u ON u.id_usuario = p.id_usuario ORDER BY id_pedido DESC LIMIT 1');
        $urlServidorJava = 'http://localhost:8000/impresoraEpson';

        try {
            $idPedidoResult = DB::select($ultimoPedido);
            $id_pedido = $idPedidoResult[0]->id_pedido;
            $id_mesa = $idPedidoResult[0]->id_mesa;
            $nombre_empleado = $idPedidoResult[0]->nombre;

            $detallesPedidoQuery = "
                SELECT dp.id_pedido, p.nombre AS nombre_producto, tp.nombre AS nombre_tipo_producto, dp.cantidad, dp.subtotal, dp.nota
                FROM detalles_pedido dp
                INNER JOIN productos p ON dp.id_producto = p.id_producto
                INNER JOIN productos_tipo tp ON p.id_tipo = tp.id_producto_tipo
                WHERE dp.id_pedido = ? AND dp.fechaeliminacion IS NULL
            ";

            $detallesPedidoResult = DB::select($detallesPedidoQuery, [$id_pedido]);
            $detallesPedido = $detallesPedidoResult;

            $datosFormateados = "ID Pedido: $id_pedido\nMesa: $id_mesa\nMesero: $nombre_empleado\n\nDetalles del Pedido:\n\n";

            foreach ($detallesPedido as $detalle) {
                $datosFormateados .= "$detalle->nombre_tipo_producto\n";
                $datosFormateados .= "Producto: $detalle->nombre_producto\n";
                $datosFormateados .= "  - Cantidad: $detalle->cantidad\n - Nota: $detalle->nota\n\n";
            }

            $datosFormateados .= "--------------------------------------------\n\n\n\n\n\n\n\n\n\n\n\n\n";

            Http::post($urlServidorJava, ['datos' => $datosFormateados]);

            return response()->json(['message' => 'Orden impresa correctamente'], 200);
        } catch (\Exception $e) {
            Log::error("Error al imprimir orden: " . $e->getMessage());
            return response()->json(['message' => 'Error interno del servidor'], 500);
        }
    }
}
