<?php
/**
 * Plugin
 *
 * @category    Board
 * @package     Xpressengine\Plugins\Board
 * @author      XE Developers <developers@xpressengine.com>
 * @copyright   2015 Copyright (C) NAVER Corp. <http://www.navercorp.com>
 * @license     LGPL-2.1
 * @license     http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html
 * @link        https://xpressengine.io
 */

namespace Blueng\XpressenginePlugins\ReactBoard;

use Illuminate\Database\Schema\Builder;
use Schema;
use Illuminate\Database\Schema\Blueprint;
use Xpressengine\Plugin\AbstractPlugin;
use Xpressengine\Document\DocumentHandler;
use Xpressengine\Config\ConfigManager;
use Xpressengine\DynamicField\DynamicFieldHandler;
use Xpressengine\Permission\PermissionHandler;
use Xpressengine\Counter\Factory as CounterFactory;
use Xpressengine\Plugins\Board\Modules\Board as BoardModule;
use Xpressengine\Plugins\Board\ToggleMenus\TrashItem;
use Xpressengine\Plugins\Board\UIObjects\Share as Share;
use Xpressengine\Plugins\Claim\ToggleMenus\BoardClaimItem;
use XeToggleMenu;
use XeConfig;
use XeDB;
use XePlugin;
use XeTrash;

/**
 * Plugin
 *
 * @category    Board
 * @package     Xpressengine\Plugins\Board
 */
class Plugin extends AbstractPlugin
{
    /**
     * activate
     *
     * @param null $installedVersion installed version
     * @return void
     */
    public function activate($installedVersion = null)
    {
    }

    /**
     * @return void
     */
    public function install()
    {
    }

    /**
     * @param null $installedVersion install version
     * @return void
     */
    public function update($installedVersion = null)
    {
    }

    /**
     * @return boolean
     */
    public function checkUpdated($installedVersion = NULL)
    {
        return parent::checkUpdated($installedVersion);
    }

    /**
     * boot
     *
     * @return void
     */
    public function boot()
    {
    }
}
