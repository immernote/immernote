export function isVoid<T>(x: T | void): x is void {
	return x == null
}
