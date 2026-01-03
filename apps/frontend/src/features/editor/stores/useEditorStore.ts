import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
    CvData,
    DesignSettings,
    SectionType,
    TemplateType,
} from "../types/editor.types";


interface EditorState {
    cvData: CvData | null;
    aiDraft: CvData | null;
    sectionOrder: SectionType[];
    design: DesignSettings;
    template: TemplateType;
    isSidebarOpen: boolean;
    activeSection: SectionType | null;
}

interface EditorActions {
    setCvData: (data: CvData | null) => void;
    setAiDraft: (data: CvData | null) => void;
    updateCvField: (path: string, value: unknown) => void;
    reorderSections: (newOrder: SectionType[]) => void;
    applySuggestion: (
        section: keyof CvData,
        content: unknown,
        index?: number
    ) => void;


    setDesign: (design: Partial<DesignSettings>) => void;
    setTemplate: (template: TemplateType) => void;
    toggleSidebar: () => void;
    setActiveSection: (section: SectionType | null) => void;


    reset: () => void;
}


const defaultDesign: DesignSettings = {
    fontFamily: "font-sans",
    fontSize: "text-[0.9em]",
    accentColor: "#000000",
    lineHeight: "leading-relaxed",
    scale: 1,
    pageMargin: "p-1",
    sectionSpacing: "gap-1",
};

const defaultSectionOrder: SectionType[] = [
    "summary",
    "experience",
    "projects",
    "skills",
    "education",
];

const initialState: EditorState = {
    cvData: null,
    aiDraft: null,
    sectionOrder: defaultSectionOrder,
    design: defaultDesign,
    template: "modern",
    isSidebarOpen: true,
    activeSection: null,
};


export const useEditorStore = create<EditorState & EditorActions>()(
    immer((set, get) => ({
        ...initialState,


        setCvData: (data) =>
            set((state) => {
                state.cvData = data;
            }),

        setAiDraft: (data) =>
            set((state) => {
                state.aiDraft = data;
            }),


        updateCvField: (path, value) =>
            set((state) => {
                if (!state.cvData) return;

                const keys = path.replace(/\]/g, "").split(/[.[\]]/);
                let current: Record<string, unknown> = state.cvData as Record<string, unknown>;

                for (let i = 0; i < keys.length - 1; i++) {
                    const key = keys[i];
                    if (!current[key]) {
                        current[key] = {};
                    }
                    current = current[key] as Record<string, unknown>;
                }

                current[keys[keys.length - 1]] = value;
            }),


        reorderSections: (newOrder) =>
            set((state) => {
                state.sectionOrder = newOrder;
            }),


        applySuggestion: (section, content, index) =>
            set((state) => {
                if (!state.cvData) return;

                if (section === "hard_skills" || section === "soft_skills") {

                    const existing = state.cvData[section] as string[];
                    const newItems = content as string[];
                    state.cvData[section] = [...new Set([...existing, ...newItems])];
                } else if (index !== undefined && Array.isArray(state.cvData[section])) {

                    (state.cvData[section] as unknown[])[index] = content;
                } else {

                    (state.cvData as Record<string, unknown>)[section] = content;
                }
            }),


        setDesign: (newDesign) =>
            set((state) => {
                state.design = { ...state.design, ...newDesign };
            }),

        setTemplate: (template) =>
            set((state) => {
                state.template = template;
            }),


        toggleSidebar: () =>
            set((state) => {
                state.isSidebarOpen = !state.isSidebarOpen;
            }),

        setActiveSection: (section) =>
            set((state) => {
                state.activeSection = section;
            }),


        reset: () => set(initialState),
    }))
);



export const selectCvData = (state: EditorState & EditorActions) => state.cvData;
export const selectDesign = (state: EditorState & EditorActions) => state.design;
export const selectSectionOrder = (state: EditorState & EditorActions) =>
    state.sectionOrder;
