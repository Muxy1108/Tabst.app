import { describe, expect, it } from "vitest";
import {
	isWebsiteMobileLayout,
	isWebsiteMobilePreviewStack,
	shouldUseWebsiteMobileTransportOnly,
	WEBSITE_MOBILE_BREAKPOINT,
} from "./website-layout";

describe("website mobile layout", () => {
	it("enables mobile layout for web runtime under breakpoint", () => {
		expect(
			isWebsiteMobileLayout({
				isWebRuntime: true,
				viewportWidth: WEBSITE_MOBILE_BREAKPOINT - 1,
			}),
		).toBe(true);
	});

	it("disables mobile layout at or above breakpoint", () => {
		expect(
			isWebsiteMobileLayout({
				isWebRuntime: true,
				viewportWidth: WEBSITE_MOBILE_BREAKPOINT,
			}),
		).toBe(false);
	});

	it("disables mobile layout when not running on website", () => {
		expect(
			isWebsiteMobileLayout({
				isWebRuntime: false,
				viewportWidth: 390,
			}),
		).toBe(false);
	});
});

describe("website mobile preview stack", () => {
	it("stacks preview only when website mobile layout is enabled and not enjoy mode", () => {
		expect(
			isWebsiteMobilePreviewStack({
				isWebRuntime: true,
				viewportWidth: 390,
				enjoyMode: false,
			}),
		).toBe(true);

		expect(
			isWebsiteMobilePreviewStack({
				isWebRuntime: true,
				viewportWidth: 390,
				enjoyMode: true,
			}),
		).toBe(false);
	});
});

describe("website mobile bottom bar transport", () => {
	it("shows only transport controls in editor when running on website mobile", () => {
		expect(
			shouldUseWebsiteMobileTransportOnly({
				isWebRuntime: true,
				viewportWidth: 390,
				workspaceMode: "editor",
				activeSettingsPageId: null,
				isAtexFile: true,
			}),
		).toBe(true);
	});

	it("shows only transport controls on playback settings page in website mobile", () => {
		expect(
			shouldUseWebsiteMobileTransportOnly({
				isWebRuntime: true,
				viewportWidth: 390,
				workspaceMode: "settings",
				activeSettingsPageId: "playback",
				isAtexFile: false,
			}),
		).toBe(true);
	});

	it("does not enable transport-only mode outside website mobile", () => {
		expect(
			shouldUseWebsiteMobileTransportOnly({
				isWebRuntime: false,
				viewportWidth: 390,
				workspaceMode: "editor",
				activeSettingsPageId: null,
				isAtexFile: true,
			}),
		).toBe(false);

		expect(
			shouldUseWebsiteMobileTransportOnly({
				isWebRuntime: true,
				viewportWidth: WEBSITE_MOBILE_BREAKPOINT,
				workspaceMode: "editor",
				activeSettingsPageId: null,
				isAtexFile: true,
			}),
		).toBe(false);
	});
});
