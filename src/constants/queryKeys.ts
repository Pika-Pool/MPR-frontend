export const moduleQueryKeys = {
	modulesListQuery: 'modulesListQuery',
	moduleQuery: (id: number) => `moduleQuery-${id}`,
	moduleQuestionsListQuery: 'moduleQuestionsListQuery',
	moduleQuestionQuery: (questionId: number) =>
		`moduleQuestionQuery-${questionId}`,
} as const;
