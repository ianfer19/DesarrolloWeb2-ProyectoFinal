<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MesasController extends Controller
{
    // Método para obtener todas las mesas
    public function getMesas(Request $request)
    {
        try {
            $mesas = DB::table('mesas')->orderBy('id_mesa')->get();
            return response()->json($mesas, 200);
        } catch (\Exception $error) {
            Log::error("Error al obtener mesas: " . $error->getMessage());
            return response()->json(['message' => 'Error interno del servidor'], 500);
        }
    }

    // Método para crear una nueva mesa
    public function postMesa(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
        ]);

        try {
            $mesa = DB::table('mesas')->insertGetId([
                'nombre' => $request->nombre,
            ]);

            return response()->json($mesa, 200);
        } catch (\Exception $error) {
            Log::error("Error al crear mesa: " . $error->getMessage());
            return response()->json(['message' => 'Error interno del servidor'], 500);
        }
    }

    // Método para actualizar una mesa por su ID
    public function updateMesa(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string',
        ]);

        try {
            $updated = DB::table('mesas')
                ->where('id_mesa', $id)
                ->update([
                    'nombre' => $request->nombre,
                ]);

            if (!$updated) {
                return response()->json(['message' => 'Mesa no encontrada'], 404);
            }

            return response()->json($updated, 200);
        } catch (\Exception $error) {
            Log::error("Error al actualizar mesa: " . $error->getMessage());
            return response()->json(['message' => 'Error interno del servidor'], 500);
        }
    }

    // Método para eliminar una mesa por su ID
    public function deleteMesa(Request $request, $id)
    {
        try {
            $deleted = DB::table('mesas')
                ->where('id_mesa', $id)
                ->delete();

            if (!$deleted) {
                return response()->json(['message' => 'Mesa no encontrada'], 404);
            }

            return response()->json(['message' => 'Mesa eliminada correctamente'], 200);
        } catch (\Exception $error) {
            Log::error("Error al eliminar mesa: " . $error->getMessage());
            return response()->json(['message' => 'Error interno del servidor'], 500);
        }
    }
}
