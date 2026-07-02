<?php

namespace App\Enums;

enum InvestorInquiryStatus: string
{
    case Pending = 'pending';
    case Reviewed = 'reviewed';
    case Contacted = 'contacted';
    case Rejected = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Reviewed => 'Reviewed',
            self::Contacted => 'Contacted',
            self::Rejected => 'Rejected',
        };
    }
}
