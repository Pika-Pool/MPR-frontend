import { useQuery, useQueryClient } from 'react-query';
import { moduleQueryKeys } from '../constants/queryKeys';
import { getListOfModules } from '../queryFns/teacherQueryFns';

export default function useModulesListQuery() {
	const queryClient = useQueryClient();
	const modulesListQuery = useQuery(
		moduleQueryKeys.modulesListQuery,
		() => getListOfModules(1),
		{
			onSuccess: modulesList =>
				modulesList.forEach(module =>
					queryClient.setQueryData(
						moduleQueryKeys.moduleQuery(module.id),
						module,
					),
				),
		},
	);

	return modulesListQuery;
}
