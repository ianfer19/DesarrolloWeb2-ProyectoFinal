<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class FacturasController extends Controller
{
    // Método para obtener todas las facturas
    public function getFacturas(Request $request)
    {
        try {
            $facturas = DB::table('facturas')
                ->join('usuarios', 'facturas.id_empleado', '=', 'usuarios.id_usuario')
                ->select('facturas.*', 'usuarios.nombre AS nombre_empleado', 'usuarios.usuario AS usuario_empleado')
                ->whereNull('facturas.fechaeliminacion')
                ->get();

            return response()->json($facturas, 200);
        } catch (\Exception $e) {
            // Devolver el mensaje de error en la respuesta JSON
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Método para obtener una factura por su ID
    public function getFacturasById(Request $request, $id)
    {
        try {
            $factura = DB::table('facturas')
                ->where('id_factura', $id)
                ->whereNull('fechaeliminacion')
                ->first();

            if (!$factura) {
                return response()->json(['message' => 'Factura no encontrada'], 404);
            }

            return response()->json($factura, 200);
        } catch (\Exception $error) {
            Log::error("Error al obtener factura por ID: " . $error->getMessage());
            return response()->json(['message' => 'Error interno del servidor'], 500);
        }
    }

    // Método para obtener una factura por el ID de un pedido
    public function getFacturasByIdPedido(Request $request, $id)
    {
        try {
            $factura = DB::table('facturas')
                ->where('id_pedido', $id)
                ->whereNull('fechaeliminacion')
                ->first();

            if (!$factura) {
                return response()->json(['message' => 'Factura no encontrada'], 404);
            }

            return response()->json($factura, 200);
        } catch (\Exception $error) {
            Log::error("Error al obtener factura por ID de pedido: " . $error->getMessage());
            return response()->json(['message' => 'Error interno del servidor'], 500);
        }
    }
    
    public function postFactura(Request $request)
    {
        $request->validate([
            'id_pedido' => 'required|integer',
            'fecha_factura' => 'required|date',
            'id_empleado' => 'nullable|integer',
            'descuento_por' => 'nullable|numeric',
            'adescuento_val' => 'nullable|numeric',
            'total_factura' => 'required|numeric',
            'nequi' => 'nullable|numeric',
            'bancolombia' => 'nullable|numeric',
            'efectivo' => 'nullable|numeric',
        ]);
    
        try {
            // Insertar la factura en la base de datos
            DB::table('facturas')->insert([
                'id_pedido' => $request->id_pedido,
                'fecha_factura' => $request->fecha_factura,
                'id_empleado' => $request->id_empleado,
                'descuento_por' => $request->descuento_por,
                'adescuento_val' => $request->adescuento_val,
                'total_factura' => $request->total_factura,
                'nequi' => $request->nequi,
                'bancolombia' => $request->bancolombia,
                'efectivo' => $request->efectivo,
            ]);
    
            // Obtener la factura creada
            $factura = DB::table('facturas')
                ->where('id_pedido', $request->id_pedido)
                ->first();
    
            // Obtener los datos del pedido
            $pedido = DB::table('pedidos')
                ->where('id_pedido', $request->id_pedido)
                ->first();
    
            // Obtener el nombre del cliente asociado
            $cliente = DB::table('clientes')
                ->where('id_cliente', $pedido->id_cliente)
                ->value('nombre'); // Obtener solo el nombre del cliente
    
            // Obtener los detalles del pedido
            $detalles_pedido = DB::table('detalles_pedido')
                ->where('id_pedido', $request->id_pedido)
                ->get();
    
            // Construir la respuesta en el orden requerido
            $response = [
                'factura' => $factura,
                'pedido' => $pedido,
                'id_cliente' => $cliente, // Agregar el nombre del cliente como id_cliente
                'detalles_pedido' => $detalles_pedido,
            ];
    
            return response()->json($response, 200);
        } catch (\Exception $e) {
            // Devolver el mensaje de error en la respuesta JSON
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
     

    // Método para actualizar una factura por el ID de un pedido
    public function updateFactura(Request $request, $id_pedido)
    {
        $request->validate([
            'nequi' => 'required|numeric',
            'bancolombia' => 'required|numeric',
            'efectivo' => 'required|numeric',
        ]);

        $nequi = $request->nequi;
        $bancolombia = $request->bancolombia;
        $efectivo = $request->efectivo;

        try {
            DB::table('facturas')
                ->where('id_pedido', $id_pedido)
                ->update([
                    'nequi' => $nequi,
                    'bancolombia' => $bancolombia,
                    'efectivo' => $efectivo,
                ]);

            return response()->json(['message' => 'Factura actualizada correctamente'], 200);
        } catch (\Exception $error) {
            Log::error("Error al actualizar factura: " . $error->getMessage());
            return response()->json(['message' => 'Error interno del servidor'], 500);
        }
    }

    // Método para eliminar una factura por su ID
    public function deleteFactura(Request $request, $id)
    {
        try {
            DB::table('facturas')
                ->where('id_factura', $id)
                ->update(['fechaeliminacion' => now()]);

            return response()->json(['message' => 'Factura eliminada correctamente'], 200);
        } catch (\Exception $error) {
            Log::error("Error al eliminar factura: " . $error->getMessage());
            return response()->json(['message' => 'Error interno del servidor'], 500);
        }
    }
}