import React from 'react';
import ReactDOM from 'react-dom';
import SearchContainer from './../../containers/SearchContainer';
import Dropdown from './../Dropdown';
import _ from 'lodash';

class BoardListHeader extends React.Component {

	constructor(props) {
		super(props);

		// this.handleManagement = ::this.handleManagement;
		this.handleSearch = ::this.handleSearch;
	}

	handleCategory(value) {
		if(value) {
			console.log('value', value);
		} else {
			//전체보기
		}
	}

	handleOrdering(value) {
		if(value) {
			console.log('value', value);
		} else {
			//전체보기
		}
	}

	handleSearch(e) {
		if(this.props.searchStatus === 'block') {
			this.props.hideSearch();
		} else {
			this.props.showSearch();
		}
	}

	// handleManagement(e) {
	// 	let managementStatus = this.props.managementStatus;
	//
	// 	if(managementStatus === 'block') {
	// 		this.props.hideManagement();
	// 	} else {
	// 		this.props.showManagement();
	// 	}
	// }

	render() {

		let orderingItems = [
			{ text: '전체보기', value: '' },
			{ text: '최신순', value: 1 },
			{ text: '조회순', value: 2 },
			{ text: '북마크', value: 3 }
		];

		return (
			<div className="board_header">
				{
					(() => {
						if(Common.get('user').isManager) {
							return (
								<div className="bd_manage_area">
									<button type="button" className="xe-btn xe-btn-primary-outline bd_manage" onClick={this.handleManagement}>게시글 관리</button>
								</div>
							)
						}
					})()
				}
				<div className="bd_btn_area">
					<ul>
						<li><a href="#" className="bd_search" onClick={ this.handleSearch }><span className="xe-sr-only">검색</span><i className="xi-magnifier"></i></a></li>
						<li><a href="#/write"><span className="xe-sr-only">게시판 글쓰기</span><i className="xi-pen-o"></i></a></li>
						<li><a href="#"><span className="xe-sr-only">게시판 설정</span><i className="xi-cog"></i></a></li>
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
					<Dropdown optionList={ orderingItems } handleSelect={this.handleOrdering.bind(this)} />
				</div>

				{
					(() => {
						if(1 != 1) {
							return (
								<div className="bd_manage_detail" style={{display: this.props.managementStatus}}>
									<div className="xe-row">
										<div className="xe-col-sm-6">
											<div className="xe-row">
												<div className="xe-col-sm-3">
													<label className="xe-control-label">선택글 복사</label>
												</div>
												<div className="xe-col-sm-9">
													<div className="xe-form-inline">
														<div className="xe-dropdown">
															<button className="xe-btn" type="button" data-toggle="xe-dropdown" aria-expanded="false">게시판1</button>
															<ul className="xe-dropdown-menu">
																<li className="on"><a href="#">게시판1</a></li>
																<li><a href="#">게시판2</a></li>
															</ul>
														</div>
														<button type="button" className="xe-btn xe-btn-primary-outline">복사</button>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="xe-row">
										<div className="xe-col-sm-6">
											<div className="xe-row">
												<div className="xe-col-sm-3">
													<label className="xe-control-label">선택글 이동</label>
												</div>
												<div className="xe-col-sm-9">
													<div className="xe-form-inline">
														<div className="xe-dropdown">
															<button className="xe-btn" type="button" data-toggle="xe-dropdown" aria-expanded="false">게시판1</button>
															<ul className="xe-dropdown-menu">
																<li className="on"><a href="#">게시판1</a></li>
																<li><a href="#">게시판2</a></li>
															</ul>
														</div>
														<button type="button" className="xe-btn xe-btn-primary-outline">이동</button>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="xe-row">
										<div className="xe-col-sm-6">
											<div className="xe-row">
												<div className="xe-col-sm-3">
													<label className="xe-control-label">휴지통</label>
												</div>
												<div className="xe-col-sm-9">
													<a href="#" className="xe-btn-link">게시글을 휴지통으로 이동합니다.</a>
												</div>
											</div>
										</div>
									</div>
									<div className="xe-row">
										<div className="xe-col-sm-6">
											<div className="xe-row">
												<div className="xe-col-sm-3">
													<label className="xe-control-label">삭제</label>
												</div>
												<div className="xe-col-sm-9">
													<a href="#" className="xe-btn-link">게시글을 삭제합니다.</a>
												</div>
											</div>
										</div>
									</div>
								</div>
							)
						}
					})
				}

				<SearchContainer />
			</div>
		);
	}
}

export default BoardListHeader;