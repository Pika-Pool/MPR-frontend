import axios from 'axios';
import env from './env';
import type { AxiosError } from 'axios';

const axiosInstance = axios.create({ baseURL: env.serverBaseUrl });

export default axiosInstance;

export type AxiosQueryError = AxiosError<
	| {
			error?: {
				message: string;
			};
	  }
	| undefined
	| null
>;
