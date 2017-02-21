import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SHOW_SEARCH, HIDE_SEARCH, SHOW_SEARCH_DEATIL, HIDE_SEARCH_DEATIL } from './../actions/searchAction';
import Search from './../components/list/Search';

const mapStateToProps = (state) => {
	return {
		searchStatus: state.search.searchStatus,
		btnStatus: state.search.btnStatus,
		searchDetailStatus: state.search.searchDetailStatus,
		searchInput: state.search.searchInput,
		searchInputDetail: state.search.searchInputDeatil,
		searchAuthor: state.search.searchAuthor,
		startCreatedAt: state.search.startCreatedAt,
		endCreatedAt: state.searchendCreatedAt,
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		changeCategory: () => {

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
		showSearchDetail: () => {
			dispatch({
				type: SHOW_SEARCH_DEATIL
			})
		},
		hideSearchDetail: () => {
			dispatch({
				type: HIDE_SEARCH_DEATIL
			})
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);