import type * as alphaTab from "@coderline/alphatab";

export type TrackLike = Pick<alphaTab.model.Track, "index"> & {
	playbackInfo?: {
		isMute?: boolean;
		isSolo?: boolean;
	} | null;
};

export type TrackMuteState = Map<number, boolean>;
export type TrackPlaybackFlags = {
	isMute: boolean;
	isSolo: boolean;
};
export type TrackPlaybackState = Map<number, TrackPlaybackFlags>;

export function captureTrackMuteState(tracks: TrackLike[]): TrackMuteState {
	const state: TrackMuteState = new Map();
	for (const track of tracks) {
		state.set(track.index, track.playbackInfo?.isMute === true);
	}
	return state;
}

export function splitTracksByMuteState<TTrack extends Pick<TrackLike, "index">>(
	tracks: TTrack[],
	muteState: TrackMuteState | null | undefined,
): {
	mutedTracks: TTrack[];
	unmutedTracks: TTrack[];
} {
	const mutedTracks: TTrack[] = [];
	const unmutedTracks: TTrack[] = [];
	for (const track of tracks) {
		const wasMuted = muteState?.get(track.index) ?? false;
		if (wasMuted) {
			mutedTracks.push(track);
		} else {
			unmutedTracks.push(track);
		}
	}
	return { mutedTracks, unmutedTracks };
}

export function captureTrackPlaybackFlags(
	tracks: TrackLike[],
): TrackPlaybackState {
	const state: TrackPlaybackState = new Map();
	for (const track of tracks) {
		state.set(track.index, {
			isMute: track.playbackInfo?.isMute === true,
			isSolo: track.playbackInfo?.isSolo === true,
		});
	}
	return state;
}

export function applyPlaybackFlagsToTrackConfigs<
	TConfig extends {
		index: number;
		isMuted: boolean;
		isSolo: boolean;
	},
>(configs: TConfig[], playbackState: TrackPlaybackState): TConfig[] {
	return configs.map((cfg) => {
		const state = playbackState.get(cfg.index);
		if (!state) return cfg;
		return {
			...cfg,
			isMuted: state.isMute,
			isSolo: state.isSolo,
		};
	});
}
