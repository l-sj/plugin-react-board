import { Observable } from 'rxjs';
import { ajax } from 'rxjs/observable/dom/ajax';

export const SHOW_SEARCH = 'SHOW_SEARCH';
export const HIDE_SEARCH = 'HIDE_SEARCH';
export const SHOW_SEARCH_DETAIL = 'SHOW_SEARCH_DEATIL';
export const HIDE_SEARCH_DETAIL = 'HIDE_SEARCH_DEATIL';
export const CHANGE_SEARCH_VALUE = 'CHANGE_SEARCH_VALUE';

export const SEARCH = 'SEARCH';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';

export const searchBoardContentEpic = action$ =>
	action$.ofType(SEARCH)
		.mergeMap(action =>
			ajax({ url: Common.get('apis').search, method: 'GET', body: action.payload, headers: Common.get('ajaxHeaders')})
				.map(data => searchBoardContentsSuccess(data))
				.catch(error => Observable.of(searchBoardContentsFailure(error)))
		)


export const searchBoardContentsSuccess = (data) => ({
	type: SEARCH_SUCCESS,
	payload: data.response
})

export const searchBoardContentsFailure = (err) => ({
	type: SEARCH_FAILURE,
	payload: err.xhr.response
})