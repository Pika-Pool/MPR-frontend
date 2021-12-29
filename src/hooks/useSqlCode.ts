import { useEffect, useRef, useState } from 'react';
import env from '../config/env';
import useLocalStorage from './useLocalStorage';

export default function useSqlCode({
	questionId,
	preCommand,
}: {
	questionId: number;
	preCommand: string;
}) {
	const [value, setValue] = useLocalStorage<{ [questionId: number]: string }>(
		env.localStorageKeyForCode,
		{},
	);

	const preCommandRef = useRef(preCommand);
	const codeBoilerplateRef = useRef(
		createCodeBoilerplate(preCommandRef.current),
	);
	const [sqlCode, setSqlCode] = useState(
		value?.[questionId] ?? codeBoilerplateRef.current,
	);

	useEffect(() => {
		if (preCommand === preCommandRef.current) return;

		const prevBoilerplate = codeBoilerplateRef.current;
		codeBoilerplateRef.current = createCodeBoilerplate(preCommand);

		setSqlCode(
			sqlCode =>
				codeBoilerplateRef.current + sqlCode.slice(prevBoilerplate.length),
		);
	}, [preCommand]);

	useEffect(() => {
		console.log('value set');
		setValue(value => ({ ...value, [questionId]: sqlCode }));
	}, [questionId, setValue, sqlCode]);

	const onSqlCodeChange = (code: string) => {
		console.log(code.slice(codeBoilerplateRef.current.length));
		setSqlCode(
			codeBoilerplateRef.current +
				code.slice(codeBoilerplateRef.current.length),
		);
	};
	return {
		sqlCode,
		onSqlCodeChange,
		setSqlCode: onSqlCodeChange,
		codeBoilerplate: codeBoilerplateRef.current,
	} as const;
}

function createCodeBoilerplate(preCommand: string) {
	return `/* Pre-command given by teacher */
${preCommand}

/* You code goes under this */
`;
}

// type State = {
// 	questionId: number;
// 	preCommand: string;
// 	codeByUser: string;
// 	finalCode: string;
// };

// type Action = { type: 'reset' } | { type: 'code'; payload: string };

// const [initialState, reducer] = useMemo(() => {
// 	return [
// 		{
// 			preCommand,
// 			questionId,
// 			codeByUser: '',
// 			finalCode: preCommand,
// 		} as State,
// 		(state: State, action: Action): State => {
// 			switch (action.type) {
// 				case 'reset':
// 					return initialState;
// 				case 'code':
// 					return {
// 						...state,
// 						codeByUser: action.payload,
// 						finalCode: state.preCommand + action.payload,
// 					};
// 			}
// 		},
// 	] as const;
// }, [preCommand, questionId]);
