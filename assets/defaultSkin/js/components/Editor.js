import React, { Component, PropTypes } from 'react';
import ReactQuill from 'react-quill';
import './../../../../node_modules/quill/dist/quill.base.css';
import './../../../../node_modules/quill/dist/quill.snow.css';

class Editor extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<ReactQuill theme="snow" { ...this.props } />
		);
	}
}

export default Editor;