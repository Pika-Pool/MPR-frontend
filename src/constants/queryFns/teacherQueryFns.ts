import type { Module } from '../../components/TeacherModulesList';
import axios from '../../config/axiosInstance';
import type { ModuleQuestion } from '../../pages/TeacherModule';

export interface ServerResponseData<T> {
	payload: T;
}

export async function getListOfModules(teacherId: number) {
	const res = await axios.get<ServerResponseData<Module[]>>(
		`/dashboard/${teacherId}/0`,
	);

	return res.data.payload || [];
}

export async function toggleModuleState({ ...module }: Module) {
	module.module_state = !module.module_state;

	const res = await axios.put<ServerResponseData<Module | undefined>>(
		'/updateModule/',
		module,
	);
	return res.data.payload;
}

export async function getModuleData(moduleForSectionId: number) {
	const res = await axios.get<ServerResponseData<Module>>(
		`/getModuleSection/${moduleForSectionId}`,
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
