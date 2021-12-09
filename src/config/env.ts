const {
	VITE_SERVER_URL: serverBaseUrl,
	VITE_LOCALSTORAGE_KEY_FOR_CODE: localStorageKeyForCode,
} = import.meta.env;

export default { serverBaseUrl, localStorageKeyForCode };
