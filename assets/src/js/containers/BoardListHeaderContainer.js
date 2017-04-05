import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchBoardIndex } from './../actions/boardListAction';
import BoardListHeader from './../components/list/BoardListHeader';

const mapStateToProps = (state) => {
	return {
		categories: state.list.categories,
		managementStatus: state.list.managementStatus,
		page: state.list.paginate.currentPage,
		query: state.list.query,
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		changeCategory: (query) => {
			dispatch(fetchBoardIndex(query));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(BoardListHeader);