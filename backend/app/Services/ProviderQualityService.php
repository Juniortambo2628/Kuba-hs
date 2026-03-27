<?php

namespace App\Services;

use App\Models\Provider;
use Illuminate\Support\Facades\Log;

class ProviderQualityService
{
    /**
     * Recalculates and updates the quality score and compliance status for a given provider.
     */
    public function recalculate(Provider $provider): void
    {
        try {
            // First update the compliance status based on documents
            $complianceStatus = $this->determineComplianceStatus($provider);
            $provider->compliance_status = $complianceStatus;

            // Then compute the quality score
            $score = $this->calculateScore($provider);
            $provider->quality_score = $score;

            $provider->save();
        } catch (\Exception $e) {
            Log::error("Failed to recalculate Provider Quality Score for Provider [{$provider->id}]: {$e->getMessage()}");
        }
    }

    /**
     * Determines compliance status by analyzing verification documents.
     */
    private function determineComplianceStatus(Provider $provider): string
    {
        $documents = $provider->verificationDocuments;

        if ($documents->isEmpty()) {
            return 'pending'; // No documents uploaded yet
        }

        $allApproved = true;
        $hasExpired = false;
        $expiringSoon = false;

        $now = now();
        $thirtyDaysFromNow = now()->addDays(30);

        foreach ($documents as $doc) {
            if ($doc->status === 'rejected') {
                return 'non_compliant'; // Any rejected doc makes them non compliant
            }

            if ($doc->status === 'pending') {
                $allApproved = false;
            }

            if ($doc->is_expired) {
                $hasExpired = true;
            } elseif ($doc->expires_at && $doc->expires_at->between($now, $thirtyDaysFromNow)) {
                $expiringSoon = true;
            }
        }

        if ($hasExpired) {
            return 'non_compliant';
        }

        if ($expiringSoon) {
            return 'expiring_soon';
        }

        if ($allApproved) {
            return 'compliant';
        }

        return 'pending'; // Some are still pending approval, and none are expired/rejected
    }

    /**
     * Calculates the numerical quality score (0 - 100).
     */
    private function calculateScore(Provider $provider): float
    {
        $baseScore = 50.0; // Start at 50

        // Factor 1: Reviews (up to 40 points)
        // A 5-star rating gives 40 points (8 * 5 = 40)
        $ratingScore = ($provider->rating_avg ?? 0) * 8; 

        // Factor 2: Compliance Penalty
        $compliancePenalty = 0;
        if ($provider->compliance_status === 'non_compliant') {
            $compliancePenalty = 40; // Severe penalty
        } elseif ($provider->compliance_status === 'expiring_soon') {
            $compliancePenalty = 10; // Warning penalty
        } elseif ($provider->compliance_status === 'pending') {
            $compliancePenalty = 20; // Unverified penalty
        }

        // Factor 3: Application Status (if rejected, they shouldn't even be scored highly)
        if ($provider->application_status === 'rejected' || $provider->application_status === 'suspended') {
            return 0.0;
        }

        // Factor 4: Experience boost (up to 10 points)
        $expBoost = min((int) $provider->experience_years, 10);

        $finalScore = $baseScore + $ratingScore + $expBoost - $compliancePenalty;

        // Clamp between 0 and 100
        return max(0, min(100, $finalScore));
    }
}
