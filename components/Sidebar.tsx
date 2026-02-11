import React, { useState } from 'react';
import { PosterConfig, Tab } from '../types';
import { IconText, IconImage, IconMagic, IconPalette, IconDownload, IconCode } from './Icons';
import { generatePosterContent, generatePosterImage } from '../services/geminiService';

interface SidebarProps {
  config: PosterConfig;
  setConfig: React.Dispatch<React.SetStateAction<PosterConfig>>;
  onDownload: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ config, setConfig, onDownload }) => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.AI);
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const handleTextChange = (field: keyof PosterConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateContent = async () => {
    if (!topic) return;
    setIsGenerating(true);
    try {
      const result = await generatePosterContent(topic);
      setConfig(prev => ({
        ...prev,
        headline: result.headline,
        subHeadline: result.subHeadline,
      }));
      handleGenerateImage(result.imagePrompt);
    } catch (e) {
      alert("فشل في توليد المحتوى. تحقق من مفتاح API.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async (promptOverride?: string) => {
    const promptToUse = promptOverride || topic;
    if (!promptToUse) return;
    
    setIsGeneratingImage(true);
    try {
        const fullPrompt = `A high quality 3d render, minimal icon style, white background, ${promptToUse}, holding money or charts, financial theme`;
        const base64 = await generatePosterImage(fullPrompt);
        setConfig(prev => ({ ...prev, generatedImageBase64: base64, imageUrl: null }));
    } catch (e) {
         alert("فشل في توليد الصورة.");
    } finally {
        setIsGeneratingImage(false);
    }
  }

  const handleAddSnippet = (css: string) => {
    setConfig(prev => ({
        ...prev,
        customCSS: prev.customCSS ? prev.customCSS + '\n' + css : css
    }));
  };

  const themes = [
    { name: 'المستثمر', accent: '#2dd4bf', secondary: '#0f172a' }, // Cyan / Dark Slate
    { name: 'فخامة', accent: '#d4af37', secondary: '#000000' }, // Gold / Black
    { name: 'الثقة', accent: '#38bdf8', secondary: '#0c4a6e' }, // Sky / Dark Blue
    { name: 'النمو', accent: '#84cc16', secondary: '#064e3b' }, // Lime / Dark Green
    { name: 'الرؤية', accent: '#a78bfa', secondary: '#4c1d95' }, // Violet / Dark Purple
    { name: 'الطاقة', accent: '#f43f5e', secondary: '#881337' }, // Rose / Dark Red
    { name: 'حداثة', accent: '#fb923c', secondary: '#1e293b' }, // Orange / Slate
    { name: 'رسمي', accent: '#94a3b8', secondary: '#020617' }, // Gray / Very Dark Slate
  ];

  const cssSnippets = [
    { label: 'ذهبي فاخر', css: `.poster-headline {\n  background: linear-gradient(to bottom, #cfc09f 22%, #634f2c 24%, #cfc09f 26%, #cfc09f 27%, #ffecb3 40%, #3a2c0f 78%); \n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  color: #fff;\n  font-weight: 900;\n}` },
    { label: 'عنوان مفرغ', css: `.poster-headline {\n  -webkit-text-stroke: 1px white;\n  color: transparent !important;\n}` },
    { label: 'حاوية زجاجية', css: `.poster-body {\n  background: rgba(255,255,255,0.05);\n  backdrop-filter: blur(10px);\n  border-radius: 20px;\n  padding: 30px;\n  border: 1px solid rgba(255,255,255,0.1);\n}` },
    { label: 'بدون نقش', css: `.poster-bg {\n  display: none;\n}` },
    { label: 'صورة دائرية', css: `.poster-image {\n  border-radius: 50%;\n  aspect-ratio: 1;\n  object-fit: cover;\n  border: 4px solid rgba(255,255,255,0.2);\n}` },
    { label: 'تدرج ريترو', css: `.poster-root {\n  background: linear-gradient(135deg, #240b36, #c31432) !important;\n}` }
  ];

  return (
    <div className="w-[360px] bg-slate-900 border-l border-slate-700 flex flex-col h-full shrink-0 z-20 shadow-2xl font-sans">
      {/* Navigation Tabs */}
      <div className="flex bg-slate-800 p-2 gap-1 border-b border-slate-700">
        <TabButton active={activeTab === Tab.AI} onClick={() => setActiveTab(Tab.AI)} icon={<IconMagic />} label="الذكاء" />
        <TabButton active={activeTab === Tab.TEXT} onClick={() => setActiveTab(Tab.TEXT)} icon={<IconText />} label="النصوص" />
        <TabButton active={activeTab === Tab.STYLE} onClick={() => setActiveTab(Tab.STYLE)} icon={<IconPalette />} label="التصميم" />
        <TabButton active={activeTab === Tab.CSS} onClick={() => setActiveTab(Tab.CSS)} icon={<IconCode />} label="تخصيص" />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        
        {activeTab === Tab.AI && (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
             <div className="space-y-3">
                <label className="text-xs font-bold text-teal-400 uppercase tracking-wider">المساعد الذكي</label>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">أدخل موضوعاً مالياً أو اقتصادياً وسيقوم الذكاء الاصطناعي بصياغة المحتوى وتصميم البوستر.</p>
                <textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="مثال: الاستثمار في الذهب، العملات الرقمية، التضخم..."
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none h-32 resize-none placeholder-slate-500 text-right dir-rtl"
                />
             </div>
             <button 
                onClick={handleGenerateContent}
                disabled={isGenerating || !topic}
                className={`w-full py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${isGenerating ? 'bg-slate-700 text-slate-400' : 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-slate-900 hover:shadow-teal-500/20'}`}
             >
                {isGenerating ? (
                    <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        جاري التوليد...
                    </>
                ) : (
                    <>
                        <IconMagic /> توليد التصميم
                    </>
                )}
             </button>
             <div className="h-px bg-slate-700/50 my-6"></div>
             <div className="space-y-3">
                <label className="text-xs font-bold text-teal-400 uppercase tracking-wider">الصورة فقط</label>
                <button 
                onClick={() => handleGenerateImage(topic)}
                disabled={isGeneratingImage || !topic}
                className="w-full py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors flex justify-center items-center gap-2"
                >
                    {isGeneratingImage ? 'جاري رسم الصورة...' : 'إعادة توليد الصورة'}
                    <IconImage />
                </button>
             </div>
          </div>
        )}

        {activeTab === Tab.TEXT && (
          <div className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-300">
             <InputGroup label="العنوان الرئيسي (كبير)" value={config.headline} onChange={(v) => handleTextChange('headline', v)} />
             <InputGroup label="العنوان الفرعي (ملون)" value={config.subHeadline} onChange={(v) => handleTextChange('subHeadline', v)} />
             <div className="h-px bg-slate-700/50"></div>
             <InputGroup label="النص العلوي (يمين)" value={config.topLeftText} onChange={(v) => handleTextChange('topLeftText', v)} />
             <InputGroup label="النص العلوي (يسار)" value={config.topRightText} onChange={(v) => handleTextChange('topRightText', v)} />
             <InputGroup label="رابط الموقع" value={config.website} onChange={(v) => handleTextChange('website', v)} />
          </div>
        )}

        {activeTab === Tab.STYLE && (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
            <div>
                <label className="block text-xs font-bold text-gray-400 mb-3 uppercase">ثيمات الألوان (Themes)</label>
                <div className="grid grid-cols-2 gap-3">
                    {themes.map(theme => (
                        <button
                            key={theme.name}
                            onClick={() => {
                                setConfig(prev => ({ ...prev, accentColor: theme.accent, secondaryColor: theme.secondary }));
                            }}
                            className={`flex items-center justify-between p-3 rounded-xl bg-slate-800 border transition-all hover:bg-slate-750 hover:shadow-md group ${config.accentColor === theme.accent ? 'border-teal-500 ring-1 ring-teal-500/20' : 'border-slate-700 hover:border-slate-600'}`}
                        >
                            <span className="text-sm font-bold text-gray-300 group-hover:text-white">{theme.name}</span>
                            <div className="w-6 h-6 rounded-full border border-slate-600 shadow-sm" style={{ background: `linear-gradient(90deg, ${theme.accent} 50%, ${theme.secondary} 50%)` }}></div>
                        </button>
                    ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-800">
                    <label className="block text-[10px] font-bold text-gray-500 mb-2">تخصيص دقيق</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1 h-8 rounded-lg overflow-hidden border border-slate-700 hover:border-teal-500 cursor-pointer">
                             <input type="color" value={config.accentColor} onChange={(e) => handleTextChange('accentColor', e.target.value)} className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer" />
                        </div>
                        <div className="relative flex-1 h-8 rounded-lg overflow-hidden border border-slate-700 hover:border-teal-500 cursor-pointer">
                             <input type="color" value={config.secondaryColor} onChange={(e) => handleTextChange('secondaryColor', e.target.value)} className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Logo Upload */}
            <div>
                <label className="block text-xs font-bold text-gray-400 mb-3 uppercase">شعار الشركة (Logo)</label>
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-700 border-dashed rounded-xl cursor-pointer bg-slate-800/50 hover:bg-slate-800 hover:border-teal-500 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-3 pb-4 text-slate-500 group-hover:text-teal-400 transition-colors">
                        <IconImage />
                        <p className="mb-1 text-[10px] mt-1">اضغط لرفع الشعار</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setConfig(prev => ({ ...prev, logoUrl: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                        }
                    }} />
                </label>
                {config.logoUrl && (
                    <button 
                        onClick={() => setConfig(prev => ({ ...prev, logoUrl: null }))}
                        className="text-[10px] text-red-400 mt-2 hover:text-red-300 w-full text-right underline"
                    >
                        حذف الشعار
                    </button>
                )}
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-400 mb-3 uppercase">رفع صورة يدوياً</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-xl cursor-pointer bg-slate-800/50 hover:bg-slate-800 hover:border-teal-500 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500 group-hover:text-teal-400 transition-colors">
                        <IconImage />
                        <p className="mb-2 text-sm mt-2">اضغط لرفع صورة</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setConfig(prev => ({ ...prev, imageUrl: reader.result as string, generatedImageBase64: null }));
                            };
                            reader.readAsDataURL(file);
                        }
                    }} />
                </label>
            </div>
          </div>
        )}

        {activeTab === Tab.CSS && (
          <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
             <div className="space-y-3">
                <label className="text-xs font-bold text-teal-400 uppercase tracking-wider">قوالب جاهزة (Snippets)</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                    {cssSnippets.map((snippet) => (
                        <button
                            key={snippet.label}
                            onClick={() => handleAddSnippet(snippet.css)}
                            className="px-3 py-2 bg-slate-800 border border-slate-700 hover:border-teal-500 hover:bg-slate-700 rounded-lg text-[11px] text-gray-300 transition-colors text-right"
                        >
                            + {snippet.label}
                        </button>
                    ))}
                </div>

                <label className="text-xs font-bold text-teal-400 uppercase tracking-wider mt-6 block">محرر CSS المتقدم</label>
                <p className="text-[10px] text-slate-400 mb-2 font-mono" dir="ltr">
                Classes: <span className="text-teal-500">.poster-root</span>, <span className="text-teal-500">.poster-headline</span>...
                </p>
                <textarea 
                    value={config.customCSS}
                    onChange={(e) => handleTextChange('customCSS', e.target.value)}
                    placeholder="اكتب كود CSS هنا لتخصيص التصميم..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs font-mono text-green-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none h-64 resize-none placeholder-slate-700 text-left dir-ltr"
                    spellCheck={false}
                    dir="ltr"
                />
             </div>
             <button 
                onClick={() => handleTextChange('customCSS', '')}
                className="w-full py-2 bg-slate-800 border border-slate-700 rounded-md text-[10px] text-gray-500 hover:text-red-400 hover:border-red-900 transition-colors"
             >
                إعادة تعيين CSS
             </button>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-700 bg-slate-900/90 backdrop-blur">
        <button 
            onClick={onDownload}
            className="w-full py-3.5 bg-white text-slate-900 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-lg"
        >
            <IconDownload /> تحميل البوستر
        </button>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode, label: string }) => (
    <button 
        onClick={onClick}
        className={`flex-1 py-3 rounded-lg flex flex-col items-center justify-center gap-1 text-[10px] font-bold tracking-wide transition-all ${active ? 'bg-slate-700 text-teal-400 shadow-inner' : 'text-gray-500 hover:text-gray-300 hover:bg-slate-800/50'}`}
    >
        {React.cloneElement(icon as React.ReactElement, { width: 20, height: 20 })}
        {label}
    </button>
);

const InputGroup = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
    <div className="group">
        <label className="block text-xs font-bold text-gray-500 mb-1.5 group-focus-within:text-teal-400 transition-colors">{label}</label>
        <input 
            type="text" 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-right"
        />
    </div>
);

export default Sidebar;