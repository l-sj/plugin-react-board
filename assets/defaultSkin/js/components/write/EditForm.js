import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import { updateBoard } from './../../actions/boardEditAction';
import Spinner from './../Spinner';
import renderField from './renderField';
import renderTextArea from './renderTextArea';
import CKEditor from './../CKEditor';
import _ from 'lodash';
import { parseErrorMessage } from 'utils';

import Dropdown from './../Dropdown';

class EditForm extends Component {

	static contextTypes = {
		router: PropTypes.object
	}

	static propTypes = {
		fields: PropTypes.array.isRequired,
		handleSubmit: PropTypes.func.isRequired,
		submitting: PropTypes.bool.isRequired
	}

	constructor() {
		super();

		this.handleSelect = ::this.handleSelect;
		this.onChangeEditor = ::this.onChangeEditor;
	}

	componentWillMount() {
		const id = this.context.router.params.id;
		this.props.editReset();
		this.props.fetchEditView(id);
		this.props.fetchCategory();
	}

	componentWillReceiveProps(nextProps) {
		if(!this.props.item && nextProps.item) {
			console.log('nextProps', nextProps);

			this.props.initializeForm({ content: nextProps.item.content, title: nextProps.item.title, slug: nextProps.item.slug.slug, id: nextProps.item.id, categoryItemId: nextProps.categoryItemId });

		}else if(nextProps.updated) {
			const id = this.context.router.params.id;

			this.context.router.push(`/detail/${id}`);
		}
	}

	changeField(field, e) {

		console.log(field, e.target.value);

		this.props.changeFormField({field, value: e.target.value});
	}

	handleSelect(categoryItemId) {
		this.props.changeCategory(categoryItemId);
		this.props.changeFormField({field: 'categoryItemId', value: categoryItemId});

	}

	validateAndUpdateBoard(values, dispatch, id) {
		values.id = id;

		if(!values.title || !values.title.replace(/ /gi, '')) {
			XE.toast('warning', '제목을 입력하세요');
			return;
		}

		if(!values.content || !values.content.replace(/ /gi, '')) {
			XE.toast('warning', '내용을 입력하세요');
			return;
		}

		return dispatch(updateBoard(id, values));
	}

	onChangeEditor(content) {
		this.props.changeFormField({field: 'content', value: content});
	}

	render() {
		const { handleSubmit, submitting, initialValues } = this.props;
		const id = this.context.router.params.id;

		if(this.props.err) {
			for(let message of parseErrorMessage(this.props.err)) {
				XE.toast('', message);
			}
		}

		if(this.props.loading) {
			return (
				<Spinner />
			)
		}

		return (
			<div className="board_write">
				<form onSubmit={handleSubmit((values, dispatch) => { this.validateAndUpdateBoard(values, dispatch, id) })}>
					<div className="write_header">
						{
							(() => {
								let categories = _.assign([], this.props.categories);

								if(categories.length > 0 && this.props.item) {

									if(!_.find(categories, {value: ''})) {
										categories.unshift({text: '카테고리 선택', value: ''});
									}

									return (
										<div className="write_category">
											<Dropdown optionList={categories} handleSelect={this.handleSelect} selected={parseInt(this.props.categoryItemId, 10)} />
										</div>
									)
								}
							})()
						}
						<div className="write_title">

							<Field
								name="title"
								component={ renderField }
								type="text"
								label="제목을 입력하세요"
							/>

						</div>
					</div>
					<div className="write_body">
						<div className="write_form_editor">
							<CKEditor id="editFormEditor" onChange={this.onChangeEditor} value={this.props.item.content} />
						</div>
					</div>
					<div className="write_footer">
						<div className="write_form_btn nologin">
							<button type="submit" className="bd_btn btn_submit">등록</button>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default EditForm;