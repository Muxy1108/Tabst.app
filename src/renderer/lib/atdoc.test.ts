import { describe, expect, it } from "vitest";
import { parseAtDoc } from "./atdoc";

describe("parseAtDoc player volume directives", () => {
	it("parses at.player.volume as overall player volume", () => {
		const result = parseAtDoc(["at.player.volume=0.72", "1.1.1"].join("\n"));

		expect(result.config.player?.volume).toBe(0.72);
		expect(result.warnings).toEqual([]);
		expect(result.cleanContent).toBe("1.1.1");
	});

	it("warns when at.player.volume is outside [0, 1]", () => {
		const result = parseAtDoc(["at.player.volume=1.2", "1.1.1"].join("\n"));

		expect(result.config.player?.volume).toBeUndefined();
		expect(result.warnings).toEqual([
			{
				line: 1,
				message: "at.player.volume must be a number in [0, 1]",
			},
		]);
		expect(result.cleanContent).toBe("1.1.1");
	});
});

describe("parseAtDoc player track mix directives", () => {
	it("parses at.player.muteTracks and at.player.soloTracks", () => {
		const result = parseAtDoc(
			["at.player.muteTracks=0,2,2", "at.player.soloTracks=1", "1.1.1"].join(
				"\n",
			),
		);

		expect(result.config.player?.muteTracks).toEqual([0, 2]);
		expect(result.config.player?.soloTracks).toEqual([1]);
		expect(result.warnings).toEqual([]);
		expect(result.cleanContent).toBe("1.1.1");
	});

	it("warns when track index list contains invalid item", () => {
		const result = parseAtDoc(
			["at.player.muteTracks=1,a", "at.player.soloTracks=-1"].join("\n"),
		);

		expect(result.config.player?.muteTracks).toBeUndefined();
		expect(result.config.player?.soloTracks).toBeUndefined();
		expect(result.warnings).toEqual([
			{
				line: 1,
				message:
					"at.player.muteTracks must be a comma-separated list of non-negative integers",
			},
			{
				line: 2,
				message:
					"at.player.soloTracks must be a comma-separated list of non-negative integers",
			},
		]);
	});
});
