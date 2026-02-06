"use client";

import { RefObject, useMemo } from "react";
import { useEditorStore } from "../stores/useEditorStore";
import type { SectionType, CvData } from "../types/editor.types";
import { Mail, Phone, MapPin, Linkedin, Globe, GripVertical, Trash2, Plus } from "lucide-react";
import { EditableField } from "./EditableField";
import { ReadOnlyField } from "./ReadOnlyField";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface CvEditorProps {
  printRef: RefObject<HTMLDivElement | null>;
  highlightSection?: string | null;
  isPreviewMode?: boolean;
}

export function CvEditor({ printRef, highlightSection, isPreviewMode = false }: CvEditorProps) {
  const cvData = useEditorStore((s) => s.cvData);
  const design = useEditorStore((s) => s.design);
  const sectionOrder = useEditorStore((s) => s.sectionOrder);
  const reorderSections = useEditorStore((s) => s.reorderSections);
  const updateCvField = useEditorStore((s) => s.updateCvField);
  const template = useEditorStore((s) => s.template);

  if (!cvData) return <div className="p-10 text-white text-center">Loading...</div>;

  const contact = cvData.contact_info || {};

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newOrder = Array.from(sectionOrder);
    const [reorderedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, reorderedItem);
    reorderSections(newOrder);
  };

  const removeItem = (path: string, index: number) => {
    const arr = (cvData as unknown as Record<string, unknown[]>)[path] || [];
    updateCvField(path, arr.filter((_: unknown, i: number) => i !== index));
  };

  const addItem = (section: "work_experience" | "education" | "projects") => {
    const templates: Record<string, unknown> = {
      work_experience: { title: "Job Title", company: "Company", dates: "2024", achievements: ["New achievement"] },
      projects: { name: "Project Name", description: "Description", highlights: ["Detail"] },
      education: { institution: "University", degree: "Degree", year: "2024" },
    };
    updateCvField(section, [templates[section], ...((cvData as unknown as Record<string, unknown[]>)[section] || [])]);
  };

  // Field component memoized to prevent re-creation on render
  const Field = useMemo(() => {
    return ({ value, onSave, className, tagName = "div" as const, style }: {
      value: string;
      onSave: (val: string) => void;
      className?: string;
      tagName?: "h1" | "h2" | "h3" | "p" | "span" | "div";
      style?: React.CSSProperties;
    }) => {
      if (isPreviewMode) {
        return <ReadOnlyField value={value} className={className} tagName={tagName} style={style} />;
      }
      return <EditableField value={value} onSave={onSave} className={className} tagName={tagName} style={style} />;
    };
  }, [isPreviewMode]);

  const getLabel = (key: keyof NonNullable<typeof cvData.section_labels>, defaultVal: string) =>
    cvData.section_labels?.[key] || defaultVal;
  const setLabel = (key: keyof NonNullable<typeof cvData.section_labels>, val: string) =>
    updateCvField(`section_labels.${key}`, val);

  const renderSection = (type: SectionType) => {
    const uiOnly = "print:hidden";
    const preventBreak = "print:break-inside-avoid";
    const keepWithNext = "print:break-after-avoid";

    // Map section types to highlight keys
    const highlightMap: Record<SectionType, string[]> = {
      summary: ["professional_summary"],
      skills: ["hard_skills"],
      experience: ["work_experience"],
      projects: ["projects"],
      education: ["education"],
    };

    const isHighlighted = highlightSection && highlightMap[type]?.includes(highlightSection);
    const highlightClass = isHighlighted
      ? "ring-2 ring-[#2F6BFF] ring-offset-2 bg-[#2F6BFF]/10 transition-all duration-500"
      : "";

    switch (type) {
      case "summary":
        return cvData.professional_summary ? (
          <div className={cn(`group relative pl-4 hover:border-l-4 hover:border-blue-200 transition-all rounded p-2 hover:bg-slate-50 border-l-4 border-transparent print:pl-0 print:border-l-0 ${preventBreak}`, highlightClass)}>
            <SectionHeader
              title={getLabel("summary", "Professional Summary")}
              onSave={(v) => setLabel("summary", v)}
              design={design}
              Field={Field}
              className={keepWithNext}
            />
            <div className="text-justify">
              <Field tagName="p" className={`text-slate-800 ${design.lineHeight}`} value={cvData.professional_summary} onSave={(val) => updateCvField("professional_summary", val)} />
            </div>
          </div>
        ) : null;

      case "skills":
        return (cvData.hard_skills || []).length > 0 ? (
          <div className={cn(`group relative pl-4 hover:border-l-4 hover:border-blue-200 transition-all rounded p-2 hover:bg-slate-50 border-l-4 border-transparent print:pl-0 print:border-l-0 ${preventBreak}`, highlightClass)}>
            <SectionHeader
              title={getLabel("technical_skills", "Technical Skills")}
              onSave={(v) => setLabel("technical_skills", v)}
              design={design}
              Field={Field}
              className={keepWithNext}
            />
            <div className="flex flex-wrap gap-2 justify-start">
              {(cvData.hard_skills || []).map((skill, i) => (
                <span key={i} className="bg-slate-100 px-2 py-1 rounded font-semibold text-slate-700 flex items-center gap-1 group/skill border border-slate-200 print:bg-transparent print:border-none print:p-0">
                  <Field tagName="span" value={skill} onSave={(val) => { const newSkills = [...(cvData.hard_skills || [])]; newSkills[i] = val; updateCvField("hard_skills", newSkills); }} />
                  {!isPreviewMode && <button onClick={() => removeItem("hard_skills", i)} className={`hidden group-hover/skill:block text-red-500 hover:bg-red-100 rounded-full p-0.5 ${uiOnly}`}><Trash2 size={10} /></button>}
                </span>
              ))}
              {!isPreviewMode && <button onClick={() => updateCvField("hard_skills", [...(cvData.hard_skills || []), "New"])} className={`bg-blue-50 text-blue-500 px-2 py-1 rounded hover:bg-blue-100 transition-opacity font-medium ${uiOnly}`}>+ Add</button>}
            </div>
          </div>
        ) : null;

      case "experience":
        return (cvData.work_experience || []).length > 0 ? (
          <div className={cn("group relative pl-4 hover:border-l-4 hover:border-blue-200 transition-all rounded p-2 hover:bg-slate-50 border-l-4 border-transparent print:pl-0 print:border-l-0", highlightClass)}>
            <SectionHeader
              title={getLabel("work_experience", "Work Experience")}
              onSave={(v) => setLabel("work_experience", v)}
              design={design}
              Field={Field}
              className={keepWithNext}
            >
              {!isPreviewMode && <button onClick={() => addItem("work_experience")} className={`opacity-0 group-hover:opacity-100 text-blue-500 hover:bg-blue-100 rounded p-1 ${uiOnly}`}><Plus size={16} /></button>}
            </SectionHeader>
            <div className={cn("flex flex-col", design.sectionSpacing)}>
              {(cvData.work_experience || []).map((exp, i) => (
                <div key={i} className={`group/item relative ${preventBreak}`}>
                  {!isPreviewMode && <button onClick={() => removeItem("work_experience", i)} className={`absolute -right-6 top-0 opacity-0 group-hover/item:opacity-100 text-red-400 p-1 hover:bg-red-50 rounded transition-all ${uiOnly}`}><Trash2 size={14} /></button>}
                  <div className="flex justify-between items-baseline">
                    <Field tagName="h3" className="font-bold text-[1.15em] text-slate-900 leading-tight" value={exp.title} onSave={(v: string) => updateCvField(`work_experience[${i}].title`, v)} />
                    <Field tagName="span" className="text-[0.9em] font-medium text-slate-500 whitespace-nowrap ml-4" value={exp.dates} onSave={(v: string) => updateCvField(`work_experience[${i}].dates`, v)} />
                  </div>
                  <Field tagName="div" className="font-semibold mb-1" style={{ color: design.accentColor }} value={exp.company} onSave={(v: string) => updateCvField(`work_experience[${i}].company`, v)} />
                  <ul className="cv-bullet-list space-y-0.5">
                    {(exp.achievements || []).map((bullet, idx) => (
                      <li key={idx} className="group/bullet text-slate-700">
                        <Field tagName="span" value={bullet} className="inline" onSave={(v: string) => { const newAch = [...exp.achievements]; newAch[idx] = v; updateCvField(`work_experience[${i}].achievements`, newAch); }} />
                        {!isPreviewMode && <button onClick={() => { const newAch = exp.achievements.filter((_, x) => x !== idx); updateCvField(`work_experience[${i}].achievements`, newAch); }} className={`opacity-0 group-hover/bullet:opacity-100 text-red-300 hover:text-red-500 ml-2 ${uiOnly}`}><Trash2 size={12} /></button>}
                      </li>
                    ))}
                  </ul>
                  {!isPreviewMode && <button onClick={() => updateCvField(`work_experience[${i}].achievements`, [...exp.achievements, "New achievement"])} className={`text-blue-400 hover:underline opacity-0 group-hover/item:opacity-100 font-medium text-left ml-5 mt-1 ${uiOnly}`}>+ Add bullet</button>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "projects":
        return renderProjects(
          cvData, design, updateCvField, addItem, removeItem, uiOnly, preventBreak, keepWithNext, Field,
          getLabel("projects", "Projects"), (v) => setLabel("projects", v)
        );
      case "education":
        return renderEducation(
          cvData, design, updateCvField, addItem, removeItem, uiOnly, preventBreak, keepWithNext, Field,
          getLabel("education", "Education"), (v) => setLabel("education", v)
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={printRef}
      className={cn("bg-white text-slate-900 w-full h-full", design.fontFamily, design.pageMargin, design.fontSize, design.lineHeight)}
    >
      <header className={`border-b-2 pb-4 mb-4 flex flex-col items-center text-center ${template === "minimal" ? "items-start text-left border-none" : ""}`} style={{ borderColor: design.accentColor }}>
        <Field tagName="h1" className="text-[2.5em] font-bold uppercase tracking-wider mb-2 leading-none" style={{ color: design.accentColor || '#000000' }} value={cvData.full_name || "Name"} onSave={(v) => updateCvField("full_name", v)} />
        <div className={`flex flex-wrap gap-x-4 gap-y-2 text-[0.9em] text-slate-600 ${template === "minimal" ? "justify-start" : "justify-center"}`}>
          {contact.email && <div className="flex gap-1" style={{ lineHeight: '20px', minHeight: '20px', alignItems: 'flex-end' }}><Mail size={14} className="shrink-0" style={{ marginBottom: '1px' }} /><Field tagName="span" value={contact.email} onSave={(v) => updateCvField("contact_info.email", v)} /></div>}
          {contact.phone && <div className="flex gap-1" style={{ lineHeight: '20px', minHeight: '20px', alignItems: 'flex-end' }}><Phone size={14} className="shrink-0" style={{ marginBottom: '3px' }} /><Field tagName="span" value={contact.phone} onSave={(v) => updateCvField("contact_info.phone", v)} /></div>}
          {contact.location && <div className="flex gap-1" style={{ lineHeight: '20px', minHeight: '20px', alignItems: 'flex-end' }}><MapPin size={14} className="shrink-0" style={{ marginBottom: '3px' }} /><Field tagName="span" value={contact.location} onSave={(v) => updateCvField("contact_info.location", v)} /></div>}
          {contact.linkedin && <div className="flex gap-1" style={{ lineHeight: '20px', minHeight: '20px', alignItems: 'flex-end' }}><Linkedin size={14} className="shrink-0" style={{ marginBottom: '3px' }} /><Field tagName="span" value={contact.linkedin} onSave={(v) => updateCvField("contact_info.linkedin", v)} /></div>}
          {contact.portfolio && <div className="flex gap-1" style={{ lineHeight: '20px', minHeight: '20px', alignItems: 'flex-end' }}><Globe size={14} className="shrink-0" style={{ marginBottom: '3px' }} /><Field tagName="span" value={contact.portfolio} onSave={(v) => updateCvField("contact_info.portfolio", v)} /></div>}
        </div>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="cv-sections">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className={cn("flex flex-col", design.sectionSpacing)}>
              {sectionOrder.map((sectionKey, index) => (
                <Draggable key={sectionKey} draggableId={sectionKey} index={index} isDragDisabled={isPreviewMode}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} className={cn("relative rounded-xl transition-all duration-200 group border-2 border-transparent", snapshot.isDragging ? "bg-white shadow-2xl scale-105 z-50 ring-2 ring-blue-500 opacity-90" : "print:block", !isPreviewMode && "hover:border-slate-100", "print:hover:border-transparent")}>
                      {!isPreviewMode && <div {...provided.dragHandleProps} className="absolute -left-10 top-4 p-2 text-slate-300 hover:text-slate-600 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 rounded-md print:hidden" title="Drag section"><GripVertical size={20} /></div>}
                      {renderSection(sectionKey)}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}


function SectionHeader({ title, onSave, design, className, Field, children }: {
  title: string;
  onSave: (val: string) => void;
  design: { accentColor: string };
  className?: string;
  Field: (props: {
    value: string;
    onSave: (val: string) => void;
    className?: string;
    tagName?: "h1" | "h2" | "h3" | "p" | "span" | "div";
    style?: React.CSSProperties;
  }) => React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("flex justify-between items-center mb-2 border-b pb-1", className)} style={{ borderColor: design.accentColor }}>
      <Field
        tagName="h2"
        className="text-[0.9em] font-bold uppercase tracking-widest"
        style={{ color: design.accentColor }}
        value={title}
        onSave={onSave}
      />
      {children}
    </div>
  );
}

function renderProjects(
  cvData: CvData,
  design: { accentColor: string; sectionSpacing: string },
  update: (path: string, value: unknown) => void,
  add: (section: "projects") => void,
  remove: (path: string, idx: number) => void,
  uiOnly: string,
  preventBreak: string,
  keepWithNext: string,
  Field: (props: {
    value: string;
    onSave: (val: string) => void;
    className?: string;
    tagName?: "h1" | "h2" | "h3" | "p" | "span" | "div";
    style?: React.CSSProperties;
  }) => React.ReactNode,
  label: string,
  onLabelSave: (v: string) => void
) {
  return (cvData.projects || []).length > 0 ? (
    <div className="group relative pl-4 hover:border-l-4 hover:border-blue-200 transition-all rounded p-2 hover:bg-slate-50 border-l-4 border-transparent print:pl-0 print:border-l-0">
      <SectionHeader
        title={label}
        onSave={onLabelSave}
        design={design}
        Field={Field}
        className={keepWithNext}
      >
        <button onClick={() => add("projects")} className={`opacity-0 group-hover:opacity-100 text-blue-500 ${uiOnly}`}><Plus size={16} /></button>
      </SectionHeader>
      <div className={cn("flex flex-col", design.sectionSpacing)}>
        {(cvData.projects || []).map((proj, i) => (
          <div key={i} className={`group/item relative ${preventBreak}`}>
            <button onClick={() => remove("projects", i)} className={`absolute -right-6 top-0 opacity-0 group-hover/item:opacity-100 text-red-400 p-1 ${uiOnly}`}><Trash2 size={14} /></button>
            <h3 className="font-bold text-slate-900 text-[1.15em] leading-tight"><Field value={proj.name} onSave={(v: string) => update(`projects[${i}].name`, v)} /></h3>
            <div className="text-slate-600 mb-1"><Field tagName="p" value={proj.description} onSave={(v: string) => update(`projects[${i}].description`, v)} /></div>
            <ul className="cv-bullet-list space-y-0.5">
              {(proj.highlights || []).map((h, idx) => (
                <li key={idx} className="group/bullet text-slate-700 relative">
                  <Field tagName="span" value={h} className="inline" onSave={(v: string) => { const nh = [...proj.highlights]; nh[idx] = v; update(`projects[${i}].highlights`, nh); }} />
                  <button onClick={() => { const nh = proj.highlights.filter((_, x) => x !== idx); update(`projects[${i}].highlights`, nh); }} className={`opacity-0 group-hover/bullet:opacity-100 text-red-300 ml-2 ${uiOnly}`}><Trash2 size={12} /></button>
                </li>
              ))}
              <button onClick={() => update(`projects[${i}].highlights`, [...proj.highlights, "New"])} className={`text-blue-400 hover:underline opacity-0 group-hover/item:opacity-100 text-left ml-5 mt-1 ${uiOnly}`}>+ Add highlight</button>
            </ul>
          </div>
        ))}
      </div>
    </div>
  ) : null;
}

function renderEducation(
  cvData: CvData,
  design: { accentColor: string; sectionSpacing: string },
  update: (path: string, value: unknown) => void,
  add: (section: "education") => void,
  remove: (path: string, idx: number) => void,
  uiOnly: string,
  preventBreak: string,
  keepWithNext: string,
  Field: (props: {
    value: string;
    onSave: (val: string) => void;
    className?: string;
    tagName?: "h1" | "h2" | "h3" | "p" | "span" | "div";
    style?: React.CSSProperties;
  }) => React.ReactNode,
  label: string,
  onLabelSave: (v: string) => void
) {
  return (cvData.education || []).length > 0 ? (
    <div className="group relative pl-4 hover:border-l-4 hover:border-blue-200 transition-all rounded p-2 hover:bg-slate-50 border-l-4 border-transparent print:pl-0 print:border-l-0">
      <SectionHeader
        title={label}
        onSave={onLabelSave}
        design={design}
        Field={Field}
        className={keepWithNext}
      >
        <button onClick={() => add("education")} className={`opacity-0 group-hover:opacity-100 text-blue-500 ${uiOnly}`}><Plus size={16} /></button>
      </SectionHeader>
      <div className={cn("flex flex-col", design.sectionSpacing)}>
        {(cvData.education || []).map((edu, i) => (
          <div key={i} className={`group/item relative ${preventBreak}`}>
            <button onClick={() => remove("education", i)} className={`absolute -right-6 top-0 opacity-0 group-hover/item:opacity-100 text-red-400 p-1 ${uiOnly}`}><Trash2 size={14} /></button>
            <div className="flex justify-between items-baseline">
              <Field tagName="h3" className="font-bold text-slate-900 text-[1.15em] leading-tight" value={edu.institution} onSave={(v: string) => update(`education[${i}].institution`, v)} />
              <Field tagName="span" className="text-[0.9em] text-slate-500" value={edu.year} onSave={(v: string) => update(`education[${i}].year`, v)} />
            </div>
            <Field tagName="div" className="text-slate-700" value={edu.degree} onSave={(v: string) => update(`education[${i}].degree`, v)} />
          </div>
        ))}
      </div>
    </div>
  ) : null;
}