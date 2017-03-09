{{ XeFrontend::css('plugins/react_board/assets/build/defaultSkin.css')->load() }}
{{ XeFrontend::css('plugins/react_board/assets/vendor/ckeditor/contents.css')->load() }}
{{ XeFrontend::js('plugins/react_board/assets/vendor/ckeditor/ckeditor.js')->appendTo('body')->load() }}
{{ XeFrontend::js('plugins/react_board/assets/build/defaultSkin.js')->appendTo('body')->load() }}

<style>
    .bd_function .bd_like.voted{color:#FE381E}
</style>

<script type="text/javascript">
    var Common = (function() {
        var _data = {

            //사용자 정보.
            user: {
                isManager: true
            },

            //API 정보
            apis: {
                create: '{{sprintf('/%s/api/create', $instanceConfig->getUrl())}}',
                store: '{{sprintf('/%s/api/store', $instanceConfig->getUrl())}}',
                delete: '{{sprintf('/%s/api/destroy/[id]', $instanceConfig->getUrl())}}',
                edit: '{{sprintf('/%s/api/edit/[id]', $instanceConfig->getUrl())}}',
                update: '{{sprintf('/%s/api/update/[id]', $instanceConfig->getUrl())}}',
                index: '{{sprintf('/%s/api/articles', $instanceConfig->getUrl())}}',
                view: '{{sprintf('/%s/api/articles/[id]', $instanceConfig->getUrl())}}',
                favorite: '{{sprintf('/%s/api/favorit/[id]', $instanceConfig->getUrl())}}',
                search: '/search'
            },

            //링크 정보
            links: {
                settings: ''
            },
            ajaxHeaders: {
                'X-CSRF-TOKEN': '{!! csrf_token() !!}'
            }
        };

        return {
            get: function (key) {
                return _data[key];
            }
        };
    })();
</script>

<!-- BOARD -->
<div id="boardContainer" class="board">

</div>
<!-- /BOARD -->