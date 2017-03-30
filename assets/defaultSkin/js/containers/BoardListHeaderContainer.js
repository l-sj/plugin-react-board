import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SHOW_MANAGEMENT, HIDE_MANAGEMENT, fetchBoardIndex } from './../actions/boardListAction';
import { SHOW_SEARCH, HIDE_SEARCH } from './../actions/searchAction';
import BoardListHeader from './../components/list/BoardListHeader';

const mapStateToProps = (state) => {
	return {
		categories: state.list.categories,
		managementStatus: state.list.managementStatus,
		searchStatus: state.search.searchStatus,
		page: state.list.index.paginate.currentPage
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		changeCategory: (query) => {
			dispatch(fetchBoardIndex(query));
		},
		showManagement: () => {
			dispatch({
				type: SHOW_MANAGEMENT,
				display: 'block'
			});
		},
		hideManagement: () => {
			dispatch({
				type: HIDE_MANAGEMENT,
				display: 'none'
			});
		},
		showSearch: () => {
			dispatch({
				type: SHOW_SEARCH
			})
		},
		hideSearch: () => {
			dispatch({
				type: HIDE_SEARCH
			})
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(BoardListHeader);