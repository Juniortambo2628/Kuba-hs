<?php

namespace App\Enums;

enum ReviewStatus: string
{
    case Published = 'published';
    case Hidden = 'hidden';
    case Resolved = 'resolved';

    public function label(): string
    {
        return match ($this) {
            self::Published => 'Published',
            self::Hidden => 'Hidden',
            self::Resolved => 'Resolved',
        };
    }
}
