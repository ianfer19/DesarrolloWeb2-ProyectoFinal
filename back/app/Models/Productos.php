<?php

namespace App\Models;

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Productos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->bigIncrements('id_producto');
            $table->unsignedBigInteger('id_tipo');
            $table->string('nombre', 100);
            $table->decimal('precio', 10, 2);
            $table->timestamp('fechaEliminacion')->nullable();
            $table->timestamps();

            $table->foreign('id_tipo')->references('id_producto_tipo')->on('productos_tipo');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('productos');
    }
}
