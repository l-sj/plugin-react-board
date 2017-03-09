<?php
namespace Blueng\ReactBoard\Controllers;

use Auth;
use Gate;
use XePresenter;
use App\Http\Controllers\Controller;

use Xpressengine\Permission\Instance;
use Xpressengine\Plugins\Board\Handler;
use Blueng\ReactBoard\ReactBoardModule;
use Blueng\ReactBoard\ReactBoardConfigHandler;
use Blueng\ReactBoard\ReactBoardPermissionHandler;
use Xpressengine\Routing\InstanceConfig;

class ReactBoardModuleController extends Controller
{
    protected $isManager = false;

    protected $instanceId;

    protected $config;

    protected $configHandler;

    protected $handler;

    public function __construct(
        Handler $handler,
        ReactBoardConfigHandler $configHandler,
        ReactBoardPermissionHandler $boardPermission
    ) {
        $instanceConfig = InstanceConfig::instance();
        $this->instanceId = $instanceConfig->getInstanceId();

        $this->handler = $handler;
        $this->configHandler = $configHandler;

        $this->config = $configHandler->get($this->instanceId);
        if ($this->config !== null) {
            $this->isManager = false;
            if (Gate::allows(
                ReactBoardPermissionHandler::ACTION_MANAGE,
                new Instance($boardPermission->name($this->instanceId))
            )) {
                $this->isManager = true;
            };
        }

        // set Skin
        XePresenter::setSkinTargetId(ReactBoardModule::getId());
        XePresenter::share('handler', $handler);
        XePresenter::share('configHandler', $configHandler);
        XePresenter::share('isManager', $this->isManager);
        XePresenter::share('instanceId', $this->instanceId);
        XePresenter::share('config', $this->config);
    }

    public function container()
    {
        dd($this);

        return XePresenter::makeAll('container', [

        ]);
    }
}
