import type { QueryExecResult } from 'sql.js';

export default function SqlResultsTable({ columns, values }: QueryExecResult) {
	return (
		<div className='sql-result-table-container'>
			<table className='table table-hover table-striped table-sm sql-result-table'>
				<thead>
					<tr>
						{columns.map((columnName, i) => (
							<th key={i}>{columnName}</th>
						))}
					</tr>
				</thead>

				<tbody>
					{
						// values is an array of arrays representing the results of the query
						values.map((row, i) => (
							<tr key={i}>
								{row.map((value, i) => (
									<td className='text-wrap' key={i}>
										{value}
									</td>
								))}
							</tr>
						))
					}
				</tbody>
			</table>
		</div>
	);
}
