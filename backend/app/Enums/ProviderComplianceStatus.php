<?php

namespace App\Enums;

enum ProviderComplianceStatus: string
{
    case Pending = 'pending';
    case Compliant = 'compliant';
    case NonCompliant = 'non_compliant';
    case ExpiringSoon = 'expiring_soon';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Compliant => 'Compliant',
            self::NonCompliant => 'Non-Compliant',
            self::ExpiringSoon => 'Expiring Soon',
        };
    }
}
