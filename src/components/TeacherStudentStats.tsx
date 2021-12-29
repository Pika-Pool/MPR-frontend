import { useQuery } from 'react-query';
import { LoadingSpinner } from '.';
import type { AxiosQueryError } from '../config/axiosInstance';
import {
	getStudentStats,
	type StudentStat,
} from '../constants/queryFns/teacherQueryFns';
import { moduleQueryKeys } from '../constants/queryKeys';

const columns: (keyof StudentStat)[] = ['enroll', 'name', 'marks'];

export default function TeacherStudentStats() {
	const teacherId = 1;
	const { data, error, isLoading } = useQuery<StudentStat[], AxiosQueryError>(
		[moduleQueryKeys.studentStatsQuery, teacherId],
		() => getStudentStats(teacherId),
	);

	if (isLoading) return <LoadingSpinner />;
	if (error || !data) {
		console.log({ error, data });
		return <p className='text-danger'>Could not fetch student data</p>;
	}

	if (data.length === 0) return <p>No data to show</p>;

	return (
		<table className='table table-hover table-striped table-sm sql-result-table'>
			<thead>
				<tr>
					{columns.map(column => (
						<th className='text-capitalize' key={column}>
							{column}
						</th>
					))}
				</tr>
			</thead>

			<tbody>
				{data.map(stat => (
					<tr key={stat.id}>
						{columns.map(column => (
							<td key={column}>{stat[column]}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}
