import {
	SHOW_SEARCH, HIDE_SEARCH,
	SHOW_SEARCH_DETAIL, HIDE_SEARCH_DETAIL,
	CHANGE_SEARCH_VALUE
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
			return { ...state, searchStatus: 'none', searchDetailStatus: 'none', btnStatus: '', searchInput: '', searchInputDetail: '', searchAuthor: '', startCreatedAt: '', endCreatedAt: '' }

		case SHOW_SEARCH_DETAIL:
			return { ...state, searchDetailStatus: 'block', btnStatus: 'on' }

		case HIDE_SEARCH_DETAIL:
			return { ...state, searchDetailStatus: 'none', btnStatus: '' }

		case CHANGE_SEARCH_VALUE:
			return { ...state, searchInput: action.value }

		default:
			return state;
	}
}
