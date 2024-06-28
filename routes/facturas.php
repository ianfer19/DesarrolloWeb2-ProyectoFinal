<?php

use App\Http\Controllers\FacturasController;
use Illuminate\Support\Facades\Route;


    // Rutas protegidas por JWT
    Route::middleware('jwt.auth')->group(function () {
        // Rutas para obtener todas las facturas
Route::get('/factura', [FacturasController::class, 'getFacturas']);

// Ruta para obtener una factura por su ID
Route::get('/factura/{id}', [FacturasController::class, 'getFacturasById']);

// Ruta para obtener una factura por el ID de un pedido
Route::get('/factura-pedido/{id}', [FacturasController::class, 'getFacturasByIdPedido']);

// Ruta para crear una nueva factura
Route::post('/factura', [FacturasController::class, 'postFactura']);

// Ruta para actualizar una factura por el ID de un pedido
Route::put('/factura/{id_pedido}', [FacturasController::class, 'updateFactura']);

// Ruta para eliminar una factura por su ID
Route::delete('/factura/{id}', [FacturasController::class, 'deleteFactura']);
    });

