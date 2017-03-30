import React from 'react';
import ReactDOM from 'react-dom';
import SearchContainer from './../../containers/SearchContainer';
import Dropdown from './../Dropdown';
import _ from 'lodash';

class BoardListHeader extends React.Component {

	constructor(props) {
		super(props);

		// this.handleManagement = ::this.handleManagement;
		this.handleCategory = ::this.handleCategory;
		this.handleSearch = ::this.handleSearch;
	}

	handleCategory(value) {
		if(value) {
			this.props.changeCategory({categoryItemId: value});
			console.log('value', value);
		} else {
			// this.props.changeCategory();
		}
	}

	handleSearch(e) {
		if(this.props.searchStatus === 'block') {
			this.props.hideSearch();
		} else {
			this.props.showSearch();
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

								if(!_.find(categories, {value: ''})) {
									categories.unshift({text: '전체보기', value: ''});
								}

								return <Dropdown optionList={ categories } handleSelect={this.handleCategory.bind(this)} />
							}
						})()
					}
				</div>
			</div>
		);
	}
}

export default BoardListHeader;