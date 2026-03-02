import React, { useState } from 'react';
import Card from '@/components/ui-custom/Card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Download, RotateCcw } from 'lucide-react';
import StepHostingTarget from './StepHostingTarget.jsx';
import StepAppConfig from './StepAppConfig.jsx';
import StepOutputs from './StepOutputs.jsx';

const STEPS = ['Hosting Target', 'App Config', 'Generated Outputs'];

export default function MigrationWizard({ onReset }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    hosting_target: '',
    app_name: '',
    base44_app_id: '',
    base44_api_base_url: '',
    frontend_domain: '',
    cors_origins: '',
    auth_enabled: true,
    stripe_used: false,
    custom_domain: '',
  });

  const updateProfile = (fields) => setProfile(prev => ({ ...prev, ...fields }));

  const canProceed = () => {
    if (step === 0) return !!profile.hosting_target;
    if (step === 1) return !!profile.app_name && !!profile.base44_api_base_url && !!profile.frontend_domain;
    return true;
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `migration-profile-${profile.app_name || 'app'}.json`;
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
        {step === 0 && <StepHostingTarget profile={profile} onChange={updateProfile} />}
        {step === 1 && <StepAppConfig profile={profile} onChange={updateProfile} />}
        {step === 2 && <StepOutputs profile={profile} />}
      </Card>

      <div className="flex items-center justify-between mt-6">
        <div>
          {step === 0 ? (
            <Button variant="outline" onClick={onReset} className="border-slate-700 text-slate-400 hover:text-white">
              <RotateCcw className="w-4 h-4 mr-2" /> Start Over
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setStep(s => s - 1)} className="border-slate-700 text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          {step === 2 && (
            <Button variant="outline" onClick={handleExportJSON} className="border-[#73e28a] text-[#73e28a] hover:bg-[#73e28a]/10">
              <Download className="w-4 h-4 mr-2" /> Export Profile JSON
            </Button>
          )}
          {step < 2 && (
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