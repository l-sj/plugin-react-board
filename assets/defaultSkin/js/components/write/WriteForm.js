import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import Spinner from './../Spinner';
import renderField from './renderField';
import renderTextArea from './renderTextArea';
import CKEditor from './../CKEditor';
import { createBoardContents } from './../../actions/boardWriteAction';
import _ from 'lodash';

import Dropdown from './../Dropdown';

const { DOM: { input } } = React;

class WriteForm extends Component {

	static contextTypes = {
		router: PropTypes.object
	};

	constructor() {
		super();

		this.handleSelect = ::this.handleSelect;
		this.onChangeEditor = ::this.onChangeEditor;
	}

	componentWillMount() {
		this.props.resetComponent();
		this.props.fetchBoardIndex();
		this.props.fetchCategory();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.item && !nextProps.error) {
			this.context.router.push('/');
		}
	}

	handleSelect(categoryItemId) {
		this.props.changeCategory(categoryItemId);
		this.props.changeFormField({field: 'categoryItemId', value: categoryItemId});
	}

	validateAndCreateBoard(values, dispatch) {
		values.slug = 'NULL';

		if(!values.title || !values.title.replace(/ /gi, '')) {
			XE.toast('warning', '제목을 입력하세요');
			return;
		}

		if(!values.content || !values.content.replace(/ /gi, '')) {
			XE.toast('warning', '내용을 입력하세요');
			return;
		}

		return dispatch(createBoardContents(values));
	}

	onChangeEditor(content) {
		this.props.changeFormField({field: 'content', value: content});
	}

	render() {
		const { handleSubmit, submitting, onSubmit } = this.props;

		if(this.props.err) {
			XE.toast('', this.props.err.message);
		}
		
		if(this.props.loading) {
			return (
				<Spinner />
			)
		}

		return (
			<div className="board_write">
				<form onSubmit={handleSubmit(this.validateAndCreateBoard)}>
					<div className="write_header">
					{
						(() => {
							let categories = this.props.categories;

							if(categories.length > 0) {
								if(!_.find(categories, {value: ''})) {
									categories.unshift({text: '카테고리 선택', value: ''});
								}

								return (
									<div className="write_category">
										<Dropdown optionList={categories} handleSelect={this.handleSelect} selected={parseInt(this.props.categoryItemId, 10)}/>
									</div>
								)
							}
						})()
					}
					<div className="write_title">
							<Field
								name="title"
								type="text"
								component={ renderField }
								label="제목을 입력하세요"
							/>
						</div>
					</div>

					<div className="write_body">
						<CKEditor placeholder="내용을 입력하세요" id="writeEditor" onChange={this.onChangeEditor}/>
					</div>

					<div className="write_footer">
						<div className="write_form_btn nologin">
							<button
								type="submit"
								className="bd_btn btn_submit"
								disabled={submitting}>등록</button>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default WriteForm;