<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GeocodingController extends Controller
{
    /**
     * Proxy address search to OpenStreetMap Nominatim (browser cannot call directly in some networks).
     * Falls back to a local Kenya place list when the remote service is unreachable.
     */
    public function search(Request $request)
    {
        $request->validate([
            'q' => 'required|string|min:2|max:200',
            'limit' => 'nullable|integer|min:1|max:10',
        ]);

        $query = trim($request->input('q'));
        $limit = (int) $request->input('limit', 5);

        $results = $this->searchNominatim($query, $limit);
        $source = 'nominatim';

        if ($results === null) {
            $results = $this->searchLocalFallback($query, $limit);
            $source = 'local';
        }

        return response()->json([
            'results' => $results,
            'source' => $source,
        ]);
    }

    /**
     * @return array<int, array{lat: string, lon: string, display_name: string}>|null null = remote unavailable
     */
    private function searchNominatim(string $query, int $limit): ?array
    {
        try {
            $response = Http::timeout(12)
                ->withHeaders([
                    'User-Agent' => config('app.name', 'Kuba').'/1.0 (contact@kuba.co.ke)',
                    'Accept' => 'application/json',
                ])
                ->get('https://nominatim.openstreetmap.org/search', [
                    'format' => 'json',
                    'q' => $query,
                    'countrycodes' => 'ke',
                    'limit' => $limit,
                    'addressdetails' => 0,
                ]);

            if (! $response->successful()) {
                return null;
            }

            $raw = $response->json();
            if (! is_array($raw)) {
                return [];
            }

            return array_map(static function (array $row): array {
                return [
                    'lat' => (string) ($row['lat'] ?? ''),
                    'lon' => (string) ($row['lon'] ?? ''),
                    'display_name' => (string) ($row['display_name'] ?? ''),
                ];
            }, array_slice($raw, 0, $limit));
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * @return array<int, array{lat: string, lon: string, display_name: string}>
     */
    private function searchLocalFallback(string $query, int $limit): array
    {
        $needle = mb_strtolower($query);
        $matches = [];

        foreach (config('kenya_locations', []) as $place) {
            foreach ($place['names'] as $name) {
                if (str_contains(mb_strtolower($name), $needle) || str_contains($needle, mb_strtolower($name))) {
                    $label = ucwords($name).', Kenya';
                    $matches[$label] = [
                        'lat' => (string) $place['lat'],
                        'lon' => (string) $place['lon'],
                        'display_name' => $label,
                    ];
                    break;
                }
            }
            if (count($matches) >= $limit) {
                break;
            }
        }

        return array_values(array_slice($matches, 0, $limit));
    }
}
