import { create } from "zustand";

export interface FileItem {
	id: string;
	name: string;
	path: string;
	content: string;
}

interface AppState {
	// 文件列表
	files: FileItem[];
	// 当前选中的文件
	activeFileId: string | null;

	// Actions
	addFile: (file: FileItem) => void;
	removeFile: (id: string) => void;
	renameFile: (id: string, newName: string) => Promise<boolean>;
	setActiveFile: (id: string | null) => void;
	updateFileContent: (id: string, content: string) => void;
	getActiveFile: () => FileItem | undefined;

	// 初始化，从主进程读取持久化状态
	initialize: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
	files: [],
	activeFileId: null,

	addFile: (file) => {
		set((state) => {
			// 检查文件是否已存在
			const exists = state.files.some((f) => f.path === file.path);
			if (exists) {
				return {
					activeFileId: state.files.find((f) => f.path === file.path)?.id,
				};
			}
			const newState = {
				files: [...state.files, file],
				activeFileId: file.id,
			};
			// 持久化到主进程
			try {
				window.electronAPI?.saveAppState?.({
					files: newState.files.map((f) => ({
						id: f.id,
						name: f.name,
						path: f.path,
					})),
					activeFileId: newState.activeFileId,
				});
			} catch {}
			return newState;
		});
	},

	removeFile: (id) => {
		set((state) => {
			const newFiles = state.files.filter((f) => f.id !== id);
			const newActiveId =
				state.activeFileId === id
					? newFiles.length > 0
						? newFiles[0].id
						: null
					: state.activeFileId;
			const newState = { files: newFiles, activeFileId: newActiveId };
			try {
				window.electronAPI?.saveAppState?.({
					files: newFiles.map((f) => ({
						id: f.id,
						name: f.name,
						path: f.path,
					})),
					activeFileId: newActiveId,
				});
			} catch {}
			return newState;
		});
	},

	renameFile: async (id, newName) => {
		// find file first
		const state = get();
		const file = state.files.find((f) => f.id === id);
		if (!file) return false;

		// preserve original extension
		const idx = file.name.lastIndexOf(".");
		const oldExt = idx > 0 ? file.name.slice(idx) : "";
		// strip any extension from newName
		const newBaseIdx = newName.lastIndexOf(".");
		const newBase = newBaseIdx > 0 ? newName.slice(0, newBaseIdx) : newName;
		const finalName = `${newBase}${oldExt}`;

		try {
			const result = await window.electronAPI?.renameFile?.(
				file.path,
				finalName,
			);
			if (!result || !result.success) {
				console.error("renameFile failed:", result?.error);
				return false;
			}
			const newFiles = state.files.map((f) =>
				f.id === id
					? {
							...f,
							name: result.newName ?? finalName,
							path: result.newPath ?? f.path,
						}
					: f,
			);
			set({ files: newFiles });
			try {
				window.electronAPI?.saveAppState?.({
					files: newFiles.map((f) => ({
						id: f.id,
						name: f.name,
						path: f.path,
					})),
					activeFileId: state.activeFileId,
				});
			} catch {}
			return true;
		} catch (err) {
			console.error("renameFile error:", err);
			return false;
		}
	},

	setActiveFile: (id) => {
		set((state) => {
			const newState = { ...state, activeFileId: id };
			try {
				window.electronAPI?.saveAppState?.({
					files: newState.files.map((f) => ({
						id: f.id,
						name: f.name,
						path: f.path,
					})),
					activeFileId: newState.activeFileId,
				});
			} catch {}
			return { activeFileId: id };
		});
	},

	updateFileContent: (id, content) => {
		set((state) => ({
			files: state.files.map((f) => (f.id === id ? { ...f, content } : f)),
		}));
	},

	getActiveFile: () => {
		const state = get();
		return state.files.find((f) => f.id === state.activeFileId);
	},

	initialize: async () => {
		try {
			const result = await window.electronAPI.loadAppState();
			if (result?.files) {
				const restored = result.files.map((f) => ({
					id: f.id ?? crypto.randomUUID(),
					name: f.name,
					path: f.path,
					content: f.content ?? "",
				}));
				set({ files: restored, activeFileId: result.activeFileId });
			}
		} catch (err) {
			console.error("初始化应用状态失败:", err);
		}
	},
}));
