import { useEffect, useState } from 'react';
import initSqlJs from 'sql.js';
// types
import type { Database, QueryExecResult } from 'sql.js';
// assets
import sqlWasm from 'sql.js/dist/sql-wasm.wasm?url';
import './App.css';

const useSqlDb = () => {
	const [db, setDb] = useState<Database | null>(null);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		(async () => {
			try {
				const SQL = await initSqlJs({
					locateFile: () => sqlWasm,
				});
				setDb(new SQL.Database());
			} catch (err) {
				console.log(err);
				setError(err as Error);
			}
		})();
	}, []);

	return { sqlDb: db, error };
};

export default function App() {
	const { sqlDb, error } = useSqlDb();

	if (error) return <pre>Error : {error.toString()}</pre>;
	else if (!sqlDb) return <pre>Loading...</pre>;
	else return <SQLRepl db={sqlDb} />;
}

function SQLRepl({ db }: { db: Database }) {
	const [error, setError] = useState<Error | null>(null);
	const [results, setResults] = useState<QueryExecResult[]>([]);

	function exec(sql: string) {
		try {
			// The sql is executed synchronously on the UI thread.
			// You may want to use a web worker here instead
			setResults(db.exec(sql)); // an array of objects is returned
			setError(null);
		} catch (err) {
			// exec throws an error when the SQL statement is invalid
			setError(err as Error);
			setResults([]);
		}
	}

	return (
		<div className='App'>
			<h1>React SQL interpreter</h1>

			<textarea
				onChange={e => exec(e.target.value)}
				placeholder='Enter some SQL. No inspiration ? Try “select sqlite_version()”'
			></textarea>

			<pre className='error'>{(error || '').toString()}</pre>

			<pre>
				{
					// results contains one object per select statement in the query
					results.map(({ columns, values }, i) => (
						<ResultsTable key={i} columns={columns} values={values} />
					))
				}
			</pre>
		</div>
	);
}

function ResultsTable({ columns, values }: QueryExecResult) {
	return (
		<table>
			<thead>
				<tr>
					{columns.map((columnName, i) => (
						<td key={i}>{columnName}</td>
					))}
				</tr>
			</thead>

			<tbody>
				{
					// values is an array of arrays representing the results of the query
					values.map((row, i) => (
						<tr key={i}>
							{row.map((value, i) => (
								<td key={i}>{value}</td>
							))}
						</tr>
					))
				}
			</tbody>
		</table>
	);
}
