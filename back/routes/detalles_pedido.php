<?php

use App\Http\Controllers\DetallesPedidoController;
use Illuminate\Support\Facades\Route;


    // Rutas protegidas por JWT
    Route::middleware('jwt.auth')->group(function () {

        // Rutas para obtener detalles de pedidos
Route::get('/detalles-pedido', [DetallesPedidoController::class, 'getDetallesPedido']);
Route::get('/detalles-pedido/{id_pedido}', [DetallesPedidoController::class, 'getDetallesPedidoByIdPedido']);

// Rutas para crear, actualizar y eliminar detalles de pedidos
Route::post('/detalles-pedido', [DetallesPedidoController::class, 'postDetallePedido']);
Route::put('/detalles-pedido/{id}', [DetallesPedidoController::class, 'updateDetallePedido']);
Route::delete('/detalles-pedido/{id}', [DetallesPedidoController::class, 'deleteDetallePedido']);

// Ruta para imprimir el detalle de un pedido
Route::post('/imprimir-detalle-pedido', [DetallesPedidoController::class, 'imprimirDetallePedido']);
    });

