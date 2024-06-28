<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ClientesController extends Controller
{
    // Método para obtener todos los clientes
    public function getClientes()
    {
        try {
            $clientes = DB::table('clientes')
                            ->whereNull('fechaeliminacion')
                            ->orderBy('id_cliente')
                            ->get();

            return response()->json($clientes, 200);
        } catch (\Exception $e) {
            Log::error('Error al obtener clientes: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno del servidor'], 500);
        }
    }

    // Método para crear un nuevo cliente
    public function postCliente(Request $request)
    {
        try {
            $cliente = DB::table('clientes')->insert([
                'cc' => $request->input('cc'),
                'nombre' => $request->input('nombre'),
                'telefono' => $request->input('telefono'),
                'direccion' => $request->input('direccion'),
                'fechacumple' => $request->input('fechacumple'),
                'fechaeliminacion' => null // por defecto
            ]);

            return response()->json(['id_cliente' => $cliente], 200);
        } catch (\Exception $e) {
            Log::error('Error al crear cliente: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno del servidor'], 500);
        }
    }

    // Método para actualizar un cliente por su ID
    public function updateCliente(Request $request, $id)
    {
        try {
            DB::table('clientes')
                ->where('id_cliente', $id)
                ->update([
                    'cc' => $request->input('cc'),
                    'nombre' => $request->input('nombre'),
                    'telefono' => $request->input('telefono'),
                    'direccion' => $request->input('direccion'),
                    'fechacumple' => $request->input('fechacumple')
                ]);

            return response()->json(['message' => 'Cliente actualizado correctamente'], 200);
        } catch (\Exception $e) {
            Log::error('Error al actualizar cliente: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno del servidor'], 500);
        }
    }

    // Método para eliminar un cliente por su ID
    public function deleteCliente($id)
    {
        try {
            DB::table('clientes')
                ->where('id_cliente', $id)
                ->update(['fechaeliminacion' => now()]);

            return response()->json(['message' => 'Cliente eliminado correctamente'], 200);
        } catch (\Exception $e) {
            Log::error('Error al eliminar cliente: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno del servidor'], 500);
        }
    }
}
