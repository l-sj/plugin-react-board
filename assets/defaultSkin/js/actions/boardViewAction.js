import { Observable } from 'rxjs';
import { ajax } from 'rxjs/observable/dom/ajax';

//Fetch board
export const FETCH_VIEW = 'FETCH_VIEW';
export const FETCH_VIEW_SUCCESS = 'FETCH_VIEW_SUCCESS';
export const FETCH_VIEW_FAILURE = 'FETCH_VIEW_FAILURE';

export const DELETE_BOARD = "DELETE_BOARD";
export const DELETE_BOARD_SUCCESS = "DELETE_BOARD_SUCCESS";
export const DELETE_BOARD_FAILURE = "DELETE_BOARD_FAILURE";

export const fetchViewEpic = (action$) =>
	action$.ofType(FETCH_VIEW)
		.mergeMap(action =>
			ajax({ url: Common.get('apis').show.replace('[id]', action.id), method: 'GET', headers: Common.get('ajaxHeaders')})
				.map(data => fetchViewSuccess(data))
				.catch(error => Observable.of(fetchViewFailure(error)))
		);

export const fetchView = (id) => ({
	type: FETCH_VIEW,
	id
});

export const fetchViewSuccess = (data) => ({
	type: FETCH_VIEW_SUCCESS,
	payload: data.response
});

export const fetchViewFailure = (error) => ({
	type: FETCH_VIEW_FAILURE,
	payload: error.xhr.response
});

export const deleteBoardEpic = (action$) =>
	action$.ofType(DELETE_BOARD)
		.mergeMap(action =>
			ajax({ url: Common.get('apis').destroy.replace('[id]', action.id), method: 'DELETE', headers: Common.get('ajaxHeaders')})
				.map(data => deleteBoardSuccess(data))
				.catch(error => Observable.of(deleteBoardFailure(error)))
		);

export const deleteBoard = (id) => ({
	type: DELETE_BOARD,
	id
});

export const deleteBoardSuccess = (data) => ({
	type: DELETE_BOARD_SUCCESS,
	payload: data.response
});

export const deleteBoardFailure = (error) => ({
	type: DELETE_BOARD_FAILURE,
	payload: error.xhr.response
});