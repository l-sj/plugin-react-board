import { combineEpics } from 'redux-observable';
import { fetchBoardIndexEpic, fetchCategoryEpic } from '../actions/boardListAction';
import { fetchViewEpic, deleteBoardEpic } from '../actions/boardViewAction';
import { createBoardContentsEpic } from '../actions/boardWriteAction';
import { fetchEditViewEpic, updateBoardEpic } from '../actions/boardEditAction';
import { searchBoardContentEpic } from '../actions/searchAction';

const rootEpics = combineEpics(
	fetchBoardIndexEpic,
	fetchCategoryEpic,
	fetchViewEpic,
	deleteBoardEpic,
	createBoardContentsEpic,
	fetchEditViewEpic,
	updateBoardEpic,
	searchBoardContentEpic
);

export default rootEpics;