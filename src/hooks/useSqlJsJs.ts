import { useCallback, useEffect, useReducer } from 'react';
import initSqlJs, { type QueryExecResult, type SqlJsStatic } from 'sql.js';
import sqlWasm from 'sql.js/dist/sql-wasm.wasm?url';
import { InitSqlJsError, SqlExecError } from '../constants/errors/sqlJsErrors';

type State = {
	isLoading: boolean;
	SQL?: SqlJsStatic;
	error?: InitSqlJsError | SqlExecError;
	execCodeResults?: QueryExecResult[];
};

type Action =
	| { type: 'initSql'; payload: SqlJsStatic }
	| { type: 'error'; payload: InitSqlJsError | SqlExecError }
	| { type: 'init' }
	| { type: 'execCodeResult'; payload: QueryExecResult[] };

const initState: State = { isLoading: true };

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case 'init':
			return initState;
		case 'initSql':
			return { isLoading: false, SQL: action.payload };
		case 'error':
			if (action.payload instanceof InitSqlJsError)
				return { isLoading: false, error: action.payload };

			return { isLoading: false, error: action.payload, SQL: state.SQL };
		case 'execCodeResult':
			if (state.error instanceof InitSqlJsError) return state;
			return {
				isLoading: false,
				execCodeResults: action.payload,
				SQL: state.SQL,
			};
		default:
			throw new Error(
				`${(action as any).type} is not defined as an action type`,
			);
	}
};

export default function useSqlJs() {
	const [{ SQL, error, isLoading, execCodeResults }, dispatch] = useReducer(
		reducer,
		initState,
	);

	useEffect(() => {
		dispatch({ type: 'init' });

		initSqlJs({ locateFile: () => sqlWasm })
			.then(SQL => dispatch({ type: 'initSql', payload: SQL }))
			.catch(err => {
				console.error(err);
				dispatch({
					type: 'error',
					payload: new InitSqlJsError(
						err?.message || 'Could not load an SQL instance',
					),
				});
			});
	}, []);

	const execSqlCode = useCallback(
		(sqlCode: string) => {
			if (!SQL) return [];

			try {
				const db = new SQL.Database();
				const res = db.exec(sqlCode);
				db.close();

				dispatch({ type: 'execCodeResult', payload: res });
				return res;
			} catch (err) {
				dispatch({
					type: 'error',
					payload: new SqlExecError((err as Error).message),
				});
			}

			return [];
		},
		[SQL],
	);

	return {
		SQL,
		error,
		isLoading,
		execSqlCode,
		execCodeResults,
		isReadyToExec: !error && !isLoading && SQL,
	};
}
