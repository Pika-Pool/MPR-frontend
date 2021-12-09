/// <reference types="vite/client" />
interface ImportMetaEnv
	extends Readonly<Record<string, string | boolean | undefined>> {
	readonly VITE_GOOGLE_CLIENT_ID: string;
	readonly VITE_SERVER_URL: string;
	readonly VITE_LOCALSTORAGE_KEY_FOR_CODE: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare namespace NodeJS {
	export interface ProcessEnv {
		readonly VITE_GOOGLE_CLIENT_ID: string;
		readonly VITE_SERVER_URL: string;
		readonly VITE_LOCALSTORAGE_KEY_FOR_CODE: string;
	}
}
