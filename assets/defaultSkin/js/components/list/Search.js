import React, { Component } from 'react';
import Dropdown from './../Dropdown';

export default class Search extends Component{
	
	constructor() {
		super();

		this.search = ::this.search;
		this.handleSearchDeatil = ::this.handleSearchDeatil;
	}

	search() {
		console.log('clicked:search');
	}

	handleSearchDeatil() {
		if(this.props.searchDetailStatus === 'block') {
			this.props.hideSearchDetail();
		} else {
			this.props.showSearchDetail();
		}
	}
	
	render() {
		return (
			<div>
				<div className="bd_search_area" style={{display: this.props.searchStatus}}>
					<div className="bd_search_box">
						<input type="text" className="bd_search_input" title="게시판 검색" placeholder="검색어를 입력하세요" />
						<a href="#" className={`bd_btn_detail ${this.props.btnStatus}`} title="게시판 상세검색" onClick={ this.handleSearchDeatil }>상세검색</a>
					</div>
					<div className="bd_search_detail" style={{display: this.props.searchDetailStatus}}>
						<div className="bd_search_detail_option">
							<div className="xe-row">
								<div className="xe-col-sm-6">
									<div className="xe-row">
										<div className="xe-col-sm-3">
											<label className="xe-control-label">카테고리</label>
										</div>
										<div className="xe-col-sm-9">
											<div className="xe-dropdown">
												<button className="xe-btn" type="button" data-toggle="xe-dropdown" aria-expanded="false">전체보기</button>
												<ul className="xe-dropdown-menu">
													<li><a href="#">전체보기</a></li>
													<li><a href="#">카테고리</a></li>
												</ul>
											</div>
										</div>
									</div>
								</div>
								<div className="xe-col-sm-6">
									<div className="xe-row">
										<div className="xe-col-sm-3">
											<label className="xe-control-label">제목 + 내용</label>
										</div>
										<div className="xe-col-sm-9">
											<input type="text" className="xe-form-control" title="제목+내용" />
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
											<input type="text" className="xe-form-control" title="제목+내용" />
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
												<div className="xe-dropdown">
													<button className="xe-btn" type="button" data-toggle="xe-dropdown" aria-expanded="false">1주</button>
													<ul className="xe-dropdown-menu">
														<li><a href="#">2주</a></li>
														<li><a href="#">1개월</a></li>
														<li><a href="#">3개월</a></li>
														<li><a href="#">6개월</a></li>
														<li><a href="#">1년</a></li>
													</ul>
												</div>
											</div>
											<div className="xe-form-inline">
												<input type="text" className="xe-form-control" title="시작 날짜 입력" defaultValue="20150928"/> - <input type="text" className="xe-form-control" title="끝 날짜 입력" defaultValue="20151004" />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="bd_search_footer">
							<div className="xe-pull-right">
								<button type="button" className="xe-btn xe-btn-primary-outline" onClick={this.search}>검색</button>
								<button type="button" className="xe-btn xe-btn-secondary">취소</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
	
}