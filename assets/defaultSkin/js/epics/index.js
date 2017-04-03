import { combineEpics } from 'redux-observable';
import { fetchBoardIndexEpic, fetchCategoryEpic } from '../actions/boardListAction';
import { fetchViewEpic, deleteBoardEpic } from '../actions/boardViewAction';
import { createBoardContentsEpic } from '../actions/boardWriteAction';
import { fetchEditViewEpic, updateBoardEpic } from '../actions/boardEditAction';

const rootEpics = combineEpics(
	fetchBoardIndexEpic,
	fetchCategoryEpic,
	fetchViewEpic,
	deleteBoardEpic,
	createBoardContentsEpic,
	fetchEditViewEpic,
	updateBoardEpic,
);

export default rootEpics;