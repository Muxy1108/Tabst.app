/**
 * AlphaTex Syntax Highlighting
 *
 * Provides lightweight syntax highlighting for AlphaTex language using
 * CodeMirror 6 stream parser (no require / TextMate dependency at runtime).
 */

import {
	HighlightStyle,
	StreamLanguage,
	syntaxHighlighting,
} from "@codemirror/language";
import type { Extension } from "@codemirror/state";
import { textMateGrammar } from "@coderline/alphatab-language-server";
import { tags } from "@lezer/highlight";

let highlightExtension: Extension[] | null = null;

/**
 * Simple stream parser for AlphaTex
 * - Commands start with "\"
 * - Strings are double-quoted
 * - Numbers and durations are numeric (with optional dots)
 * - Brackets and pipes are treated as operators
 */
const alphaTexParser = StreamLanguage.define({
	startState() {
		return { inBlockComment: false };
	},
	token(stream, state: { inBlockComment: boolean }) {
		if (state.inBlockComment) {
			while (!stream.eol()) {
				if (stream.match("*/")) {
					state.inBlockComment = false;
					break;
				}
				stream.next();
			}
			return "comment";
		}

		if (stream.eatSpace()) return null;

		// Block comments with /*
		if (stream.match("/*")) {
			state.inBlockComment = true;
			while (!stream.eol()) {
				if (stream.match("*/")) {
					state.inBlockComment = false;
					break;
				}
				stream.next();
			}
			return "comment";
		}

		// Line comments with //
		if (stream.match("//")) {
			stream.skipToEnd();
			return "comment";
		}

		// Commands and tags starting with backslash
		if (stream.eat("\\")) {
			stream.eatWhile(/[-\w]/);
			return "keyword";
		}

		// Strings
		if (stream.eat('"')) {
			while (!stream.eol()) {
				if (stream.eat('"')) break;
				else stream.next();
			}
			return "string";
		}

		// Brackets and grouping symbols
		if (stream.eat(/[{}[\]()]/)) return "bracket";

		// Barlines and separators
		if (stream.eat("|")) return "operator";

		// Numbers (including dotted rhythms like 4. or 3.5)
		if (/[0-9]/.test(stream.peek() ?? "")) {
			stream.eatWhile(/[0-9.]/);
			return "number";
		}

		// Default: move one char
		stream.next();
		return null;
	},
});

/**
 * Initialize and return syntax highlighting extension
 */
export async function getAlphaTexHighlight() {
	if (highlightExtension) return highlightExtension;

	const alphaTexTheme = HighlightStyle.define([
		{ tag: tags.comment, color: "#6a737d" },
		{ tag: tags.keyword, color: "#d73a49", fontWeight: "bold" },
		{ tag: tags.operator, color: "#d73a49" },
		{ tag: tags.string, color: "#032f62" },
		{ tag: tags.character, color: "#032f62" },
		{ tag: tags.number, color: "#005cc5" },
		{ tag: tags.function(tags.variableName), color: "#6f42c1" },
		{ tag: tags.tagName, color: "#22863a" },
		{ tag: tags.attributeName, color: "#6f42c1" },
		{ tag: tags.variableName, color: "#24292e" },
		{ tag: tags.bracket, color: "#24292e" },
	]);

	highlightExtension = [alphaTexParser, syntaxHighlighting(alphaTexTheme)];
	return highlightExtension;
}

/**
 * Get the TextMate grammar definition
 * Useful for external tools that need to parse AlphaTex
 */
export function getAlphaTexGrammar() {
	return textMateGrammar;
}
