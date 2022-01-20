import { useQuery } from 'react-query';
import {
	CompleteIncompleteAccordion,
	LoadingSpinner,
	ModuleCardList,
} from '../components';
import type { AxiosQueryError } from '../config/axiosInstance';
import {
	getStudentListOfModules,
	type StudentModulesList,
} from '../constants/queryFns/studentQueryFns';
import { studentQueryKeys } from '../constants/queryKeys';

export default function StudentDashboard() {
	const { data, error, isLoading } = useQuery<
		StudentModulesList,
		AxiosQueryError
	>(studentQueryKeys.modulesListQuery, () => getStudentListOfModules(1));

	if (isLoading) return <LoadingSpinner />;

	if (error || !data) {
		console.log({ error, data });
		if (error?.response?.data?.error?.message)
			return (
				<h3 className='text-danger'>{error.response.data.error.message}</h3>
			);

		return (
			<h3 className='text-danger'>Could not fetch your data. Try again</h3>
		);
	}

	return (
		<main className='mw-850 container'>
			<h1 className='mb-5'>Modules</h1>
			<CompleteIncompleteAccordion
				completeList={data.complete}
				completedHead='Completed Modules'
				noCompleteMsg="You don't have any Completed Modules"
				incompleteList={data.incomplete}
				incompleteHead='Incomplete Modules'
				noIncompleteMsg="You don't have any Incompleted Modules"
				render={list => <ModuleCardList modules={list} />}
			/>
		</main>
	);
}
