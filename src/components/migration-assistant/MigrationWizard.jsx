import React, { useState, useEffect } from 'react';
import Card from '@/components/ui-custom/Card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Download, RotateCcw, Save, CheckCircle } from 'lucide-react';
import StepProjectIntake from './StepProjectIntake.jsx';
import StepHostingTarget from './StepHostingTarget.jsx';
import StepHostPresets from './StepHostPresets.jsx';
import StepHealthSystem from './StepHealthSystem.jsx';
import StepEdgeWorker from './StepEdgeWorker.jsx';
import StepAppConfig from './StepAppConfig.jsx';
import StepOutputs from './StepOutputs.jsx';
import { ProfileRepo } from '@/components/migration-assistant/lib/repository';

const STEPS = ['Project Intake', 'Hosting Target', 'Host Presets', 'Health System', 'Edge Worker', 'App Config', 'Generated Outputs'];

const EMPTY_PROFILE = {
  project_name: '',
  framework: '',
  hosting_target: '',
  provision_method: '',
  build_output_path: '',
  base_url_assumption: '/',
  route_type: 'spa',
  app_name: '',
  base44_app_id: '',
  base44_api_base_url: '',
  frontend_domain: '',
  cors_origins: '',
  auth_enabled: true,
  stripe_used: false,
  custom_domain: '',
  label: '',
};

export default function MigrationWizard({ onReset, projectId, existingProfileId }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [savedProfileId, setSavedProfileId] = useState(existingProfileId || null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'saved' | 'error' | null

  // Load existing profile if editing
  useEffect(() => {
    if (existingProfileId) {
      ProfileRepo.get(existingProfileId).then(p => {
        if (p) setProfile(prev => ({ ...prev, ...p }));
      });
    }
  }, [existingProfileId]);

  const updateProfile = (fields) => setProfile(prev => ({ ...prev, ...fields }));

  const canProceed = () => {
    if (step === 0) return !!profile.project_name && !!profile.framework && !!profile.hosting_target && !!profile.provision_method;
    if (step === 1) return !!profile.hosting_target;
    if (step === 2) return true; // Host Presets — informational, always can proceed
    if (step === 3) return true; // Health System — always can proceed
    if (step === 4) return true; // Edge Worker — always can proceed
    if (step === 5) return !!profile.app_name && !!profile.base44_api_base_url && !!profile.frontend_domain;
    return true;
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const draftData = {
        ...profile,
        project_id: projectId || 'local',
        label: profile.project_name || profile.app_name || 'Draft',
        app_name: profile.app_name || profile.project_name || 'App',
        base44_api_base_url: profile.base44_api_base_url || '',
        frontend_domain: profile.frontend_domain || '',
      };
      if (savedProfileId) {
        await ProfileRepo.update(savedProfileId, draftData);
      } else {
        const created = await ProfileRepo.create(draftData);
        if (created?.id) setSavedProfileId(created.id);
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }
    setSaving(false);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `migration-profile-${profile.project_name || profile.app_name || 'app'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-center gap-2 mb-12">
        {STEPS.map((label, i) => (
          <React.Fragment key={i}>
            <div className={`flex items-center gap-2 ${i <= step ? 'text-[#73e28a]' : 'text-slate-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                i < step ? 'bg-[#73e28a] border-[#73e28a] text-black' :
                i === step ? 'border-[#73e28a] text-[#73e28a]' :
                'border-slate-600 text-slate-500'
              }`}>{i + 1}</div>
              <span className="text-sm font-medium hidden sm:block">{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px max-w-16 ${i < step ? 'bg-[#73e28a]' : 'bg-slate-700'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <Card className="p-8 bg-slate-900/80 border-slate-700">
        {step === 0 && <StepProjectIntake profile={profile} onChange={updateProfile} />}
        {step === 1 && <StepHostingTarget profile={profile} onChange={updateProfile} />}
        {step === 2 && <StepHostPresets profile={profile} onChange={updateProfile} />}
        {step === 3 && <StepHealthSystem profile={profile} onChange={updateProfile} />}
        {step === 4 && <StepEdgeWorker profile={profile} onChange={updateProfile} />}
        {step === 5 && <StepAppConfig profile={profile} onChange={updateProfile} />}
        {step === 6 && <StepOutputs profile={profile} />}
      </Card>

      <div className="flex items-center justify-between mt-6">
        <div>
          {step === 0 ? (
            onReset && (
              <Button variant="outline" onClick={onReset} className="border-slate-700 text-slate-400 hover:text-white">
                <RotateCcw className="w-4 h-4 mr-2" /> Start Over
              </Button>
            )
          ) : (
            <Button variant="outline" onClick={() => setStep(s => s - 1)} className="border-slate-700 text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Save draft button — visible on step 0 */}
          {step === 0 && projectId && (
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={saving}
              className="border-slate-700 text-slate-300 hover:text-white gap-2"
            >
              {saving ? (
                'Saving…'
              ) : saveStatus === 'saved' ? (
                <><CheckCircle className="w-4 h-4 text-[#73e28a]" /> Saved</>
              ) : saveStatus === 'error' ? (
                'Save failed'
              ) : (
                <><Save className="w-4 h-4" /> Save Draft</>
              )}
            </Button>
          )}

          {step === 5 && (
            <Button variant="outline" onClick={handleExportJSON} className="border-[#73e28a] text-[#73e28a] hover:bg-[#73e28a]/10">
              <Download className="w-4 h-4 mr-2" /> Export Profile JSON
            </Button>
          )}
          {step < 5 && (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold disabled:opacity-40"
            >
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}