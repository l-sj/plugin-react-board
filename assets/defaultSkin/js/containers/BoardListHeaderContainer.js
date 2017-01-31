import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SHOW_MANAGEMENT, HIDE_MANAGEMENT } from './../actions/boardListAction';
import BoardListHeader from './../components/list/BoardListHeader';

const mapStateToProps = (state) => {
	return {
		categories: state.list.index.categories,
		managementStatus: state.list.managementStatus,
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		changeCategory: () => {
			
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
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(BoardListHeader);