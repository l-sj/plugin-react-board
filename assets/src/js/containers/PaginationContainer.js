import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchBoardIndex } from './../actions/boardListAction';
import Pagination from './../components/list/Pagination';

const mapStateToProps = (state) => {
	return {
		paginate: state.list.paginate,
		query: state.list.query
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		fetchBoardIndex: (query) => {
			dispatch(fetchBoardIndex(query));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Pagination);