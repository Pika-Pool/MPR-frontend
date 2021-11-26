import axios from 'axios';
import env from '../constants/env';
import type { Module } from '../components/TeacherModulesList';
import type { ModuleQuestion } from '../pages/TeacherModule';

interface ServerResponseData<T> {
	payload: T;
}

export async function getListOfModules(teacherId: number) {
	const res = await axios.get<ServerResponseData<Module[]>>(
		`${env.serverBaseUrl}/dashboard/${teacherId}/0`,
	);
	console.log('getListOfModules');
	return res.data?.payload || [];
}

// export async function getListOfModules() {
// 	return new Promise<Module[]>(resolve =>
// 		setTimeout(async () => {
// 			const res = await axios.get<Module[]>(
// 				`${env.serverBaseUrl}/datumApp/teacherHome/1`,
// 			);

// 			resolve(res.data);
// 		}, 10000),
// 	);
// }

export async function toggleModuleState({ ...module }: Module) {
	module.module_state = !module.module_state;

	const res = await axios.put<ServerResponseData<Module | undefined>>(
		`${env.serverBaseUrl}/updateModule/`,
		module,
	);
	return res.data?.payload;
}

export async function getModuleQuestions(moduleId: number) {
	const res = await axios.get<ServerResponseData<ModuleQuestion[]>>(
		`${env.serverBaseUrl}/moduleQuestions/${moduleId}`,
	);

	return res.data?.payload || [];
}

export async function getModuleData(moduleForSectionId: number) {
	const res = await axios.get<ServerResponseData<Module>>(
		`${env.serverBaseUrl}/getModuleSection/${moduleForSectionId}`,
	);

	return res.data?.payload;
}
