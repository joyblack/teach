<?php
namespace app\common\exception;

class JoyException extends \RuntimeException
{
    private $statusCode;
    private $headers;

    public function __construct($message = null, $code = 0) {
        $this->statusCode = 200;
        $this->headers    = [];
        parent::__construct($message, $code, null);
    }

    public function getStatusCode()
    {
        return $this->statusCode;
    }

    public function getHeaders()
    {
        return $this->headers;
    }
}
