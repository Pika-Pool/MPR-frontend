import { useQuery, useQueryClient } from 'react-query';
import { moduleQueryKeys } from '../constants/queryKeys';
import { getModuleQuestions } from '../constants/queryFns/teacherQueryFns';

export default function useModuleQuestionsListQuery(moduleId?: number) {
	const queryClient = useQueryClient();

	const moduleQuestionsListQuery = useQuery(
		moduleQueryKeys.moduleQuestionsListQuery,
		() => getModuleQuestions(moduleId ?? -1),
		{
			initialData: [],
			enabled: moduleId != null,
			onSuccess: moduleQuestionsList =>
				moduleQuestionsList.forEach(questionObj =>
					queryClient.setQueryData(
						[moduleQueryKeys.moduleQuestionQuery, questionObj.id],
						questionObj,
					),
				),
		},
	);

	return moduleQuestionsListQuery;
}
