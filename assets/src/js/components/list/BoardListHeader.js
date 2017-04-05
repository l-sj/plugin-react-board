import React from 'react';
import ReactDOM from 'react-dom';
import Dropdown from './../Dropdown';
import _ from 'lodash';

class BoardListHeader extends React.Component {

	constructor(props) {
		super(props);

		this.handleCategory = ::this.handleCategory;
	}

	handleCategory(value) {
		if(value) {
			this.props.changeCategory({...this.props.query, categoryItemId: value, page: ''});

		} else {
			this.props.changeCategory({...this.props.query, categoryItemId: '', page: ''});
		}
	}

	render() {

		return (
			<div className="board_header">

				<div className="bd_btn_area">
					<ul>
						{
							(() => {
								if(Common.get('user').id) {
									return <li><a href="#/write"><span className="xe-sr-only">게시판 글쓰기</span><i className="xi-pen-o"></i></a></li>
								}
							})()
						}
						{
							(() => {
								if(Common.get('user').isManager) {
									return <li><a href={Common.get('links').settings}><span className="xe-sr-only">게시판 설정</span><i className="xi-cog"></i></a></li>
								}
							})()
						}
					</ul>
				</div>
				<div className="xe-form-inline xe-hidden-xs board-sorting-area">
					{
						(() => {
							if(this.props.categories.length) {

								let categories = _.assign([], this.props.categories);
								let selected = '';

								if(!_.find(categories, {value: ''})) {
									categories.unshift({text: '전체보기', value: ''});
								}

								if(this.props.query.categoryItemId) {
									selected = this.props.query.categoryItemId;
								}

								return <Dropdown optionList={ categories } handleSelect={this.handleCategory.bind(this)} selected={selected} />
							}
						})()
					}
				</div>
			</div>
		);
	}
}

export default BoardListHeader;