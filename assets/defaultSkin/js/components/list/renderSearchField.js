import React from 'react';

const renderSearchField = ({ input, placeholder, type, className, title, meta: { touched, error, warning } }) => {
	
	return (
		<div>
			<input {...input} className={className} title={title} placeholder={placeholder} type={type} />
			{touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
		</div>
	)
};

export default renderSearchField;