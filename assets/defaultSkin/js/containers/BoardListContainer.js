import { connect } from 'react-redux';
import { fetchCategory, fetchBoardIndex, CHECK_ALL, UNCHECK_ALL } from './../actions/boardListAction';
import BoardList from './../components/list/BoardList';

const mapStateToProps = (state) => {
	return {
		boardList: state.list.boardList,
		paginate: state.list.paginate,
		categories: state.list.categories,
		query: state.list.query,
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