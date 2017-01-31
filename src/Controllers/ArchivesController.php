<?php
/**
 * ArchivesController
 *
 * @category    Board
 * @package     Xpressengine\Plugins\Board
 * @author      XE Developers <developers@xpressengine.com>
 * @copyright   2015 Copyright (C) NAVER Corp. <http://www.navercorp.com>
 * @license     LGPL-2.1
 * @license     http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html
 * @link        https://xpressengine.io
 */
namespace Blueng\XpressenginePlugin\ReactBoard\Controllers;

use Event;
use App\Http\Controllers\Controller;
use Xpressengine\Http\Request;
use Xpressengine\Plugins\Board\BoardPermissionHandler;
use Xpressengine\Plugins\Board\ConfigHandler;
use Xpressengine\Plugins\Board\Handler;
use Xpressengine\Plugins\Board\Models\BoardSlug;
use Xpressengine\Plugins\Board\Models\Board;
use Xpressengine\Plugins\Board\UrlHandler;
use Xpressengine\Routing\InstanceConfig;

/**
 * ArchivesController
 *
 * @category    Board
 * @package     Xpressengine\Plugins\Board
 * @author      XE Developers <developers@xpressengine.com>
 * @copyright   2015 Copyright (C) NAVER Corp. <http://www.navercorp.com>
 * @license     http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html LGPL-2.1
 * @link        https://xpressengine.io
 */
class ArchivesController extends Controller
{
    /**
     * show document
     *
     * @param Request $request request
     * @param string  $slug    slug
     * @return mixed
     */
    public function index(Request $request, $slug)
    {
        $slug = BoardSlug::where('slug', $slug)->first();

        $instanceId = $slug->instanceId;
        $id = $slug->targetId;

        $instanceConfig = InstanceConfig::instance();
        $instanceConfig->setInstanceId($slug->instanceId);

        /**
         * @var Handler $handler
         * @var ConfigHandler $configHandler
         * @var UrlHandler $urlHandler
         * @var BoardPermissionHandler $permission
         */
        $handler = app('xe.board.handler');
        $configHandler = app('xe.board.config');
        $urlHandler = app('xe.board.url');
        $permission = app('xe.board.permission');

        $this->setCurrentPage($request, $handler, $configHandler, $slug);

        $userController = new UserController($handler, $configHandler, $urlHandler, $permission);

        return $userController->show($request, $permission, $instanceId, $id);
    }

    /**
     * set current page
     *
     * @param Request       $request       request
     * @param Handler       $handler       handler
     * @param ConfigHandler $configHandler config handler
     * @param BoardSlug     $slug          slug model
     * @return void
     */
    protected function setCurrentPage(
        Request $request,
        Handler $handler,
        ConfigHandler $configHandler,
        BoardSlug $slug
    ) {
        $instanceId = $slug->instanceId;

        // 이 slug 가 포함된 페이지 출력
        $config = $configHandler->get($instanceId);
        $query = $handler->getModel($config)
            ->where('instanceId', $instanceId)->visible();

        $orderType = $request->get('orderType', '');
        if ($orderType === '' && $config->get('orderType') != null) {
            $orderType = $config->get('orderType', '');
        }

        if ($orderType == '') {
            $query->where('head', '>=', $slug->board->head);
        } elseif ($orderType == 'assentCount') {
            $query->where('assentCount', '>', $slug->board->assentCount)
                ->orWhere(function ($query) use ($slug) {
                    $query->where( 'assentCount', '=', $slug->board->assentCount);
                    $query->where( 'head', '>=', $slug->board->head);
                });
        } elseif ($orderType == 'recentlyCreated') {
            $query->where(Board::CREATED_AT, '>', $slug->board->{Board::CREATED_AT})
                ->orWhere(function ($query) use ($slug) {
                    $query->where(Board::CREATED_AT, '=', $slug->board->{Board::CREATED_AT});
                    $query->where( 'head', '>=', $slug->board->head);
                });
        } elseif ($orderType == 'recentlyUpdated') {
            $query->where(Board::UPDATED_AT, '>', $slug->board->{Board::UPDATED_AT})
                ->orWhere(function ($query) use ($slug) {
                    $query->where(Board::UPDATED_AT, '=', $slug->board->{Board::UPDATED_AT});
                    $query->where( 'head', '>=', $slug->board->head);
                });
        }

        Event::fire('xe.plugin.board.archive', [$query, $slug->board]);
        $count = $query->count() ? : 1;

        $page = (int)($count / $config->get('perPage'));
        if ($count % $config->get('perPage') != 0) {
            ++$page;
        }
        $request->query->set('page', $page);
    }
}
