<?php
/**
 * BoardSettingsController
 *
 * PHP version 5
 *
 * @category    Board
 * @package     Xpressengine\Plugins\Board
 * @author      XE Developers <developers@xpressengine.com>
 * @copyright   2015 Copyright (C) NAVER Corp. <http://www.navercorp.com>
 * @license     http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html LGPL-2.1
 * @link        https://xpressengine.io
 */
namespace Xpressengine\Plugins\ReactBoard\Controllers;

use App\Http\Sections\EditorSection;
use Xpressengine\Plugins\ReactBoard\ReactBoardConfigHandler;
use Xpressengine\Plugins\ReactBoard\ReactBoardInstanceManager;
use Xpressengine\Plugins\ReactBoard\ReactBoardModule;
use Xpressengine\Plugins\ReactBoard\ReactBoardPermissionHandler;
use XeDB;
use Redirect;
use XePresenter;
use Session;
use App\Http\Controllers\Controller;
use App\Http\Sections\DynamicFieldSection;
use App\Http\Sections\ToggleMenuSection;
use App\Http\Sections\SkinSection;
use Xpressengine\Captcha\CaptchaManager;
use Xpressengine\Captcha\Exceptions\ConfigurationNotExistsException;
use Xpressengine\Category\CategoryHandler;
use Xpressengine\Http\Request;
use Xpressengine\Plugins\Board\Handler;
use Xpressengine\Plugins\Comment\ManageSection as CommentSection;

/**
 * ReactBoardSettingsController
 *
 * @category    Board
 * @package     Xpressengine\Plugins\Board
 * @author      XE Developers <developers@xpressengine.com>
 * @copyright   2015 Copyright (C) NAVER Corp. <http://www.navercorp.com>
 * @license     http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html LGPL-2.1
 * @link        https://xpressengine.io
 */
class ReactBoardSettingsController extends Controller
{
    protected $handler;

    protected $configHandler;

    /**
     * @var \Xpressengine\Presenter\Presenter
     */
    protected $presenter;

    protected $urlHandler;

    protected $instanceManager;

    public function __construct(
        Handler $handler,
        ReactBoardConfigHandler $configHandler,
        ReactBoardInstanceManager $instanceManager
    ) {
        $this->handler = $handler;
        $this->configHandler = $configHandler;
        $this->instanceManager =  $instanceManager;

        $this->presenter = app('xe.presenter');

        $this->presenter->setSettingsSkinTargetId(ReactBoardModule::getId());
        $this->presenter->share('handler', $this->handler);
        $this->presenter->share('configHandler', $this->configHandler);
        $this->presenter->share('urlHandler', $this->urlHandler);
    }

    public function globalEdit(ReactBoardPermissionHandler $boardPermission, CaptchaManager $captcha)
    {
        $config = $this->configHandler->getDefault();

        $perms = $boardPermission->getGlobalPerms();

        $toggleMenuSection = new ToggleMenuSection(ReactBoardModule::getId());

        return $this->presenter->make('global.edit', [
            'config' => $config,
            'perms' => $perms,
            'toggleMenuSection' => $toggleMenuSection,
            'captcha' => $captcha,
        ]);
    }

    public function globalUpdate(Request $request, ReactBoardPermissionHandler $boardPermission)
    {
        if ($request->get('useCaptcha') === 'true') {
            $driver = config('captcha.driver');
            $captcha = config("captcha.apis.$driver.siteKey");
            if (!$captcha) {
                throw new ConfigurationNotExistsException();
            }
        }

        $config = $this->configHandler->getDefault();

        $permissionNames = [];
        $permissionNames['read'] = ['readMode', 'readRating', 'readUser', 'readExcept'];
        $permissionNames['list'] = ['listMode', 'listRating', 'listUser', 'listExcept'];
        $permissionNames['create'] = ['createMode', 'createRating', 'createUser', 'createExcept'];
        $permissionNames['manage'] = ['manageMode', 'manageRating', 'manageUser', 'manageExcept'];
        $inputs = $request->except(array_merge(
            ['_token'],
            $permissionNames['read'],
            $permissionNames['list'],
            $permissionNames['create'],
            $permissionNames['manage']
        ));

        foreach ($inputs as $key => $value) {
            $config->set($key, $value);
        }

        $params = $config->getPureAll();

        XeDB::beginTransaction();

        $config = $this->configHandler->putDefault($params);

        $boardPermission->setGlobal($request);

        XeDB::commit();

        return redirect()->to(route('settings.react_board.global.edit'));
    }

    public function edit(ReactBoardPermissionHandler $boardPermission, CaptchaManager $captcha, $boardId)
    {
        $config = $this->configHandler->get($boardId);

        $skinSection = new SkinSection(ReactBoardModule::getId(), $boardId);

        $dynamicFieldSection = new DynamicFieldSection(
            $config->get('documentGroup'),
            XeDB::connection(),
            $config->get('revision')
        );

        $toggleMenuSection = new ToggleMenuSection(ReactBoardModule::getId(), $boardId);

        $editorSection = new EditorSection($boardId);

        $perms = $boardPermission->getPerms($boardId);

        return $this->presenter->make('edit', [
            'config' => $config,
            'boardId' => $boardId,
            'skinSection' => $skinSection,
            'dynamicFieldSection' => $dynamicFieldSection,
            'toggleMenuSection' => $toggleMenuSection,
            'editorSection' => $editorSection,
            'perms' => $perms,
            'captcha' => $captcha,
        ]);
    }

    public function update(Request $request, ReactBoardPermissionHandler $boardPermission, $boardId)
    {
        if ($request->get('useCaptcha') === 'true') {
            $driver = config('captcha.driver');
            $captcha = config("captcha.apis.$driver.siteKey");
            if (!$captcha) {
                throw new ConfigurationNotExistsException();
            }
        }

        $config = $this->configHandler->get($boardId);

        $permissionNames = [];
        $permissionNames['read'] = ['readMode', 'readRating', 'readUser', 'readExcept'];
        $permissionNames['list'] = ['listMode', 'listRating', 'listUser', 'listExcept'];
        $permissionNames['create'] = ['createMode', 'createRating', 'createUser', 'createExcept'];
        $permissionNames['manage'] = ['manageMode', 'manageRating', 'manageUser', 'manageExcept'];
        $inputs = $request->except(array_merge(
            ['_token'],
            $permissionNames['read'],
            $permissionNames['list'],
            $permissionNames['create'],
            $permissionNames['manage']
        ));

        foreach ($inputs as $key => $value) {
            $config->set($key, $value);
        }

        foreach ($config->getPureAll() as $key => $value) {
            if ($config->getParent()->get($key) != null && isset($inputs[$key]) === false) {
                unset($config[$key]);
            }
        }

        XeDB::beginTransaction();
        $config = $this->instanceManager->updateConfig($config->getPureAll());
        $boardPermission->set($request, $boardId);
        XeDB::commit();

        return redirect()->to(route('settings.react_board.edit', ['boardId' => $boardId]));
    }

    public function storeCategory(CategoryHandler $categoryHandler, Request $request)
    {
        $boardId = $request->get('boardId');
        $input = [
            'name' => $boardId . '-' . ReactBoardModule::getId(),
        ];
        $category = $categoryHandler->create($input);

        if ($boardId == '') {
            // global config
            $config = $this->configHandler->getDefault();
            $config->set('categoryId', $category->id);
            $this->configHandler->putDefault($config->getPureAll());
        } else {
            $config = $this->configHandler->get($boardId);
            $config->set('categoryId', $category->id);
            $this->instanceManager->updateConfig($config->getPureAll());
        }


        return XePresenter::makeApi(
            $category->getAttributes()
        );
    }
}
