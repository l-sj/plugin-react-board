import { connect } from 'react-redux';
import { reduxForm, change, initialize } from 'redux-form';
import { fetchEditView, editReset, CHANGE_CATEOGRY } from './../actions/boardEditAction';
import { fetchCategory } from './../actions/boardListAction';
import EditForm from './../components/write/EditForm';

const form = 'editForm';
const fields = ['title', 'content', 'slug', 'categoryItemId'];
const formConfig = {
	form,
	fields
};

const mapStateToProps = (state) => {
	return {
		item: state.edit.item,
		categories: state.list.categories,
		categoryItemId: state.edit.categoryItemId,
		loading: state.edit.loading,
		err: state.edit.error,
		updated: state.edit.updated,
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		fetchEditView: (id) => {
			dispatch(fetchEditView(id));
		},
		editReset: () => {
			dispatch(editReset());
		},
		changeFormField: ({ field, value }) => {
			dispatch(change(form, field, value));
		},
		initializeForm: (data) => {
			dispatch(initialize(form, data));
		},
		fetchCategory: () => {
			dispatch(fetchCategory());
		},
		changeCategory: (categoryItemId) => {
			dispatch({
				type: CHANGE_CATEOGRY,
				categoryItemId
			});
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm(formConfig)(EditForm));