import { useMutation, useQueryClient } from 'react-query';
import { type Module } from '../components/TeacherModulesList';
import { moduleQueryKeys } from '../constants/queryKeys';
import { toggleModuleState } from '../queryFns/teacherQueryFns';

export default function useToggleModuleState() {
	const queryClient = useQueryClient();

	const toggleModuleStateMutation = useMutation(toggleModuleState, {
		onSuccess(data, prevModule) {
			if (!data) return;
			// update modules list
			queryClient.setQueryData<Module[]>(
				moduleQueryKeys.modulesListQuery,
				prevModulesList =>
					prevModulesList?.map(module =>
						module.id === prevModule.id ? data : module,
					) || [],
			);

			// update individual modules
			queryClient.setQueryData(
				moduleQueryKeys.moduleQuery(prevModule.id),
				data,
			);
		},
	});

	return toggleModuleStateMutation;
}
