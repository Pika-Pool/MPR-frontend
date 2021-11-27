import { useQuery, useQueryClient } from 'react-query';
import { getQuestionData } from '../constants/queryFns/teacherQueryFns';
import { moduleQueryKeys } from '../constants/queryKeys';
import { ModuleQuestion } from '../pages/TeacherModule';

export default function useModuleQuestionQuery(questionId?: number) {
	const queryClient = useQueryClient();

	const moduleQuestionQuery = useQuery(
		moduleQueryKeys.moduleQuestionQuery(questionId ?? -1),
		() => getQuestionData(questionId ?? -1),
		{
			enabled: questionId != null,
			onSuccess: questionData =>
				queryClient.setQueryData<ModuleQuestion[] | undefined>(
					moduleQueryKeys.moduleQuestionsListQuery,
					prevQuestionsList =>
						prevQuestionsList?.map(prevQuestion =>
							prevQuestion.id === questionData.id ? questionData : prevQuestion,
						),
				),
		},
	);

	return moduleQuestionQuery;
}
