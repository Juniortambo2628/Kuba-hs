<?php

namespace App\Support;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;

class ApiResponse
{
    public static function success(mixed $data = null, string $message = '', int $status = 200): JsonResponse
    {
        $payload = ['success' => true];

        if ($message !== '') {
            $payload['message'] = $message;
        }

        if ($data !== null) {
            if ($data instanceof JsonResource) {
                $payload['data'] = $data->resolve();
            } else {
                $payload['data'] = $data;
            }
        }

        return response()->json($payload, $status);
    }

    public static function error(string $message, int $status = 400, mixed $errors = null): JsonResponse
    {
        $payload = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors !== null) {
            $payload['errors'] = $errors;
        }

        return response()->json($payload, $status);
    }
}
