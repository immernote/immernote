import { Schema } from "prosemirror-model";

export const schema = new Schema({
	nodes: {
		// :: NodeSpec The top level document node.
		doc: {
			content: "block+",
		},

		// :: NodeSpec A plain paragraph textblock. Represented in the DOM
		// as a `<p>` element.
		paragraph: {
			content: "inline*",
			group: "block",
			parseDOM: [{ tag: "p" }],
			toDOM() {
				return ["p", 0];
			},
		},

		// :: NodeSpec A code listing. Disallows marks or non-text inline
		// nodes by default. Represented as a `<pre>` element with a
		// `<code>` element inside of it.
		code_block: {
			content: "text*",
			marks: "",
			group: "block",
			code: true,
			defining: true,
			parseDOM: [{ tag: "pre", preserveWhitespace: "full" }],
			toDOM() {
				return ["pre", ["code", 0]];
			},
		},

		// :: NodeSpec The text node.
		text: {
			group: "inline",
		},

		ordered_list: {
			content: "list_item+",
			group: "block",
			attrs: { order: { default: 1 } },
			parseDOM: [
				{
					tag: "ol",
					// @ts-ignore
					getAttrs(dom: HTMLOListElement) {
						return {
							order: dom.hasAttribute("start") ? +(dom.getAttribute("start") as string) : 1,
						};
					},
				},
			],
			toDOM(node) {
				return node.attrs.order == 1 ? ["ol", 0] : ["ol", { start: node.attrs.order }, 0];
			},
		},
		bullet_list: {
			content: "list_item+",
			group: "block",
			parseDOM: [{ tag: "ul" }],
			toDOM() {
				return ["ul", 0];
			},
		},
		list_item: {
			content: "paragraph block*",
			parseDOM: [{ tag: "li" }],
			toDOM() {
				return ["li", 0];
			},
			defining: true,
		},

		// :: NodeSpec An inline image (`<img>`) node. Supports `src`,
		// `alt`, and `href` attributes. The latter two default to the empty
		// string.
		image: {
			inline: true,
			attrs: {
				src: {},
				alt: { default: null },
				title: { default: null },
			},
			group: "inline",
			draggable: true,
			parseDOM: [
				{
					tag: "img[src]",
					// @ts-ignore
					getAttrs(dom: HTMLImageElement) {
						return {
							src: dom.getAttribute("src"),
							title: dom.getAttribute("title"),
							alt: dom.getAttribute("alt"),
						};
					},
				},
			],
			toDOM(node) {
				let { src, alt, title } = node.attrs;
				return ["img", { src, alt, title }];
			},
		},

		// :: NodeSpec A hard line break, represented in the DOM as `<br>`.
		hard_break: {
			inline: true,
			group: "inline",
			selectable: false,
			parseDOM: [{ tag: "br" }],
			toDOM() {
				return ["br"];
			},
		},
	},

	marks: {
		// :: MarkSpec A link. Has `href` and `title` attributes. `title`
		// defaults to the empty string. Rendered and parsed as an `<a>`
		// element.
		link: {
			attrs: {
				href: {},
				title: { default: null },
			},
			inclusive: false,
			parseDOM: [
				{
					tag: "a[href]",
					// @ts-ignore
					getAttrs(dom: HTMLLinkElement) {
						return {
							href: dom.getAttribute("href"),
							title: dom.getAttribute("title"),
						};
					},
				},
			],
			toDOM(node) {
				let { href, title } = node.attrs;
				return ["a", { href, title }, 0];
			},
		},

		// :: MarkSpec An emphasis mark. Rendered as an `<em>` element.
		// Has parse rules that also match `<i>` and `font-style: italic`.
		em: {
			parseDOM: [{ tag: "i" }, { tag: "em" }, { style: "font-style=italic" }],
			toDOM() {
				return ["em", 0];
			},
		},

		// :: MarkSpec A strong mark. Rendered as `<strong>`, parse rules
		// also match `<b>` and `font-weight: bold`.
		strong: {
			parseDOM: [
				{ tag: "strong" },
				// This works around a Google Docs misbehavior where
				// pasted content will be inexplicably wrapped in `<b>`
				// tags with a font-weight normal.
				{
					tag: "b",
					// @ts-ignore
					getAttrs: (node: HTMLElement) => node.style.fontWeight != "normal" && null,
				},
				{
					style: "font-weight",
					// @ts-ignore
					getAttrs: (value: string) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null,
				},
			],
			toDOM() {
				return ["strong", 0];
			},
		},

		// :: MarkSpec Code font mark. Represented as a `<code>` element.
		code: {
			parseDOM: [{ tag: "code" }],
			toDOM() {
				return ["code", 0];
			},
		},
	},
});
