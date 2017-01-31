import { combineEpics } from 'redux-observable';
import { fetchBoardIndexEpic } from '../actions/boardListAction';
import { fetchViewEpic, deleteBoardEpic } from '../actions/boardViewAction';
import { createBoardContentsEpic } from '../actions/boardWriteAction';
import { fetchEditViewEpic, updateBoardEpic } from '../actions/boardEditAction';

const rootEpics = combineEpics(
	fetchBoardIndexEpic,
	fetchViewEpic,
	deleteBoardEpic,
	createBoardContentsEpic,
	fetchEditViewEpic,
	updateBoardEpic
);

export default rootEpics;