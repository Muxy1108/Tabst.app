import { type Extension, RangeSetBuilder } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	EditorView,
	ViewPlugin,
	type ViewUpdate,
} from "@codemirror/view";

/**
 * A ViewPlugin that manages whitespace decorations for the visible viewport.
 * This is more performant for large documents than a StateField.
 */
const whitespacePlugin = ViewPlugin.fromClass(
	class {
		decorations: DecorationSet;

		constructor(view: EditorView) {
			this.decorations = this.buildDecorations(view);
		}

		update(update: ViewUpdate) {
			if (update.docChanged || update.viewportChanged) {
				this.decorations = this.buildDecorations(update.view);
			}
		}

		buildDecorations(view: EditorView): DecorationSet {
			const builder = new RangeSetBuilder<Decoration>();
			const spaceDeco = Decoration.mark({ class: "cm-whitespace-space" });

			for (const { from, to } of view.visibleRanges) {
				const text = view.state.doc.sliceString(from, to);
				for (let i = 0; i < text.length; i++) {
					if (text[i] === " ") {
						const pos = from + i;
						builder.add(pos, pos + 1, spaceDeco);
					}
				}
			}
			return builder.finish();
		}
	},
	{
		decorations: (v) => v.decorations,
	},
);

/**
 * Theme for the whitespace decoration
 */
const whitespaceTheme = EditorView.theme({
	".cm-whitespace-space": {
		position: "relative",
	},
	".cm-whitespace-space::before": {
		content: "'·'",
		position: "absolute",
		left: "0",
		right: "0",
		textAlign: "center",
		color: "hsl(var(--muted-foreground) / 0.6)",
		pointerEvents: "none",
		fontWeight: "bold",
	},
});

/**
 * Extension to show spaces as dots
 */
export function whitespaceDecoration(): Extension {
	return [whitespacePlugin, whitespaceTheme];
}
