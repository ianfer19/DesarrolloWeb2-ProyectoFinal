<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductosController;


    // Rutas protegidas por JWT
    Route::middleware('jwt.auth')->group(function () {
        // Rutas para obtener todos los productos, crear un nuevo producto y eliminar un producto
Route::get('/producto', [ProductosController::class, 'getProductos']);
Route::post('/producto', [ProductosController::class, 'postProducto']);
Route::delete('/producto/{id}', [ProductosController::class, 'deleteProducto']);

// Ruta para actualizar un producto por su ID
Route::put('/producto/{id}', [ProductosController::class, 'updateProducto']);
    });

