import { connect } from 'react-redux';
import { reduxForm, change, initialize } from 'redux-form';
import { fetchEditView } from './../actions/boardEditAction';
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
		categories: state.edit.categories,
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
		changeFormField: ({ field, value }) => {
			dispatch(change(form, field, value));
		},
		initializeForm: (data) => {
			dispatch(initialize(form, data));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm(formConfig)(EditForm));