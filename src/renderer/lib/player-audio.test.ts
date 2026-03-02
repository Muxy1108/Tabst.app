import { describe, expect, it } from "vitest";
import {
	applyPlaybackFlagsToTrackConfigs,
	captureTrackMuteState,
	captureTrackPlaybackFlags,
	splitTracksByMuteState,
	type TrackLike,
} from "./player-audio";

describe("captureTrackMuteState", () => {
	it("captures current mute state per track index", () => {
		const tracks = [
			{ index: 0, playbackInfo: { isMute: true } },
			{ index: 1, playbackInfo: { isMute: false } },
			{ index: 2, playbackInfo: {} },
		] as unknown as TrackLike[];

		const snapshot = captureTrackMuteState(tracks);

		expect(snapshot.get(0)).toBe(true);
		expect(snapshot.get(1)).toBe(false);
		expect(snapshot.get(2)).toBe(false);
	});
});

describe("splitTracksByMuteState", () => {
	it("splits tracks into muted and unmuted groups using snapshot", () => {
		const tracks = [{ index: 0 }, { index: 1 }, { index: 2 }] as TrackLike[];
		const snapshot = new Map<number, boolean>([
			[0, true],
			[1, false],
		]);

		const grouped = splitTracksByMuteState(tracks, snapshot);

		expect(grouped.mutedTracks.map((t) => t.index)).toEqual([0]);
		expect(grouped.unmutedTracks.map((t) => t.index)).toEqual([1, 2]);
	});
});

describe("captureTrackPlaybackFlags", () => {
	it("captures mute and solo flags by track index", () => {
		const tracks = [
			{ index: 0, playbackInfo: { isMute: true, isSolo: false } },
			{ index: 1, playbackInfo: { isMute: false, isSolo: true } },
			{ index: 2, playbackInfo: {} },
		] as unknown as TrackLike[];

		const state = captureTrackPlaybackFlags(tracks);

		expect(state.get(0)).toEqual({ isMute: true, isSolo: false });
		expect(state.get(1)).toEqual({ isMute: false, isSolo: true });
		expect(state.get(2)).toEqual({ isMute: false, isSolo: false });
	});
});

describe("applyPlaybackFlagsToTrackConfigs", () => {
	it("syncs track config mute and solo flags from playback state", () => {
		const configs = [
			{ index: 0, isMuted: false, isSolo: false, name: "A" },
			{ index: 1, isMuted: false, isSolo: false, name: "B" },
		];
		const playbackFlags = new Map([
			[0, { isMute: true, isSolo: false }],
			[1, { isMute: false, isSolo: true }],
		]);

		const next = applyPlaybackFlagsToTrackConfigs(configs, playbackFlags);

		expect(next).toEqual([
			{ index: 0, isMuted: true, isSolo: false, name: "A" },
			{ index: 1, isMuted: false, isSolo: true, name: "B" },
		]);
	});
});
