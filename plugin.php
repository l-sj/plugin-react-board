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

namespace Blueng\ReactBoard;

use Blueng\ReactBoard\ReactBoardConfigHandler;
use Blueng\ReactBoard\ReactBoardInstanceManager;
use Blueng\ReactBoard\ReactBoardModule;
use Blueng\ReactBoard\ReactBoardPermissionHandler;
use Xpressengine\Plugin\AbstractPlugin;
use Xpressengine\Plugins\Board\Modules\Board as BoardModule;
use XeConfig;
use XeDB;
use XePlugin;
use XeTrash;
use XeDocument;
use XeDynamicField;

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
        /** @var \Illuminate\Foundation\Application $app */
        $app = app();

        $app->singleton(['xe.react_board.config' => ReactBoardConfigHandler::class], function ($app) {

            return new ReactBoardConfigHandler(
                app('xe.config'),
                XeDynamicField::getConfigHandler(),
                XeDocument::getConfigHandler()
            );
        });

        $app->singleton(['xe.board.instance' => ReactBoardInstanceManager::class], function ($app) {
            return new ReactBoardInstanceManager(
                XeDB::connection('document'),
                app('xe.document'),
                app('xe.dynamicField'),
                app(ReactBoardConfigHandler::class),
                app(ReactBoardPermissionHandler::class),
                app('xe.plugin.comment')->getHandler()
            );
        });

        $app->singleton(['xe.board.permission' => ReactBoardPermissionHandler::class], function ($app) {
            $boardPermission = new ReactBoardPermissionHandler(app('xe.permission'), app(ReactBoardConfigHandler::class));
            $boardPermission->setPrefix(ReactBoardModule::getId());
            return $boardPermission;
        });
    }
}
