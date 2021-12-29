export const moduleQueryKeys = {
	modulesListQuery: 'modulesListQuery',
	moduleQuery: (moduleForSectionId: number) =>
		`moduleQuery-${moduleForSectionId}`,
	moduleQuestionsListQuery: 'moduleQuestionsListQuery',
	moduleQuestionQuery: 'moduleQuestionQuery',
	studentStatsQuery: 'studentStatsQuery',
} as const;

export const studentQueryKeys = {
	modulesListQuery: 'stu_modulesListQuery',
	moduleQuery: (moduleForSectionId: number) =>
		`stu_moduleQuery-${moduleForSectionId}`,
	moduleQuestionsListQuery: 'stu_moduleQuestionsListQuery',
	moduleQuestionQuery: (questionId: number) =>
		`std_moduleQuestionQuery-${questionId}`,
};
