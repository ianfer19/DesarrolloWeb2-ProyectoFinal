<?php

// routes/producto_tipo.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductoTipoController;


    // Rutas protegidas por JWT
    Route::middleware('jwt.auth')->group(function () {
        Route::get('/producto_tipo', [ProductoTipoController::class, 'getProductosTipo']);
Route::get('/producto_tipo/cocina', [ProductoTipoController::class, 'getProductosTipoCocina2']);
Route::post('/producto_tipo', [ProductoTipoController::class, 'postProductoTipo']);
Route::put('/producto_tipo/{id}', [ProductoTipoController::class, 'updateProductoTipo']);
Route::delete('/producto_tipo/{id}', [ProductoTipoController::class, 'deleteProductoTipo']);
    });

