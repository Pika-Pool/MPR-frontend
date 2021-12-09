import { useEffect, useState } from 'react';

export default function useLocalStorage<T>(
	key: string,
	initialValue?: T | (() => T),
) {
	if (!key) throw new Error(`invalid key : ${key}`);

	const [value, setValue] = useState(() => getSavedValue(key, initialValue));

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value) || '');
	}, [key, value]);

	return [value, setValue] as const;
}

function getSavedValue<T>(
	key: string,
	initialValue?: T | (() => T),
): T | undefined {
	const storedString = localStorage.getItem(key);
	const savedValue = storedString && JSON.parse(storedString);

	if (savedValue) return savedValue as T;
	return initialValue instanceof Function ? initialValue() : initialValue;
}
