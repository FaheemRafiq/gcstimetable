<?php

namespace App\Types;

class TimeSlot
{
    public $startTime;

    public $endTime;

    public function __construct($startTime, $endTime)
    {
        $this->startTime = $startTime;
        $this->endTime   = $endTime;
    }
}
