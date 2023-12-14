/* code for zoho user subscription */
export async function getSubscribedUserZoho(authToken, email) {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", `Zoho-oauthtoken ${authToken}`);
	var requestOptions = {
		method: "POST",
		headers: myHeaders,
		redirect: "follow",
	};
	fetch(
		`https://campaigns.zoho.com/api/v1.1/addlistsubscribersinbulk?listkey=3za0a2f6f44315522f2b2c278b69488cb2718bdc3ecb329bad4a5b78a7b5125013&resfmt=JSON&emailids=${email}`,
		requestOptions
	)
		.then((response) => response.text())
		.then((result) => console.log(result))
		.catch((error) => console.log("error", error));
}

/* code for zoho user subscription old function */
export async function getSubscribedUserZoho_OLDCODE(authToken, objBody) {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", `Zoho-oauthtoken ${authToken}`);

	var requestOptions = {
		method: "POST",
		headers: myHeaders,
		redirect: "follow",
	};
	fetch(
		`https://campaigns.zoho.com/api/v1.1/json/listsubscribe?resfmt=JSON&listkey=3z098e7b0a7a65aa3d288f3c77f422df481516f5d3e431a9c320da0a80d1a1bf8e&contactinfo=${objBody}&source=website`,
		requestOptions
	)
		.then((response) => response.text())
		.then((result) => console.log(result))
		.catch((error) => console.log("error", error));
}

/* code for getting refresh token */
export async function refreshToken() {
	const url = "https://accounts.zoho.com/oauth/v2/token";
	const params = new URLSearchParams();
	params.append("refresh_token", process.env.NEXT_PUBLIC_ZOHO_REFRESH_TOKEN);
	params.append("grant_type", "refresh_token");
	params.append("client_id", "1000.CYD00DCME2DMFDBR1NXCQYFBW0AOTD");
	params.append("client_secret", "a9aa8b75f4aa4cb8066f2a5f6338456b440b4ddae8");
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: params,
	});
	const data = await response.json();
	return data.access_token;
}

/* code for posting leads */
export async function createLead(token, payloadObj) {
	const url = "https://www.zohoapis.com/crm/v2/Leads";
	const accessToken = token;
	const response = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Zoho-oauthtoken ${accessToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			data: [payloadObj],
		}),
	});
	const data = response.body;

	return data;
}

/* get vendor info for zoho (CREATE) */
export async function createVendorInfo(authToken, infoObj) {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", `Zoho-oauthtoken ${authToken}`);
	myHeaders.append("Content-Type", "application/json");

	var raw = JSON.stringify({
		data: [infoObj],
	});

	var requestOptions = {
		method: "POST",
		headers: myHeaders,
		body: raw,
	};

	let res = await fetch(
		"https://www.zohoapis.com/crm/v2/Vendors",
		requestOptions
	);
	let result = await res.json();
	return result;
}

/* get vendor info for zoho (UPDATE) */
export async function updateVendorInfo(authtoken, infoObj) {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", `Zoho-oauthtoken ${authtoken}`);
	myHeaders.append("Content-Type", "application/json");

	var raw = JSON.stringify({
		data: [infoObj],
	});
	var requestOptions = {
		method: "PUT",
		headers: myHeaders,
		body: raw,
	};

	let res = await fetch(
		"https://www.zohoapis.com/crm/v2/Vendors",
		requestOptions
	);
	let result = await res.json();
	return result;
}

/* get customer info for zoho (CREATE) */
export async function createCustomerInfo(authToken, customerInfo) {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", `Zoho-oauthtoken ${authToken}`);
	myHeaders.append("content-type", "application/json");

	var raw = JSON.stringify(customerInfo);
	var requestOptions = {
		method: "POST",
		headers: myHeaders,
		body: raw,
	};
	let res = await fetch(
		"https://www.zohoapis.com/books/v3/contacts?organization_id=629778043",
		requestOptions
	);
	let result = await res.json();
	return result;
}

/* get customer info for zoho (UPDATE) */
export async function updateCustomerInfo(
	authToken,
	customerInfo,
	zohoCustomerID
) {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", `Zoho-oauthtoken ${authToken}`);
	myHeaders.append("content-type", "application/json");

	var raw = JSON.stringify(customerInfo);
	var requestOptions = {
		method: "PUT",
		headers: myHeaders,
		body: raw,
	};

	let res = await fetch(
		`https://www.zohoapis.com/books/v3/contacts/${zohoCustomerID}?organization_id=629778043`,
		requestOptions
	);
	let result = await res.json();
	return result;
}

/* get order info for zoho (CREATE) */
export async function createOrder(authToken, orderInfo) {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", `Zoho-oauthtoken ${authToken}`);
	myHeaders.append("content-type", "application/json");
	var raw = JSON.stringify(orderInfo);

	var requestOptions = {
		method: "POST",
		headers: myHeaders,
		body: raw,
	};
	let res = await fetch(
		"https://www.zohoapis.com/books/v3/salesorders?organization_id=629778043",
		requestOptions
	);
	let result = await res.json();
	return result;
}

/* get item info for zoho (CREATE) */
export async function createItemInfo(authToken, infoObj) {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", `Zoho-oauthtoken ${authToken}`);
	myHeaders.append("content-type", "application/json");

	var raw = JSON.stringify(infoObj);

	var requestOptions = {
		method: "POST",
		headers: myHeaders,
		body: raw,
	};

	let res = await fetch(
		"https://www.zohoapis.com/books/v3/items?organization_id=629778043",
		requestOptions
	);
	let result = await res.json();
	return result;
}

/* get item info for zoho (UPDATE) */
export async function updateItemInfo(authToken, zohoItemId, infoObj) {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", `Zoho-oauthtoken ${authToken}`);
	myHeaders.append("content-type", "application/json");

	var raw = JSON.stringify(infoObj);

	var requestOptions = {
		method: "PUT",
		headers: myHeaders,
		body: raw,
	};

	let res = await fetch(
		`https://www.zohoapis.com/books/v3/items/${zohoItemId}?organization_id=629778043`,
		requestOptions
	);
	let result = await res.json();
	return result;
}

/* get item info for zoho (DELETE) */
export async function deleteItemInfo(authToken, zohoItemId) {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", `Zoho-oauthtoken ${authToken}`);

	var requestOptions = {
		method: "DELETE",
		headers: myHeaders,
	};

	let res = await fetch(
		`https://www.zohoapis.com/books/v3/items/${zohoItemId}?organization_id=629778043`,
		requestOptions
	);
	let result = await res.json();
	return result;
}
