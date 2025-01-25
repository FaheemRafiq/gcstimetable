<?php

namespace App\Http\Services;

use DateTime;
use InvalidArgumentException;

class DateTimeService
{
    public function convertToTimestamp($time): int
    {
        if (! $this->isValidTimeString($time)) {
            throw new InvalidArgumentException('Invalid time string provided.');
        }

        $dateTime = new DateTime($time);

        return $dateTime->getTimestamp();
    }

    public function convertToISO8601($time): string
    {
        if (! $this->isValidTimeString($time)) {
            throw new InvalidArgumentException('Invalid time string provided.');
        }

        $dateTime = new DateTime($time);

        return $dateTime->format(DateTime::ATOM);
    }

    public function convertToDateTime(string $time): string
    {
        if (! $this->isValidTimeString($time)) {
            throw new InvalidArgumentException('Invalid time or date string provided.');
        }

        $dateTimeString = '2024-11-17T'.$time;
        $dateTime       = new DateTime($dateTimeString);

        return $dateTime->format(DateTime::ATOM);
    }

    private function isValidTimeString($time): bool
    {
        return (bool) strtotime($time);
    }
}
