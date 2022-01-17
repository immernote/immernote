import { ellipsis, emDash, inputRules, smartQuotes, InputRule } from "prosemirror-inputrules";
import type { MarkType, Schema } from "prosemirror-model";

export function createInputRules(schema: Schema) {
	const rules = [
		...smartQuotes,
		ellipsis,
		emDash,
		strongStarRule(schema.marks.strong),
		strongScoreRule(schema.marks.strong),
		emStarRule(schema.marks.em),
		emScoreRule(schema.marks.em),
	];

	return inputRules({ rules });
}

export function strongStarRule(markType: MarkType) {
	return markInputRule(/\*\*([^\*]+)\*\*$/, markType);
}

export function strongScoreRule(markType: MarkType) {
	return markInputRule(/__([^\*_]+)__$/, markType);
}

export function emStarRule(markType: MarkType) {
	return markInputRule(reback("(?<!\\*)\\*([^\\*]+)\\*$", /\*([^\*]+)\*$/), markType);
}

export function emScoreRule(markType: MarkType) {
	return markInputRule(reback("(?<!_)_([^_]+)_$", /\_([^\_]+)\_$/), markType);
}

export function markInputRule(
	regexp: RegExp,
	markType: MarkType,
	getAttrs?: ((match: string[]) => { [key: string]: string }) | { [key: string]: string }
) {
	return new InputRule(regexp, (state, match, start, end) => {
		let attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
		let tr = state.tr;

		if (match[1]) {
			let textStart = start + match[0].indexOf(match[1]);
			let textEnd = textStart + match[1].length;
			if (textEnd < end) tr.delete(textEnd, end);
			if (textStart > start) tr.delete(start, textStart);
			end = start + match[1].length;
		}

		tr.addMark(start, end, markType.create(attrs));
		tr.removeStoredMark(markType); // Do not continue with mark.

		return tr;
	});
}

export function reback(re: string, fallback: RegExp): RegExp {
	try {
		return new RegExp(re);
	} catch {
		return fallback;
	}
}
