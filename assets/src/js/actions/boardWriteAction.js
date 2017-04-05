import { Observable } from 'rxjs';
import { ajax } from 'rxjs/observable/dom/ajax';

export const ADD_CONTENTS = 'ADD_CONTENTS';
export const ADD_CONTENTS_SUCCESS = 'ADD_CONTENTS_SUCCESS';
export const ADD_CONTENTS_FAILURE = 'ADD_CONTENTS_FAILURE';
export const DETAIL_RESET = 'DETAIL_RESET';
export const CHANGE_CATEOGRY = 'CHANGE_CATEOGRY';

export const createBoardContentsEpic = action$ =>
	action$.ofType(ADD_CONTENTS)
		.mergeMap(action =>
			ajax({ url: Common.get('apis').store, method: 'POST', body: action.payload, headers: Common.get('ajaxHeaders')})
				.map(data => createBoardContentsSuccess(data))
				.catch(error => Observable.of(createBoardContentsFailure(error)))
		)

export const createBoardContents = data => ({
	type: ADD_CONTENTS,
	payload: data
});

export const createBoardContentsSuccess = (data) => ({
	type: ADD_CONTENTS_SUCCESS,
	payload: data.response
});

export const createBoardContentsFailure = (error) => ({
	type: ADD_CONTENTS_FAILURE,
	payload: error
});

export const resetWriteForm = () => ({
	type: DETAIL_RESET
});
