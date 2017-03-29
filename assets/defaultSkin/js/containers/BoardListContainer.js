import { connect } from 'react-redux';
import { fetchCategory, fetchBoardIndex, CHECK_ALL, UNCHECK_ALL } from './../actions/boardListAction';
import BoardList from './../components/list/BoardList';

const mapStateToProps = (state) => {
	return {
		boardList: state.list.index.boardList,
		paginate: state.list.index.paginate,
		categories: state.list.categories,
		loading: state.list.loading,
		error: state.list.error,
		checkedAll: state.list.checkedAll,
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		fetchCategory: () => {
			dispatch(fetchCategory());
		},
		fetchBoardIndex: (queryJSON) => {
			dispatch(fetchBoardIndex(queryJSON));
		},
		handleCheckAll: () => {
			dispatch({
				type: CHECK_ALL,
			});
		},
		handleUnCheckAll: () => {
			dispatch({
				type: UNCHECK_ALL,
			});
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(BoardList);