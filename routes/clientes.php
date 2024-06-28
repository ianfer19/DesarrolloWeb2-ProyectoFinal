<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientesController;

// Rutas protegidas por JWT
Route::middleware('jwt.auth')->group(function () {
    Route::get('/cliente', [ClientesController::class, 'getClientes']);
    Route::post('/cliente', [ClientesController::class, 'postCliente']);
    Route::put('/cliente/{id}', [ClientesController::class, 'updateCliente']);
    Route::delete('/cliente/{id}', [ClientesController::class, 'deleteCliente']);
});

