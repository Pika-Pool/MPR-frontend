/// <reference types="vite/client" />
interface ImportMetaEnv
	extends Readonly<Record<string, string | boolean | undefined>> {
	readonly VITE_SERVER_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
