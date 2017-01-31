import { Observable } from 'rxjs';
import { ajax } from 'rxjs/observable/dom/ajax';
import 'rxjs/operator/map';
import 'rxjs/operator/catch';

export const FETCH_EDIT_VIEW = 'FETCH_EDIT_VIEW';
export const FETCH_EDIT_VIEW_SUCCESS = 'FETCH_EDIT_VIEW_SUCCESS';
export const FETCH_EDIT_VIEW_FAILURE = 'FETCH_EDIT_VIEW_FAILURE';

export const UPDATE_BOARD = "UPDATE_BOARD";
export const UPDATE_BOARD_SUCCESS = "UPDATE_BOARD_SUCCESS";
export const UPDATE_BOARD_FAILURE = "UPDATE_BOARD_FAILURE";

export const fetchEditViewEpic = (action$) =>
	action$.ofType(FETCH_EDIT_VIEW)
		.mergeMap(action =>
			ajax({ url: Common.get('apis').view.replace('[id]', action.id), method: 'GET', headers: Common.get('ajaxHeaders')})
				.map(data => fetchEditViewSuccess(data))
				.catch(error => Observable.of(fetchEditViewFailure(error)))
		);

export const fetchEditView = (id) => ({
	type: FETCH_EDIT_VIEW,
	id
});

export const fetchEditViewSuccess = (data) => ({
	type: FETCH_EDIT_VIEW_SUCCESS,
	payload: data.response
})

export const fetchEditViewFailure = (error) => ({
	type: FETCH_EDIT_VIEW_FAILURE,
	payload: error.xhr.response
})

export const updateBoardEpic = action$ =>
	action$.ofType(UPDATE_BOARD)
		.mergeMap(action =>
			Observable::ajax({
				url: Common.get('apis').update.replace('[id]', action.id),
				method: 'PUT',
				body: action.payload,
				headers: Common.get('ajaxHeaders')
			})
				.map(data => updateBoardSuccess(data))
				.catch(error => Observable.of(updateBoardFailure(error)))
		);

export const updateBoard = (id, data) => ({
	type: UPDATE_BOARD,
	payload: data,
	id
})

const updateBoardSuccess = (data) => ({
	type: UPDATE_BOARD_SUCCESS,
	payload: data.response
})

export const updateBoardFailure = (error) => ({
	type: UPDATE_BOARD_FAILURE,
	payload: error.xhr.response
})