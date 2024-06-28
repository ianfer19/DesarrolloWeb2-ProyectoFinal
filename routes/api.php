<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientesController;
use App\Http\Controllers\DetallesPedidoController;
use App\Http\Controllers\FacturasController;
use App\Http\Controllers\MesasController;
use App\Http\Controllers\PedidosController;
use App\Http\Controllers\ProductoTipoController;
use App\Http\Controllers\AuthController;

// Incluir rutas para ProductoTipoController
require __DIR__.'/productos_tipo.php';
require __DIR__.'/productos.php';
require __DIR__.'/pedidos.php';
require __DIR__.'/mesas.php';
require __DIR__.'/detalles_pedido.php';
require __DIR__.'/facturas.php';
require __DIR__.'/clientes.php';
require __DIR__.'/authcontroller.php';





Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
