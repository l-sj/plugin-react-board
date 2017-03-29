import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, change } from 'redux-form';
import { SHOW_SEARCH, HIDE_SEARCH, SHOW_SEARCH_DETAIL, HIDE_SEARCH_DETAIL, CHANGE_SEARCH_VALUE, SEARCH } from './../actions/searchAction';
import Search from './../components/list/Search';

const form = 'searchForm';
const fields = ['writer', 'searchKeyword', 'startCreatedAt', 'endCreatedAt'];
const formConfig = {
	form,
	fields
};

const mapStateToProps = (state) => {
	return {
		searchStatus: state.search.searchStatus,
		btnStatus: state.search.btnStatus,
		searchDetailStatus: state.search.searchDetailStatus,
		searchInput: state.search.searchInput,
		searchInputDetail: state.search.searchInputDeatil,
		searchAuthor: state.search.searchAuthor,
		startCreatedAt: state.search.startCreatedAt,
		endCreatedAt: state.search.endCreatedAt,
		categories: state.list.categories,
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
				type: SHOW_SEARCH_DETAIL
			})
		},
		hideSearchDetail: () => {
			dispatch({
				type: HIDE_SEARCH_DETAIL
			})
		},
		handleSearchValue: (value) => {
			dispatch({
				type: CHANGE_SEARCH_VALUE,
				value
			})
		},
		changeFormField: ({field, value}) => {
			dispatch(change(form, field, value));
		},
		validateAndSearch: (values, dispatch) => {
			console.log('submit', values);

			return dispatch({
				type: SEARCH,
				payload: values
			})
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm(formConfig)(Search));