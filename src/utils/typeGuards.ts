export function isNumber(n: unknown): n is number {
	return Boolean(n && !isNaN(Number(n)));
}
