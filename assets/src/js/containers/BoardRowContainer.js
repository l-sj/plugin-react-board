import { connect } from 'react-redux';
import { CHECK_ROW, UNCHECK_ROW } from './../actions/boardListAction';
import BoardRow from './../components/list/BoardRow';

const mapStateToProps = (state) => {
	return {
		checkedMap: state.list.checkedMap,
		categories: state.list.categories
	};
}

const mapDispatchToProps = (dispatch) => {
	return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(BoardRow);