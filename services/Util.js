// @flow
import _ from "lodash";
import moment from "moment";

class Util {
	keyExtractor = (item, index) => index.toString();

	/**
	 *
	 * @param {string} phone
	 * @return {string}
	 */
	formatPhone = (phone) => {
		return phone;
		return `+${phone}`;
	};

	isValidURL(url) {
		// eslint-disable-next-line no-useless-escape
		const re =
			/^(http|https|fttp):\/\/|[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}(:[0-9]{1,5})?(\/.*)?$/;
		return re.test(url);
	}

	isValidHttpsURL(url) {
		// eslint-disable-next-line no-useless-escape
		const re =
			/^(https|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
		return re.test(url);
	}

	isTimeFormat(time) {
		// eslint-disable-next-line no-useless-escape

		const re =
			/^([1-9]|([012][0-9])|(3[01]))\/([0]{0,1}[1-9]|1[012])\/[0-9]{4} [012]{0,1}[0-9]:[0-6][0-9]$/;
		let bol = re.test(time);
		return bol;
	}

	isEmailValid(email) {
		// eslint-disable-next-line no-useless-escape
		const re =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email.trim());
	}
	isPasswordLengthValid(password) {
		return password.length >= 8;
	}
	isNameLengthValid(value) {
		return value.length <= 150;
	}

	isValidName(name) {
		return /^[a-zA-Z]+(?:\s+[a-zA-Z]+)*$/.test(name);
	}
	isValidFullName(name) {
		return /^[A-Za-z]+\s+[A-Za-z]+$/.test(name);
	}
	isValidPassword(pswd) {
		// return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&.+]{8,20}$/.test(
		// 	pswd
		// );
		return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/.test(
			pswd
		);
	}
	isValidUserName(userName) {
		return /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(userName);
	}
	isValidAreaOfSocialWork(work) {
		return /^[a-zA-Z @~`!@#$%^&*()_=+\\\\';:\"\\/?>.<,-]*$/i.test(work);
	}

	isValidUsaAdd(address) {
		return /^\s*\S+(?:\s+\S+){2}/.test(address);
	}

	isValidCity(city) {
		return /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/.test(city);
	}

	isValidZipCode(zipcode) {
		return /^\d{5}(?:[-\s]\d{4})?$/.test(zipcode);
	}

	capitalizeFirstLetter(string) {
		if (string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
		return "";
	}

	getFormattedDateTime = (date, format) => {
		if (date) return moment(date).format(format);
		return "";
	};

	getDateObjectFromString = (date, format) => {
		if (date) return moment(date, format).toDate();
		return "";
	};
	/* 
  getCurrentUserAccessToken() {
    return DataHandler.getStore().getState().user.data.access_token;
  }*/

	getCurrentAccessToken() {
		let token = DataHandler.getStore().getState().user.data.access_token;
		return token;
	}
	getCurrentRefreshToken() {
		let token = DataHandler.getStore().getState().user.data.refresh_token;

		return token;
	}

	isNumber(val) {
		return /^\d+$/.test(val);
	}

	generateGetParameter(obj) {
		let final = "?";
		for (const key in obj) {
			final = `${final}${key}=${obj[key]}&`;
		}
		final = final.slice(0, -1);
		return final;
	}

	isValidPracticeNum(num) {
		return /^[0-9]{1,10}$/.test(num);
	}
	isValidImg(img) {
		return /^.+\.(jpe?g|gif|png)$/i.test(img);
	}

	isValidMobileNumber(str) {
		if (!str) return false;
		const isnum = /^\d+$/.test(str);

		if (str.length < 15 && str.length > 9 && isnum) {
			return true;
		}
		return false;
	}

	isValidUKMobileNumber(str) {
		if (!str) return false;
		str = str.replace(/ /g, "");
		let mobileNumber = str.replace("+", "");
		// Number begins with 44
		if (mobileNumber.charAt(0) == "4" && mobileNumber.charAt(1) == "4") {
			mobileNumber = "0" + mobileNumber.slice(2);
		}
		// return /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/.test(mobileNumber);
		return /^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/.test(
			mobileNumber
		);
	}
}

export default new Util();
