"use client";

import { useCv, SectionType } from "@/lib/cv-context";
import { Mail, Phone, MapPin, Linkedin, Globe, GripVertical, Trash2, Plus } from "lucide-react";
import { EditableField } from "./editable-field";
import { RibbonBar } from "./ribbon-bar";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";

export function CvEditor() {
  const { cvData, design, sectionOrder, setSectionOrder, updateCvField, printRef, template } = useCv();

  if (!cvData) return <div className="p-10 text-white text-center">Loading...</div>;

  const contact = cvData.contact_info || {};


  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newOrder = Array.from(sectionOrder);
    const [reorderedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, reorderedItem);
    setSectionOrder(newOrder);
  };

  const removeItem = (path: string, index: number) => {
    const arr = (cvData as any)[path] || [];
    updateCvField(path, arr.filter((_: any, i: number) => i !== index));
  };

  const addItem = (section: 'work_experience' | 'education' | 'projects') => {
      const templates: any = {
          work_experience: { title: "Job Title", company: "Company", dates: "2024", achievements: ["New achievement"] },
          projects: { name: "Project Name", description: "Description", highlights: ["Detail"] },
          education: { institution: "University", degree: "Degree", year: "2024" }
      };
      updateCvField(section, [templates[section], ...(cvData as any)[section] || []]);
  };

 
  const renderSection = (type: SectionType) => {
    const uiOnly = "print:hidden";

    const preventBreak = "print:break-inside-avoid"; 

    const keepWithNext = "print:break-after-avoid";

    switch (type) {
      case "summary":
        return cvData.professional_summary ? (
          
          <div className={`group relative pl-4 hover:border-l-4 hover:border-blue-200 transition-all rounded p-2 hover:bg-slate-50 border-l-4 border-transparent ${preventBreak}`}>
             <SectionHeader title="Professional Summary" design={design} className={keepWithNext} />
             <div className="text-justify">
                 <EditableField 
                    tagName="p" 
                    className={`text-slate-800 ${design.lineHeight}`} 
                    value={cvData.professional_summary} 
                    onSave={(val) => updateCvField('professional_summary', val)}
                 />
             </div>
          </div>
        ) : null;

      case "skills":
        return (cvData.hard_skills || []).length > 0 ? (
       
          <div className={`group relative pl-4 hover:border-l-4 hover:border-blue-200 transition-all rounded p-2 hover:bg-slate-50 border-l-4 border-transparent ${preventBreak}`}>
             <SectionHeader title="Technical Skills" design={design} className={keepWithNext} />
             <div className="flex flex-wrap gap-2 justify-start">
                {(cvData.hard_skills || []).map((skill, i) => (
                   <span key={i} className="bg-slate-100 px-2 py-1 rounded font-semibold text-slate-700 flex items-center gap-1 group/skill border border-slate-200 print:bg-transparent print:border-none print:p-0">
                      <EditableField tagName="span" value={skill} onSave={(val) => { const newSkills = [...(cvData.hard_skills || [])]; newSkills[i] = val; updateCvField('hard_skills', newSkills); }} />
                      <button onClick={() => removeItem('hard_skills', i)} className={`hidden group-hover/skill:block text-red-500 hover:bg-red-100 rounded-full p-0.5 ${uiOnly}`}><Trash2 size={10}/></button>
                   </span>
                ))}
                <button onClick={() => updateCvField('hard_skills', [...(cvData.hard_skills || []), "New"])} className={`bg-blue-50 text-blue-500 px-2 py-1 rounded hover:bg-blue-100 transition-opacity font-medium ${uiOnly}`}>+ Add</button>
             </div>
          </div>
        ) : null;

      case "experience":
        return (cvData.work_experience || []).length > 0 ? (

           <div className="group relative pl-4 hover:border-l-4 hover:border-blue-200 transition-all rounded p-2 hover:bg-slate-50 border-l-4 border-transparent">
              
              <div className={`flex justify-between items-center mb-2 border-b pb-1 ${keepWithNext}`} style={{ borderColor: design.accentColor }}>
                  <h2 className="text-[0.9em] font-bold uppercase tracking-widest" style={{ color: design.accentColor }}>Work Experience</h2>
                  <button onClick={() => addItem('work_experience')} className={`opacity-0 group-hover:opacity-100 text-blue-500 hover:bg-blue-100 rounded p-1 ${uiOnly}`}><Plus size={16}/></button>
              </div>
              
              <div className={cn("flex flex-col", design.sectionSpacing)}> 
                 {(cvData.work_experience || []).map((exp, i) => (
                    
                    <div key={i} className={`group/item relative ${preventBreak}`}>
                       <button onClick={() => removeItem('work_experience', i)} className={`absolute -right-6 top-0 opacity-0 group-hover/item:opacity-100 text-red-400 p-1 hover:bg-red-50 rounded transition-all ${uiOnly}`}><Trash2 size={14}/></button>
                       <div className="flex justify-between items-baseline">
                          <EditableField tagName="h3" className="font-bold text-[1.15em] text-slate-900 leading-tight" value={exp.title} onSave={(v) => updateCvField(`work_experience[${i}].title`, v)} />
                          <EditableField tagName="span" className="text-[0.9em] font-medium text-slate-500 whitespace-nowrap ml-4" value={exp.dates} onSave={(v) => updateCvField(`work_experience[${i}].dates`, v)} />
                       </div>
                       <EditableField tagName="div" className="font-semibold mb-1" style={{ color: design.accentColor }} value={exp.company} onSave={(v) => updateCvField(`work_experience[${i}].company`, v)} />
                       
                       <div className="flex flex-col gap-0.5">
                          {(exp.achievements || []).map((bullet, idx) => (
                             <div key={idx} className="flex items-start group/bullet relative">
                                <span className="mt-[0.6em] mr-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-800 print:bg-black" />
                                <div className={`flex-1 text-slate-700 text-justify`}>
                                    <EditableField tagName="span" value={bullet} className="inline"
                                        onSave={(v) => {
                                            const newAch = [...exp.achievements]; newAch[idx] = v;
                                            updateCvField(`work_experience[${i}].achievements`, newAch);
                                        }} 
                                    />
                                </div>
                                <button onClick={() => {
                                    const newAch = exp.achievements.filter((_, x) => x !== idx);
                                    updateCvField(`work_experience[${i}].achievements`, newAch);
                                }} className={`opacity-0 group-hover/bullet:opacity-100 text-red-300 hover:text-red-500 ml-2 ${uiOnly}`}><Trash2 size={12}/></button>
                             </div>
                          ))}
                          <button onClick={() => updateCvField(`work_experience[${i}].achievements`, [...exp.achievements, "New achievement"])} className={`text-blue-400 hover:underline opacity-0 group-hover/item:opacity-100 font-medium text-left ml-4 mt-1 ${uiOnly}`}>+ Add bullet</button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        ) : null;

  
      case "projects": return renderProjects(cvData, design, updateCvField, addItem, removeItem, uiOnly, preventBreak, keepWithNext);
      case "education": return renderEducation(cvData, design, updateCvField, addItem, removeItem, uiOnly, preventBreak, keepWithNext);
      default: return null;
    }
  };

  return (
    <div className="flex flex-col items-center pb-20 print:p-0 print:block">
        
        <div className="print:hidden w-full flex justify-center">
            <RibbonBar />
        </div>

        <div className="origin-top transition-transform duration-200 ease-out print:scale-100 print:m-0 print:shadow-none">
            
            <div 
                ref={printRef}
                className={cn(
                    "cv-paper bg-white shadow-2xl w-[794px] min-h-[1123px] text-slate-900 print:shadow-none print:w-full print:h-auto print:min-h-0",
                    design.fontFamily, 
                    design.pageMargin,
                    
                    design.fontSize,
                    design.lineHeight
                )}
                style={{ 
                    transform: `scale(${design.scale})`,
                    transformOrigin: 'top center'
                }}
            >
                <header className={`border-b-2 pb-4 mb-4 flex flex-col items-center text-center ${template === 'minimal' ? 'items-start text-left border-none' : ''}`} style={{ borderColor: design.accentColor }}>
                    <EditableField tagName="h1" className="text-[2.5em] font-bold uppercase tracking-wider mb-2 text-slate-900 leading-none" style={{ color: design.accentColor }} value={cvData.full_name || "Name"} onSave={(v) => updateCvField('full_name', v)} />
                    
                    <div className={`flex flex-wrap gap-x-4 gap-y-1 text-[0.9em] text-slate-600 ${template === 'minimal' ? 'justify-start' : 'justify-center'}`}>
                        {contact.email && <div className="flex items-center gap-1"><Mail size={14}/><EditableField tagName="span" value={contact.email} onSave={(v) => updateCvField('contact_info.email', v)}/></div>}
                        {contact.phone && <div className="flex items-center gap-1"><Phone size={14}/><EditableField tagName="span" value={contact.phone} onSave={(v) => updateCvField('contact_info.phone', v)}/></div>}
                        {contact.location && <div className="flex items-center gap-1"><MapPin size={14}/><EditableField tagName="span" value={contact.location} onSave={(v) => updateCvField('contact_info.location', v)}/></div>}
                        {contact.linkedin && <div className="flex items-center gap-1"><Linkedin size={14}/><EditableField tagName="span" value={contact.linkedin} onSave={(v) => updateCvField('contact_info.linkedin', v)}/></div>}
                        {contact.portfolio && <div className="flex items-center gap-1"><Globe size={14}/><EditableField tagName="span" value={contact.portfolio} onSave={(v) => updateCvField('contact_info.portfolio', v)}/></div>}
                    </div>
                </header>

                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="cv-sections">
                        {(provided) => (
                            <div 
                                {...provided.droppableProps} 
                                ref={provided.innerRef} 
                                className={cn("flex flex-col", design.sectionSpacing)}
                            >
                                {sectionOrder.map((sectionKey, index) => (
                                    <Draggable key={sectionKey} draggableId={sectionKey} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={cn(
                                                    "relative rounded-xl transition-all duration-200 group border-2 border-transparent",
                                                    snapshot.isDragging ? "bg-white shadow-2xl scale-105 z-50 ring-2 ring-blue-500 opacity-90" : "print:block",
                                                    "hover:border-slate-100 print:hover:border-transparent" 
                                                )}
                                            >
                                                <div 
                                                    {...provided.dragHandleProps} 
                                                    className="absolute -left-10 top-4 p-2 text-slate-300 hover:text-slate-600 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 rounded-md print:hidden"
                                                    title="Drag section"
                                                >
                                                    <GripVertical size={20}/>
                                                </div>
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
        </div>
    </div>
  );
}

function SectionHeader({ title, design, className }: any) {
    return (
        // FIX: Tambahkan className props untuk support keepWithNext
        <div className={cn("flex justify-between items-center mb-2 border-b pb-1", className)} style={{ borderColor: design.accentColor }}>
            <h2 className="text-[0.9em] font-bold uppercase tracking-widest" style={{ color: design.accentColor }}>{title}</h2>
        </div>
    )
}

function renderProjects(cvData: any, design: any, update: any, add: any, remove: any, uiOnly: string, preventBreak: string, keepWithNext: string) {
    return (cvData.projects || []).length > 0 ? (
        <div className="group relative pl-4 hover:border-l-4 hover:border-blue-200 transition-all rounded p-2 hover:bg-slate-50 border-l-4 border-transparent">
            {/* FIX: Tambahkan keepWithNext */}
            <div className={`flex justify-between items-center mb-2 border-b pb-1 ${keepWithNext}`} style={{ borderColor: design.accentColor }}>
                <h2 className="text-[0.9em] font-bold uppercase tracking-widest" style={{ color: design.accentColor }}>Projects</h2>
                <button onClick={() => add('projects')} className={`opacity-0 group-hover:opacity-100 text-blue-500 ${uiOnly}`}><Plus size={16}/></button>
            </div>
            
            <div className={cn("flex flex-col", design.sectionSpacing)}>
                {(cvData.projects || []).map((proj: any, i: number) => (
                    // FIX: Tambahkan preventBreak
                    <div key={i} className={`group/item relative ${preventBreak}`}>
                        <button onClick={() => remove('projects', i)} className={`absolute -right-6 top-0 opacity-0 group-hover/item:opacity-100 text-red-400 p-1 ${uiOnly}`}><Trash2 size={14}/></button>
                        <h3 className="font-bold text-slate-900 text-[1.15em] leading-tight"><EditableField value={proj.name} onSave={(v) => update(`projects[${i}].name`, v)}/></h3>
                        <div className="text-slate-600 mb-1"><EditableField tagName="p" value={proj.description} onSave={(v) => update(`projects[${i}].description`, v)}/></div>
                        <div className="flex flex-col gap-0.5">
                            {(proj.highlights || []).map((h: string, idx: number) => (
                                <div key={idx} className="flex items-start group/bullet relative">
                                    <span className="mt-[0.6em] mr-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-800 print:bg-black" />
                                    <div className="flex-1 text-slate-700 text-justify">
                                        <EditableField tagName="span" value={h} className="inline" onSave={(v) => { const nh = [...proj.highlights]; nh[idx] = v; update(`projects[${i}].highlights`, nh); }}/>
                                    </div>
                                    <button onClick={() => { const nh = proj.highlights.filter((_: any, x: number) => x !== idx); update(`projects[${i}].highlights`, nh); }} className={`opacity-0 group-hover/bullet:opacity-100 text-red-300 ml-2 ${uiOnly}`}><Trash2 size={12}/></button>
                                </div>
                            ))}
                            <button onClick={() => update(`projects[${i}].highlights`, [...proj.highlights, "New"])} className={`text-blue-400 hover:underline opacity-0 group-hover/item:opacity-100 text-left ml-4 mt-1 ${uiOnly}`}>+ Add highlight</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    ) : null;
}

function renderEducation(cvData: any, design: any, update: any, add: any, remove: any, uiOnly: string, preventBreak: string, keepWithNext: string) {
    return (cvData.education || []).length > 0 ? (
        <div className="group relative pl-4 hover:border-l-4 hover:border-blue-200 transition-all rounded p-2 hover:bg-slate-50 border-l-4 border-transparent">
             {/* FIX: Tambahkan keepWithNext */}
             <div className={`flex justify-between items-center mb-2 border-b pb-1 ${keepWithNext}`} style={{ borderColor: design.accentColor }}>
                <h2 className="text-[0.9em] font-bold uppercase tracking-widest" style={{ color: design.accentColor }}>Education</h2>
                <button onClick={() => add('education')} className={`opacity-0 group-hover:opacity-100 text-blue-500 ${uiOnly}`}><Plus size={16}/></button>
            </div>
            
            <div className={cn("flex flex-col", design.sectionSpacing)}>
                {(cvData.education || []).map((edu: any, i: number) => (
                    // FIX: Tambahkan preventBreak
                    <div key={i} className={`group/item relative ${preventBreak}`}>
                        <button onClick={() => remove('education', i)} className={`absolute -right-6 top-0 opacity-0 group-hover/item:opacity-100 text-red-400 p-1 ${uiOnly}`}><Trash2 size={14}/></button>
                        <div className="flex justify-between items-baseline">
                            <EditableField tagName="h3" className="font-bold text-slate-900 text-[1.15em] leading-tight" value={edu.institution} onSave={(v) => update(`education[${i}].institution`, v)}/>
                            <EditableField tagName="span" className="text-[0.9em] text-slate-500" value={edu.year} onSave={(v) => update(`education[${i}].year`, v)}/>
                        </div>
                        <EditableField tagName="div" className="text-slate-700" value={edu.degree} onSave={(v) => update(`education[${i}].degree`, v)}/>
                    </div>
                ))}
            </div>
        </div>
    ) : null;
}