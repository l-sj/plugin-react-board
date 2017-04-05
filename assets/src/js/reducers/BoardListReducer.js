import _ from 'lodash';
import {
	FETCH_CATEGORY, FETCH_CATEGORY_SUCCESS, FETCH_CATEGORY_FAILURE,
	FETCH_BOARD_INDEX, FETCH_BOARD_INDEX_SUCCESS, FETCH_BOARD_INDEX_FAILURE,
} from '../actions/boardListAction';

const INITIAL_STATE = {
	paginate: {
		currentPage: 1,
		from: 0,
		lastPage: 0,
		nextPageUrl: '',
		perPage: 0,
		to: 0,
		total: 0,
		perPageBlockCount: 0
	},
	boardList: [],
	categories: [],
	search: {
		searchStatue: 'none',
		searchDetailStatus: 'none',
		searchInput: '',
		searchInputDetail: '',
		author: '',
		startCreatedAt: '',
		endCreateAt: ''
	},
	query: {},
	error: null,
	loading: false,
	checkedAll: false,
	managementStatus: 'none',
	searchStatus: 'none',
	checkedMap: {},
};

export default function(state = INITIAL_STATE, action) {
	let error;

	switch(action.type) {

		case FETCH_CATEGORY:
			return { ...state, loading: true }

		case FETCH_CATEGORY_SUCCESS:
			return { ...state, loading: false, categories: action.payload.categories }

		case FETCH_CATEGORY_FAILURE:
			return { ...state, loading: false }

		case FETCH_BOARD_INDEX:
			let query = action.query || {};

			return { ...state, loading: true, error: null, query: { ...state.query, ...query, }, }

		case FETCH_BOARD_INDEX_SUCCESS:// return list of posts and make loading = false

			var checkedMap = {};
			var boardList = action.payload.paginate.data;
			var resPaginate = action.payload.paginate;
			var paginate = {
				currentPage: resPaginate.current_page,
				from: resPaginate.from,
				lastPage: resPaginate.last_page,
				nextPageUrl: resPaginate.next_page_url,
				perPage: resPaginate.per_page,
				to: resPaginate.to,
				total: resPaginate.total,
				perPageBlockCount: 10
			};

			boardList.map((obj) => {
				checkedMap[obj.id] = false;
			});

			return { ...state, boardList, paginate, checkedMap, checkedAll: false, error:null, loading: false, };

		default:
			return state;
	}
}
