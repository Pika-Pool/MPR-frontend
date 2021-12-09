import axiosInstance from '../../config/axiosInstance';
import type { ModuleQuestion } from '../../pages/TeacherModule';
import type { Module } from '../../components/TeacherModulesList';
import type { ServerResponseData } from './teacherQueryFns';

type MapToIncompleteOrComplete<T> = Record<'incomplete' | 'complete', T>;
export type StudentModulesList = MapToIncompleteOrComplete<
	Module[] | undefined
>;

export async function getStudentListOfModules(studentId: number) {
	const res = await axiosInstance.get<ServerResponseData<StudentModulesList>>(
		`/studentModuleList/${studentId}`,
	);

	return res.data.payload;
}

export type StudentModule = { module: Module; is_complete: boolean };
export async function getStudentModule(
	studentId: number,
	moduleForSectionId: number,
) {
	const res = await axiosInstance.get<ServerResponseData<StudentModule>>(
		`/studentModule/${studentId}/${moduleForSectionId}`,
	);

	return res.data.payload;
}

export type StudentModuleQuestionsList = MapToIncompleteOrComplete<
	ModuleQuestion[] | undefined
>;
export async function getStudentModuleQuestionsList(
	studentId: number,
	moduleId: number,
) {
	const res = await axiosInstance.get<
		ServerResponseData<StudentModuleQuestionsList>
	>(`/stdmodulesQuestions/${studentId}/${moduleId}`);

	return res.data.payload || [];
}

export type StudentQuestion = {
	question: ModuleQuestion;
	is_complete: boolean;
};
export async function getStudentModuleQuestion(
	studentId: number,
	questionId: number,
) {
	const res = await axiosInstance.get<ServerResponseData<StudentQuestion>>(
		`getStdQuestion/${studentId}/${questionId}`,
	);

	return res.data.payload;
}

export async function markQuestionComplete({
	studentId,
	questionId,
}: {
	studentId: number;
	questionId: number;
}) {
	const res = await axiosInstance.put<
		ServerResponseData<StudentQuestion & { is_module_complete: boolean }>
	>(`markQuestionComplete/${studentId}`, { id: questionId });

	return res.data.payload;
}
