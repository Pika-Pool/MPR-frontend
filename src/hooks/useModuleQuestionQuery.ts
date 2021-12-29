import { useQuery, useQueryClient } from 'react-query';
import type { AxiosQueryError } from '../config/axiosInstance';
import { getQuestionData } from '../constants/queryFns/teacherQueryFns';
import { moduleQueryKeys } from '../constants/queryKeys';
import type { ModuleQuestion } from '../pages/TeacherModule';

export default function useModuleQuestionQuery(questionId?: number) {
	const queryClient = useQueryClient();

	const moduleQuestionQuery = useQuery<ModuleQuestion, AxiosQueryError>(
		[moduleQueryKeys.moduleQuestionQuery, questionId],
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
