<?php

namespace App\Http\Services;

class DateTimeService
{
    public function convertToTimestamp($time)
    {
        if (!$this->isValidTimeString($time)) {
            throw new \InvalidArgumentException("Invalid time string provided.");
        }

        $dateTime = new \DateTime($time);
        return $dateTime->getTimestamp();
    }

    public function convertToISO8601($time)
    {
        if (!$this->isValidTimeString($time)) {
            throw new \InvalidArgumentException("Invalid time string provided.");
        }

        $dateTime = new \DateTime($time);
        return $dateTime->format(\DateTime::ATOM);
    }

    private function isValidTimeString($time)
    {
        return (bool) strtotime($time);
    }
}
