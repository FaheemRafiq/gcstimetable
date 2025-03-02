<?php

namespace App\Exceptions;

use Exception;

class EmptyImportException extends Exception
{
    public function __construct($message = 'The imported file does not contain any valid columns.')
    {
        parent::__construct($message);
    }
}
