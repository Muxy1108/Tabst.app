import type * as alphaTab from "@coderline/alphatab";

/**
 * 通过 URL 注入字体到 DOM
 * 适用于已经通过 ResourceLoaderService 生成的字体 URL
 */
export async function loadBravuraFont(fontUrl: string): Promise<boolean> {
	const fontName = "Bravura";
	try {
		const fontFace = new FontFace(fontName, `url(${fontUrl})`);
		await fontFace.load();
		document.fonts.add(fontFace);
		console.info(`[AssetLoader] Loaded Bravura font from: ${fontUrl}`);
		return true;
	} catch (err) {
		console.warn("[AssetLoader] Failed to load Bravura font:", err);
		return false;
	}
}

/**
 * 通过 URL 加载音频到 alphaTab
 * 适用于已经通过 ResourceLoaderService 生成的音频 URL
 */
export async function loadSoundFontFromUrl(
	api: alphaTab.AlphaTabApi | null,
	soundFontUrl: string,
): Promise<boolean> {
	if (!api) {
		console.warn("[AssetLoader] AlphaTab API not available");
		return false;
	}

	try {
		const response = await fetch(soundFontUrl);
		if (!response.ok) {
			console.warn(
				`[AssetLoader] Failed to fetch soundfont: ${response.status}`,
			);
			return false;
		}

		const buffer = await response.arrayBuffer();
		const u8 = new Uint8Array(buffer);
		api.loadSoundFont?.(u8, true);
		console.info(`[AssetLoader] Loaded soundfont from: ${soundFontUrl}`);
		return true;
	} catch (err) {
		console.warn("[AssetLoader] Failed to load soundfont:", err);
		return false;
	}
}
