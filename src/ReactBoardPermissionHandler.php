<?php
namespace Blueng\ReactBoard;

use Xpressengine\Plugins\Board\BoardPermissionHandler;

class ReactBoardPermissionHandler extends BoardPermissionHandler
{
    /**
     * 퍼미션 인스턴스 prefix 이름
     *
     * @var string
     */
    protected $prefix = ReactBoardConfigHandler::CONFIG_NAME;
}
