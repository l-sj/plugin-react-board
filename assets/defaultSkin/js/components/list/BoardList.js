import React from 'react';

import BoardRowContainer from './../../containers/BoardRowContainer';
import BoardListHeaderContainer from './../../containers/BoardListHeaderContainer';
import PaginationContainer from './../../containers/PaginationContainer';
import Spinner from './../Spinner';

export default class BoardList extends React.Component {

	static propTypes = {
		boardList: React.PropTypes.array,
		categories: React.PropTypes.array
	};

	static contextTypes = {
		router: React.PropTypes.object
	}

	constructor(props) {
		super(props);
	}

	componentWillMount() {
		this.props.fetchCategory();
		this.props.fetchBoardIndex(this.props.query);
	}

	render() {

		if(this.props.loading) {
			return <Spinner />
		}

		const page = this.context.router.location.query.page || "1";
		
		return (
			<div>
				<BoardListHeaderContainer />

				<div className="board_list">
					<table>
						<thead className="xe-hidden-xs">
						<tr>
							{
								(() => {
									if(this.props.categories.length > 0) {
										return (<th scope="col"><span>카테고리</span></th>);
									}
								})()
							}
							<th scope="col" className="title"><span>제목</span></th>
							<th scope="col"><span>글쓴이</span></th>
							<th scope="col"><span><a href="#">조회수</a></span></th>
							<th scope="col"><span><a href="#">날짜</a></span></th>
						</tr>
						</thead>
						<tbody>
						{
							this.props.boardList.map((row, i) => {
								return (
										<BoardRowContainer key={i} {...row} />
									)
							})
						}
						</tbody>
					</table>
				</div>

				<PaginationContainer page={page} />
			</div>
		);
	}
};

