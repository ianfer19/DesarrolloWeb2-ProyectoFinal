<?php

namespace App\Models;

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFacturasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('facturas', function (Blueprint $table) {
            $table->bigIncrements('id_factura');
            $table->unsignedBigInteger('id_pedido');
            $table->timestamp('fecha_factura');
            $table->unsignedBigInteger('id_empleado');
            $table->integer('nequi');
            $table->integer('bancolombia');
            $table->integer('efectivo');
            $table->decimal('descuento_por', 5, 2);
            $table->decimal('Adescuento_val', 10, 2);
            $table->decimal('total_factura', 10, 2);
            $table->timestamp('fechaEliminacion')->nullable();
            $table->timestamps();

            $table->foreign('id_pedido')->references('id_pedido')->on('pedidos');
            $table->foreign('id_empleado')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('facturas');
    }
}
