import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

class Dropdown extends Component {

	static propTypes = {
		optionList: PropTypes.array.isRequired,
		handleSelect: PropTypes.func,
	};

	constructor(props) {
		super(props);

	}

	handleSelect(obj, e) {

		if(e) {
			e.preventDefault();
		}

		this.props.handleSelect(obj.value);
	}

	render() {
		return(
			<div className="xe-dropdown">
				<button className="xe-btn" type="button" data-toggle="xe-dropdown" aria-expanded="false">
					{
						this.props.optionList.map((obj, i) => {
							if(i === 0 && !this.props.selected || this.props.selected === obj.value) {
								return obj.text;
							}
						})
					}
				</button>
				<ul className="xe-dropdown-menu">
					{
						this.props.optionList.map((obj, i) => {

							var on = (i === 0 && !this.props.selected || this.props.selected === obj.value)? "on" : '';

							return (
								<li key={i} className={on}><a href="#" onClick={this.handleSelect.bind(this, obj)}>{ obj.text }</a></li>
							)
						})
					}
				</ul>
			</div>
		)
	}
}

export default Dropdown;