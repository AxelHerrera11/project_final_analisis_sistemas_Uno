<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function summary(Request $request): JsonResponse
    {
        return response()->json([
            'citas_hoy'         => 0,
            'camas_disponibles' => 0,
            'admisiones_activas' => 0,
        ]);
    }
}
