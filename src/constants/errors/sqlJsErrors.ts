export class InitSqlJsError extends Error {
	constructor(message: string) {
		super(message);
	}
}

export class SqlExecError extends Error {
	constructor(message: string) {
		super(message);
	}
}
