<?php

namespace Pterodactyl\Exceptions;

class ManifestDoesNotExistException extends \Exception
{
    public function getSolution(): Solutions\ManifestDoesNotExistSolution
    {
        return new Solutions\ManifestDoesNotExistSolution();
    }
}
