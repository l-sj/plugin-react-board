import { Observable } from 'rxjs';
import { ajax } from 'rxjs/observable/dom/ajax';
import { objectToQuerystring } from './../utils';

export const FETCH_BOARD_INDEX = 'FETCH_BOARD_INDEX';
export const FETCH_BOARD_INDEX_SUCCESS = 'FETCH_BOARD_INDEX_SUCCESS';
export const FETCH_BOARD_INDEX_FAILURE = 'FETCH_BOARD_INDEX_FAILURE';

export const CHECK_ALL = 'CHECK_ALL';
export const UNCHECK_ALL = 'UNCHECK_ALL';
export const CHECK_ROW = 'CHECK_ROW';
export const UNCHECK_ROW = 'UNCHECK_ROW';

export const SHOW_MANAGEMENT = 'SHOW_MANAGEMENT';
export const HIDE_MANAGEMENT = 'HIDE_MANAGEMENT';

//Delete board
export const DELETE_BOARD = 'DELETE_BOARD';
export const DELETE_BOARD_SUCCESS = 'DELETE_BOARD_SUCCESS';
export const DELETE_BOARD_FAILURE = 'DELETE_BOARD_FAILURE';
export const RESET_DELETED_BOARD = 'RESET_DELETED_BOARD';

export const FETCH_CATEGORY = 'FETCH_CATEGORY';
export const FETCH_CATEGORY_SUCCESS = 'FETCH_CATEGORY_SUCCESS';
export const FETCH_CATEGORY_FAILURE = 'FETCH_CATEGORY_FAILURE';

export const fetchBoardIndexEpic = action$ =>
	action$.ofType(FETCH_BOARD_INDEX)
		.mergeMap(action =>
			ajax({ url: Common.get('apis').list + objectToQuerystring(action.query), method: 'GET', headers: Common.get('ajaxHeaders')})
				.map(data => fetchBoardIndexSuccess(data))
				.catch(error => Observable.of(fetchBoardIndexFailure(error)))
		);

export const fetchCategoryEpic = action$ =>
	action$.ofType(FETCH_CATEGORY)
		.mergeMap(action =>
			ajax({ url: Common.get('apis').category, method: 'GET', headers: Common.get('ajaxHeaders')})
				.map(data => fetchCategorySuccess(data))
				.catch(error => Observable.of(fetchCategoryFailure(error)))
		);

export const fetchCategory = () => ({
	type: FETCH_CATEGORY
});

export const fetchCategorySuccess = (data) => ({
	type: FETCH_CATEGORY_SUCCESS,
	payload: data.response
});

export const fetchCategoryFailure = (error) => ({
	type: FETCH_CATEGORY_FAILURE,
	payload: error.xhr.response
});

export const fetchBoardIndex = (queryJSON) => ({
	type: FETCH_BOARD_INDEX,
	query: queryJSON || {}
});

export const fetchBoardIndexSuccess = (data) => ({
	type: FETCH_BOARD_INDEX_SUCCESS,
	payload: data.response
});

export const fetchBoardIndexFailure = (error) => ({
	type: FETCH_BOARD_INDEX_FAILURE,
	payload: error.xhr.response
});
