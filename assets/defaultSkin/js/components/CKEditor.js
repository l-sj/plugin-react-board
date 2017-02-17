import React, { Component, PropTypes } from 'react';

class CKEditor extends Component {

	constructor(props) {
		super(props);
	}

	componentWillMount() {
		console.log('this.props', this.props);
	}

	componentWillUnmount() {
		CKEDITOR.instances[this.props.id].removeAllListeners();
	}

	componentDidMount() {
		CKEDITOR.replace(this.props.id, this.props.config || {});
		CKEDITOR.instances[this.props.id].on('change', () => {
			let content = CKEDITOR.instances[this.props.id].getData();
			this.props.onChange(content);
		});
	}

	render() {
		return (
			<textarea { ...this.props } />
		);
	}
}

export default CKEditor;