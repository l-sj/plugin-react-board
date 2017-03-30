import { connect } from 'react-redux';
import { fetchCategories, fetchView, deleteBoard } from './../actions/boardViewAction';
import DetailView from './../components/detail/DetailView';

const mapStateToProps = (state, ownProps) => {
	return {
		view: state.view,
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		fetchDetailView: (id) => {
			dispatch(fetchView(id));
		},
		deleteBoard: (id) => {
			dispatch(deleteBoard(id));
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailView);