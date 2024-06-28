<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MesasController;


    // Rutas protegidas por JWT
    Route::middleware('jwt.auth')->group(function () {
        // Rutas para obtener todas las mesas, crear una nueva mesa, actualizar y eliminar una mesa por su ID
Route::get('/mesa', [MesasController::class, 'getMesas']);
Route::post('/mesa', [MesasController::class, 'postMesa']);
Route::put('/mesa/{id}', [MesasController::class, 'updateMesa']);
Route::delete('/mesa/{id}', [MesasController::class, 'deleteMesa']);
    });

