import { useState } from 'react';
import AceEditor from 'react-ace';
import { FaChevronRight } from 'react-icons/fa';
import type { QueryExecResult } from 'sql.js';
import { LoadingSpinner } from '../components';
import SqlResultsTable from '../components/SqlResultsTable';
import useSqlJs from '../hooks/useSqlJsJs';

import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/theme-nord_dark';

export default function Playground() {
	const { error, isLoading, execSqlCode } = useSqlJs();

	if (isLoading) return <LoadingSpinner />;
	if (error)
		return (
			<pre className='text-danger'>
				{(
					error ||
					new Error('Something went wrong. Could not load SQL sandbox.')
				).toString()}
			</pre>
		);

	return (
		<div className='container'>
			<SQLRepl execSqlCode={execSqlCode} />
		</div>
	);
}

export function SQLRepl({
	execSqlCode,
}: {
	execSqlCode: (code: string) => QueryExecResult[];
}) {
	const [error, setError] = useState<Error | null>(null);
	const [results, setResults] = useState<QueryExecResult[]>([]);
	const [sqlCode, setSqlCode] = useState('');

	function onExecSql() {
		if (!sqlCode) return setError(new Error('Please write some SQL code'));

		try {
			// The sql is executed synchronously on the UI thread.
			// You may want to use a web worker here instead
			setResults(execSqlCode(sqlCode));
			setError(null);
		} catch (err) {
			if (err instanceof Error) setError(err);
			else if (typeof err === 'string') setError(new Error(err));
			else
				setError(new Error('Something went wrong. Could not load SQL sandbox'));

			setResults([]);
		}
	}

	return (
		<div>
			<header className='d-flex justify-content-between align-items-center'>
				<h2>SQL Playground</h2>
				<button
					className='btn btn-outline-success d-flex justify-content-center align-items-center'
					onClick={onExecSql}
				>
					Run <FaChevronRight className='ms-1' />
				</button>
			</header>

			<div className='my-1' style={{ height: '60vh' }}>
				<AceEditor
					mode='sql'
					theme='nord_dark'
					name='UNIQUE_ID_OF_DIV'
					editorProps={{ $blockScrolling: true }}
					fontSize='1.1rem'
					width='100%'
					onChange={e => setSqlCode(e)}
					tabSize={2}
					setOptions={{ wrap: true, showInvisibles: true, useSoftTabs: true }}
					commands={[
						{
							name: 'run-code',
							bindKey: { win: 'Ctrl-Enter', mac: 'Cmd-Enter' },
							exec: onExecSql,
						},
					]}
					height='100%'
					placeholder='Enter some SQL. No inspiration? Try “select sqlite_version()”'
				/>
			</div>

			<pre className='error'>{error?.toString()}</pre>

			<pre>
				{
					// results contains one object per select statement in the query
					results.map(({ columns, values }, i) => (
						<SqlResultsTable key={i} columns={columns} values={values} />
					))
				}
			</pre>
		</div>
	);
}
