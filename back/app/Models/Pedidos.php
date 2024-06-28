<?php

namespace App\Models;

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Pedidos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->bigIncrements('id_pedido');
            $table->unsignedBigInteger('id_cliente');
            $table->unsignedBigInteger('id_usuario');
            $table->unsignedBigInteger('id_mesa');
            $table->timestamp('fecha_pedido');
            $table->string('tipo_pedido', 20);
            $table->integer('estado')->nullable();
            $table->decimal('total_pedido', 10, 2);
            $table->timestamp('fechaEliminacion')->nullable();
            $table->timestamps();

            $table->foreign('id_cliente')->references('id_cliente')->on('clientes');
            $table->foreign('id_mesa')->references('id_mesa')->on('mesas');
            $table->foreign('id_usuario')->references('id_usuario')->on('usuarios');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pedidos');
    }
}
