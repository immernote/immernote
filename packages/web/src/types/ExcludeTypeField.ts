export type ExcludeTypeField<A> = { [K in Exclude<keyof A, "type">]: A[K] };
