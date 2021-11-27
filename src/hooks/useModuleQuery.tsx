import { useQuery, useQueryClient } from 'react-query';
import type { Module } from '../components/TeacherModulesList';
import { moduleQueryKeys } from '../constants/queryKeys';
import { getModuleData } from '../constants/queryFns/teacherQueryFns';

export default function useModuleQuery(moduleForSectionId?: number) {
	const queryClient = useQueryClient();

	const moduleQuery = useQuery(
		moduleQueryKeys.moduleQuery(moduleForSectionId ?? -1),
		() => getModuleData(moduleForSectionId ?? -1),
		{
			enabled: moduleForSectionId != null,
			onSuccess: module =>
				queryClient.setQueryData<Module[] | undefined>(
					moduleQueryKeys.modulesListQuery,
					prevModulesList =>
						prevModulesList?.map(prevModule =>
							prevModule.id === module.id ? module : prevModule,
						),
				),
		},
	);

	return moduleQuery;
}
