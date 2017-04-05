import {
	FETCH_VIEW, FETCH_VIEW_SUCCESS, FETCH_VIEW_FAILURE,
	DELETE_BOARD, DELETE_BOARD_SUCCESS, DELETE_BOARD_FAILURE
} from '../actions/boardViewAction';

const INITIAL_STATE = {
	categories: [],
	item: {},
	visible: false,
	loading: true,
	error: null,
	deleted: false
};

export default function(state = INITIAL_STATE, action) {
	let error;

	switch(action.type) {
		case FETCH_VIEW:
			return { ...state, loading: true, error: null, deleted: false };

		case FETCH_VIEW_SUCCESS:
			return { ...state, item: action.payload.item , loading: false, error: null}

		case FETCH_VIEW_FAILURE:
			return { ...state, loading: false, error: action.payload}

		case DELETE_BOARD:
			return { ...state }

		case DELETE_BOARD_SUCCESS:
			return { ...state, deleted: true }

		case DELETE_BOARD_FAILURE:
			return { ...state, deleted: false, error: action.payload }

		default:
			return state;
	}
}
