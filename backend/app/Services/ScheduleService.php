<?php

namespace App\Services;

use Spatie\OpeningHours\OpeningHours;
use App\Models\Provider;
use Carbon\Carbon;

class ScheduleService
{
    /**
     * Get the opening hours for a provider.
     */
    public function getProviderOpeningHours(Provider $provider): OpeningHours
    {
        $availabilities = $provider->availability()->where('is_available', true)->get();
        $exceptions = $provider->scheduleExceptions()->get();

        $data = [];
        $days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

        if ($availabilities->isEmpty()) {
            // Default hours if nothing configured
            foreach ($days as $day) {
                if ($day !== 'sunday' && $day !== 'saturday') {
                    $data[$day] = ['09:00-17:00'];
                }
            }
        } else {
            foreach ($availabilities as $availability) {
                $dayName = $days[$availability->day_of_week];
                $data[$dayName][] = "{$availability->start_time}-{$availability->end_time}";
            }
        }

        // Add exceptions
        $exceptionData = [];
        foreach ($exceptions as $exception) {
            $dateString = $exception->date->format('Y-m-d');
            if ($exception->is_closed) {
                $exceptionData[$dateString] = [];
            } else {
                $exceptionData[$dateString] = ["{$exception->start_time}-{$exception->end_time}"];
            }
        }

        if (!empty($exceptionData)) {
            $data['exceptions'] = $exceptionData;
        }

        return OpeningHours::create($data);
    }

    /**
     * Check if a specific time is available.
     */
    public function isAvailable(Provider $provider, Carbon $dateTime): bool
    {
        $openingHours = $this->getProviderOpeningHours($provider);
        
        return $openingHours->isOpenAt($dateTime);
    }

    /**
     * Get next available open slot.
     */
    public function getNextOpen(Provider $provider, Carbon $dateTime): Carbon
    {
        $openingHours = $this->getProviderOpeningHours($provider);
        
        return Carbon::instance($openingHours->nextOpen($dateTime));
    }
}
