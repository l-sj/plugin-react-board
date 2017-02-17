import {
	FETCH_EDIT_VIEW, FETCH_EDIT_VIEW_SUCCESS, FETCH_EDIT_VIEW_FAILURE, 
	UPDATE_BOARD, UPDATE_BOARD_SUCCESS, UPDATE_BOARD_FAILURE,
	EDIT_RESET
} from '../actions/boardEditAction';

const INITIAL_STATE = {
	item: null,
	categories: [],
	error: null,
	loading: true,
	updated: false
};

export default function(state = INITIAL_STATE, action) {
	let error;

	switch(action.type) {
		case FETCH_EDIT_VIEW:
			return { ...state, loading: true, error: null, updated: false };

		case FETCH_EDIT_VIEW_SUCCESS:
			return { ...state, categories: action.payload.categories, item: action.payload.item , loading: false, error: null}//Object.assign({}, state, action.payload);

		case FETCH_EDIT_VIEW_FAILURE:
			return { ...state, loading: false, error: action.payload}//Object.assign({}, state, action.payload);

		case UPDATE_BOARD:
			return { ...state, loading: true, error: null };

		case UPDATE_BOARD_SUCCESS:
			return { ...state, ...action.payload, loading: false, error: null, updated: true }

		case UPDATE_BOARD_FAILURE:
			return { ...state, error: action.payload, loading: false, updated: false }

		case EDIT_RESET:

			console.log('EDIT_RESET');

			return { ...state, item: null, categories: [], error: null, loading: true, updated: false }

		default:
			return state;
	}
}
