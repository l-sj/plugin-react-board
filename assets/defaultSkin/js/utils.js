import moment from 'moment';

export const timeAgo = (date) => {
	var isTimestamp = (parseInt(date) == date);

	if (isTimestamp) {
		date = moment.unix(date);
	} else {
		date = moment(date);
	}

	return date.fromNow();
};

export const isNew = (createdAt) => {
	let ret = (new Date(createdAt).getTime() + (60 * 60 * 24 * 1000) > new Date().getTime())? true : false;

	return ret;
}

export const objectToQuerystring = (obj) => {
	return Object.keys(obj).reduce((str, key, i) => {
		let delimiter, val;
		delimiter = (i === 0) ? '?' : '&';
		key = encodeURIComponent(key);
		val = encodeURIComponent(obj[key]);
		
		return [str, delimiter, key, '=', val].join('');
	}, '');
}

export const parseErrorMessage = (error) => {
	switch(error.status) {
		case 422:
			const messages = [];
			const response = error.xhr.response;

			for(let prop in response) {
				for(let message of response[prop]) {
					messages.push(message);
				}
			}

			return messages;
			break;

		default :
			return error.message;
	}
}