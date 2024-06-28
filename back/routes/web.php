<?php

// routes/web.php
use Illuminate\Support\Facades\Route;

// Incluir rutas para ProductoTipoController
require __DIR__.'/productos_tipo.php';
require __DIR__.'/productos.php';
require __DIR__.'/pedidos.php';
require __DIR__.'/mesas.php';
require __DIR__.'/detalles_pedido.php';
require __DIR__.'/facturas.php';
require __DIR__.'/clientes.php';

// Otras rutas de tu aplicación
Route::get('/', function () {
    return view('welcome');
});

// Ruta para el panel de control
Route::middleware(['auth:sanctum', config('jetstream.auth_session'), 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');
});
