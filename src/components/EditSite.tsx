import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { TemplateSection } from '../types';
import { ArrowRight, Save, Eye, Check, Copy } from 'lucide-react';

const EditSite: React.FC = () => {
  const { editingSite, updateSite, setCurrentPage, setViewingSiteSlug } = useApp();

  const [siteName, setSiteName] = useState('');
  const [siteSlug, setSiteSlug] = useState('');
  const [description, setDescription] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [secondaryColor, setSecondaryColor] = useState('#8b5cf6');
  const [accentColor, setAccentColor] = useState('#f43f5e');
  const [fontFamily, setFontFamily] = useState('Cairo');
  const [sections, setSections] = useState<TemplateSection[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (editingSite) {
      setSiteName(editingSite.siteName);
      setSiteSlug(editingSite.siteSlug);
      setDescription(editingSite.description);
      setPrimaryColor(editingSite.primaryColor);
      setSecondaryColor(editingSite.secondaryColor);
      setAccentColor(editingSite.accentColor || '#f43f5e');
      setFontFamily(editingSite.fontFamily);
      setSections(editingSite.sections.map(s => ({ ...s })));
      setIsPublished(editingSite.isPublished);
    }
  }, [editingSite]);

  if (!editingSite) return null;

  const handleSectionUpdate = (index: number, field: keyof TemplateSection, value: any) => {
    setSections(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const handleSave = () => {
    const slug = siteSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    updateSite({ ...editingSite, siteName, siteSlug: slug, description, primaryColor, secondaryColor, accentColor, fontFamily, sections, isPublished });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePreview = () => {
    handleSave();
    setViewingSiteSlug(editingSite.siteSlug);
    setCurrentPage('view-site');
  };

  const { getSiteUrl } = useApp();
  const copyLink = () => {
    const link = getSiteUrl(siteSlug);
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="nav">
        <div className="nav-inner">
          <div className="flex items-center gap-6">
            <span className="logo" dir="ltr">Naqra</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">تعديل: {editingSite.siteName}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handlePreview} className="btn btn-secondary btn-sm"><Eye size={14} /> معاينة</button>
            <button onClick={handleSave} className={`btn btn-sm ${saved ? 'bg-green-500 text-white' : 'btn-primary'}`}>
              {saved ? <><Check size={14} /> تم الحفظ</> : <><Save size={14} /> حفظ</>}
            </button>
            <button onClick={() => setCurrentPage('dashboard')} className="btn btn-ghost btn-sm"><ArrowRight size={16} /></button>
          </div>
        </div>
      </nav>

      <div className="container py-8 max-w-3xl">
        {/* Site Link */}
        <div className="card p-4 mb-6 flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">رابط موقعك:</span>
            <p className="font-mono text-indigo-600 text-sm break-all" dir="ltr">{getSiteUrl(siteSlug)}</p>
          </div>
          <button onClick={copyLink} className="btn btn-secondary btn-sm">
            {copied ? <><Check size={14} /> تم النسخ</> : <><Copy size={14} /> نسخ</>}
          </button>
        </div>

        <div className="card p-8 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">المعلومات الأساسية</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">اسم الموقع</label>
              <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="input" />
            </div>
            <div className="form-group">
              <label className="form-label">الرابط</label>
              <input type="text" value={siteSlug} onChange={(e) => setSiteSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} className="input" dir="ltr" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">الوصف</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input" style={{ minHeight: '80px', resize: 'none' }} />
          </div>
        </div>

        <div className="card p-8 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">التصميم</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="form-group">
              <label className="form-label text-sm">اللون الأساسي</label>
              <div className="flex items-center gap-2">
                <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label text-sm">اللون الثانوي</label>
              <div className="flex items-center gap-2">
                <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label text-sm">لون التمييز</label>
              <div className="flex items-center gap-2">
                <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200" />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">الخط</label>
            <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="input">
              <option value="Cairo">Cairo</option>
              <option value="Tajawal">Tajawal</option>
              <option value="Almarai">Almarai</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl mt-6 border border-green-200">
            <div>
              <h4 className="font-semibold text-green-800">حالة النشر</h4>
              <p className="text-sm text-green-600">{isPublished ? 'الموقع منشور ومتاح للزوار' : 'الموقع محفوظ كمسودة'}</p>
            </div>
            <div className={`toggle ${isPublished ? 'active' : ''}`} onClick={() => setIsPublished(!isPublished)} />
          </div>
        </div>

        <div className="card p-8 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">أقسام الموقع</h3>
          <div className="space-y-4">
            {sections.map((section, index) => (
              <div key={section.id} className="p-5 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-800">{section.title || section.type}</span>
                  <div className={`toggle ${section.enabled ? 'active' : ''}`} onClick={() => handleSectionUpdate(index, 'enabled', !section.enabled)} />
                </div>
                {section.enabled && (
                  <div className="space-y-3">
                    <input type="text" value={section.title} onChange={(e) => handleSectionUpdate(index, 'title', e.target.value)} className="input" placeholder="العنوان" />
                    <textarea value={section.content} onChange={(e) => handleSectionUpdate(index, 'content', e.target.value)} className="input" style={{ minHeight: '70px', resize: 'none' }} placeholder="المحتوى" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">إجراءات سريعة</h3>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => { setCurrentPage('site-settings'); }} className="btn btn-secondary">
              ⚙️ إعدادات الموقع
            </button>
            <button onClick={() => { setCurrentPage('site-settings'); }} className="btn btn-secondary">
              📦 إدارة المنتجات
            </button>
            <button onClick={() => { setCurrentPage('site-settings'); }} className="btn btn-secondary">
              🏷️ أكواد الخصم
            </button>
            <button onClick={() => { setCurrentPage('analytics'); }} className="btn btn-secondary">
              📊 التحليلات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSite;
