<?php
/**
 * Exceptions
 *
 * @category    Board
 * @package     Xpressengine\Plugins\Board
 * @author      XE Developers (akasima) <osh@xpressengine.com>
 * @copyright   2015 Copyright (C) NAVER Crop. <http://www.navercorp.com>
 * @license     LGPL-2.1
 * @license     http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html
 * @link        https://xpressengine.io
 */

namespace Blueng\XpressenginePlugin\ReactBoard\Exceptions;

use Xpressengine\Plugins\Board\BoardException;

/**
 * Class RequiredValueException
 *
 * @category    Board
 * @package     Xpressengine\Plugins\Board
 */
class RequiredValueException extends BoardException
{
    protected $message = '":key" required.';
}
