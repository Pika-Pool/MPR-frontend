import type { Module } from '../../components/TeacherModulesList';
import axios from '../../config/axiosInstance';
import type { ModuleQuestion } from '../../pages/TeacherModule';

export interface ServerResponseData<T> {
	payload: T;
}

export async function getListOfModules(teacherId: number) {
	const res = await axios.get<ServerResponseData<Module[]>>(
		`/dashboard/${teacherId}`,
	);

	return res.data.payload || [];
}

export async function toggleModuleState({ ...currentModule }: Module) {
	currentModule.module_state = !currentModule.module_state;

	const res = await axios.put<ServerResponseData<Module | undefined>>(
		'/updateModule/',
		currentModule,
	);
	return res.data.payload;
}

export async function getModuleData(moduleForSectionId: number) {
	const res = await axios.get<ServerResponseData<Module>>(
		`/getModule/${moduleForSectionId}`,
	);

	return res.data.payload;
}

export async function getModuleQuestions(moduleId: number) {
	const res = await axios.get<ServerResponseData<ModuleQuestion[]>>(
		`/moduleQuestions/${moduleId}`,
	);

	return res.data.payload || [];
}

export async function getQuestionData(questionId: number) {
	const res = await axios.get<ServerResponseData<ModuleQuestion>>(
		`/getQuestion/${questionId}`,
	);

	return res.data.payload;
}

export async function updateQuestionRequest(questionObj: ModuleQuestion) {
	const res = await axios.post<ServerResponseData<ModuleQuestion>>(
		`/addUpdateQuestion/`,
		questionObj,
	);

	return res.data.payload;
}

export interface StudentStat {
	id: number;
	name: string;
	enroll: number;
	marks: number;
}

export async function getStudentStats(teacherId: number) {
	const res = await axios.get<ServerResponseData<StudentStat[]>>(
		`/studentStats/${teacherId}`,
	);

	return res.data.payload;
}
