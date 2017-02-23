import React, { Component } from 'react';
import { Field } from 'redux-form';
import Dropdown from './../Dropdown';
import renderField from './../write/renderField';

const  { DOM: { input, select, textarea } } = React;

export default class Search extends Component{
	
	constructor() {
		super();

		this.handleSearchInput = ::this.handleSearchInput;
		this.handleSearchDetail = ::this.handleSearchDetail;
		this.handleCategory = ::this.handleCategory;
		this.handlePeriod = ::this.handlePeriod;
	}

	handleSearchInput(e) {
		console.log(e.target.value);

		this.props.handleSearchValue(e.target.value);
	}

	handleCategory(value) {
		console.log(`selected ${value}`);

		this.props.changeFormField({field: 'categoryItemId', value});
	}

	handlePeriod(value) {
		console.log(`selected ${value}`);

		this.props.changeFormField({field: 'period', value});
	}

	handleSearchDetail() {
		if(this.props.searchDetailStatus === 'block') {
			this.props.hideSearchDetail();
		} else {
			this.props.showSearchDetail();
		}
	}

	// validateAndSearch(values, dispatch) {
	// 	console.log('submit', values);
	//
	// 	return dispatch(this.props.searchBoardContent(values));
	// }

	render() {
		const { handleSubmit, submitting, onSubmit } = this.props;
		const periodOptions = [
			{ text: '1주', value: '1week' },
			{ text: '2주', value: '1week' },
			{ text: '1개월', value: '1month' },
			{ text: '3개월', value: '3month' },
			{ text: '6개월', value: '6month' },
			{ text: '1년', value: '1year' },
		];

		return (
			<div>
				<form onSubmit={handleSubmit(this.props.validateAndSearch)}>
					<div className="bd_search_area" style={{display: this.props.searchStatus}}>
						<div className="bd_search_box">
							<Field component="input" type="text" className="bd_search_input" title="게시판 검색" placeholder="검색어를 입력하세요" name="searchKeyword" value={this.props.searchInput} onChange={ this.handleSearchInput } />
							<a href="#" className={`bd_btn_detail ${this.props.btnStatus}`} title="게시판 상세검색" onClick={ this.handleSearchDetail }>상세검색</a>
						</div>
						<div className="bd_search_detail" style={{display: this.props.searchDetailStatus}}>
							<div className="bd_search_detail_option">
								<div className="xe-row">
									{
										(() => {
											if(this.props.categories.length) {

												let categories = this.props.categories;
												categories.unshift({text: '전체보기', value: ''});

												return (
													<div className="xe-col-sm-6">
														<div className="xe-row">
															<div className="xe-col-sm-3">
																<label className="xe-control-label">카테고리</label>
															</div>
															<div className="xe-col-sm-9">
																<Dropdown optionList={ categories } handleSelect={ this.handleCategory } />
															</div>
														</div>
													</div>
												)
											}
										})()
									}
									<div className="xe-col-sm-6">
										<div className="xe-row">
											<div className="xe-col-sm-3">
												<label className="xe-control-label">제목 + 내용</label>
											</div>
											<div className="xe-col-sm-9">
												<Field component="input" type="text" name="searchKeywordDetail" className="xe-form-control" title="제목+내용" value={this.props.searchInput} onChange={ this.handleSearchInput } />
											</div>
										</div>
									</div>
								</div>
								<div className="xe-row">
									<div className="xe-col-sm-6">
										<div className="xe-row">
											<div className="xe-col-sm-3">
												<label className="xe-control-label">글쓴이</label>
											</div>
											<div className="xe-col-sm-9">
												<Field component="input" type="text" className="xe-form-control" name="writer" title="글쓴이" />
											</div>
										</div>
									</div>
									<div className="xe-col-sm-6">
										<div className="xe-row">
											<div className="xe-col-sm-3">
												<label className="xe-control-label">기간</label>
											</div>
											<div className="xe-col-sm-9">
												<div className="xe-form-group">
													<Dropdown optionList={ periodOptions } handleSelect={ this.handlePeriod } />
												</div>
												<div className="xe-form-inline">
													<Field component="input" type="text" className="xe-form-control" name="startCreatedAt" title="시작 날짜 입력" value="20150928"/> - <Field component="input" type="text" className="xe-form-control" name="endCreatedAt" title="끝 날짜 입력" value="20151004" />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="bd_search_footer">
								<div className="xe-pull-right">
									<button type="submit" className="xe-btn xe-btn-primary-outline" disabled={submitting}>검색</button>
									<button type="button" className="xe-btn xe-btn-secondary">취소</button>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		)
	}
	
}