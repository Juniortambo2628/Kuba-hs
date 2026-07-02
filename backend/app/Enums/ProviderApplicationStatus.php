<?php

namespace App\Enums;

enum ProviderApplicationStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Active = 'active';
    case Rejected = 'rejected';
    case Suspended = 'suspended';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Approved => 'Approved',
            self::Active => 'Active',
            self::Rejected => 'Rejected',
            self::Suspended => 'Suspended',
        };
    }
}
