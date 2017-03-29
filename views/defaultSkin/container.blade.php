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
                id: '{{ auth()->id() }}',
                isManager: parseInt('{{ $isManager }}') || 0
            },

            //API 정보
            apis: {
                show: '{{urldecode(instanceRoute('api.show', ['id' => '[id]'], $instanceId))}}',
                list: '{{urldecode(instanceRoute('api.list', [], $instanceId))}}',
                store: '{{urldecode(instanceRoute('api.store', [], $instanceId))}}',
                update: '{{urldecode(instanceRoute('api.update', ['id' => '[id]'], $instanceId))}}',
                destroy: '{{urldecode(instanceRoute('api.destroy', ['id' => '[id]'], $instanceId))}}',
                category: '{{urldecode(instanceRoute('api.category', [], $instanceId))}}',
                /** 어떻게 사용하는건지? */
                favorite_create: '{{urldecode(instanceRoute('api.favorite.create', ['id' => '[id]'], $instanceId))}}',
                favorite_destroy: '{{urldecode(instanceRoute('api.favorite.create', ['id' => '[id]'], $instanceId))}}',
                temp: ''
            },

            //링크 정보
            links: {
                settings: '{{urldecode(route('settings.react_board.edit', ['boardId' => $instanceId]))}}'
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