import {
	SHOW_SEARCH, HIDE_SEARCH,
	SHOW_SEARCH_DEATIL, HIDE_SEARCH_DEATIL
} from '../actions/searchAction';

const INITIAL_STATE = {
	searchStatus: 'none',
	btnStatus: '',
	searchDetailStatus: 'none',
	searchInput: '',
	searchInputDetail: '',
	searchAuthor: '',
	startCreatedAt: '',
	endCreatedAt: ''
};

export default function(state = INITIAL_STATE, action) {
	let error;

	switch(action.type) {
		case SHOW_SEARCH:
			return { ...state, searchStatus: 'block' }

		case HIDE_SEARCH:
			return { ...state, searchStatus: 'none', btnStatus: '', searchInput: '', searchInputDetail: '', searchAuthor: '', startCreatedAt: '', endCreatedAt: '' }

		case SHOW_SEARCH_DEATIL:
			return { ...state, searchDetailStatus: 'block', btnStatus: 'on' }

		case HIDE_SEARCH_DEATIL:
			return { ...state, searchDetailStatus: 'none' }

		default:
			return state;
	}
}
