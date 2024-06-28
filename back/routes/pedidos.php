<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PedidosController;


    // Rutas protegidas por JWT
    Route::middleware('jwt.auth')->group(function () {
        // Rutas para los pedidos
Route::get('/pedido', [PedidosController::class, 'getPedidos']);
Route::get('/pedido/{id}', [PedidosController::class, 'getPedidoById']);
Route::get('/pedido-empleados', [PedidosController::class, 'getPedidosEmpleados']);
Route::post('/pedido', [PedidosController::class, 'postPedido']);
Route::put('/pedido/{id}', [PedidosController::class, 'updatePedido']);
Route::delete('/pedido/{id}', [PedidosController::class, 'deletePedido']);
    });

