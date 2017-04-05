import {
	ADD_CONTENTS, ADD_CONTENTS_SUCCESS, ADD_CONTENTS_FAILURE, DETAIL_RESET,
	CHANGE_CATEOGRY
} from '../actions/boardWriteAction';

const INITIAL_STATE = {
	error: null,
	loading: false,
	item: null,
};

export default function(state = INITIAL_STATE, action) {
	let error;

	switch(action.type) {
		case ADD_CONTENTS:
			return { ...state, loading: true, error: null}

		case ADD_CONTENTS_SUCCESS:
			return { ...state, loading: false, error: null, item: action.payload.item };

		case ADD_CONTENTS_FAILURE:
			return { ...state, loading: false, error: action.payload }

		case DETAIL_RESET:
			return { ...state, loading: false, item: null, error: null }

		case CHANGE_CATEOGRY:
			return { ...state, categoryItemId: action.categoryItemId }

		default:
			return state;
	}
}
