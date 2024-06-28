<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class AuthController extends Controller
{
    // Registro de usuario
    public function register(Request $request)
    {
        // Validar los datos del usuario
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'usuario' => 'required|string|max:255|unique:users',
            'tipo' => 'required|in:Gerente,Empleado',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        // Crear el usuario
        $user = User::create([
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'password' => Hash::make($request->get('password')),
            'usuario' => $request->get('usuario'),
            'tipo' => $request->get('tipo'),
        ]);

        // Generar token JWT para el usuario
        $token = JWTAuth::fromUser($user);

        return response()->json(compact('user', 'token'), 201);
    }

    // Inicio de sesión de usuario
    public function login(Request $request)
    {
        // Validar las credenciales
        $credentials = $request->only('usuario', 'password');

        try {
            // Intentar autenticar al usuario y obtener el token JWT
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Credenciales inválidas'], 400);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'No se pudo crear el token'], 500);
        }

        // Éxito en la autenticación, devolver el token JWT
        return response()->json(compact('token'));
    }

    // Obtener el usuario autenticado
    public function getUser()
    {
        try {
            // Obtener el usuario autenticado a partir del token JWT
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['error' => 'Usuario no encontrado'], 404);
            }
        } catch (TokenExpiredException $e) {
            return response()->json(['error' => 'Token expirado'], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(['error' => 'Token inválido'], 401);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Token ausente'], 401);
        }

        // Devolver el usuario autenticado
        return response()->json(compact('user'));
    }

        // Cerrar sesión (logout) del usuario
        public function logout()
        {
            try {
                // Invalidar el token JWT del usuario autenticado
                JWTAuth::parseToken()->invalidate();
    
                return response()->json(['message' => 'Sesión cerrada exitosamente']);
            } catch (JWTException $e) {
                return response()->json(['error' => 'No se pudo cerrar sesión'], 500);
            }
        }
}
