import React, { useState } from 'react';
import { useAlertSystem } from '../../context/AlertSystemContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import {
  Sparkles,
  Play,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Zap,
  ArrowRight
} from 'lucide-react';

interface ScenarioRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScenarioRunnerModal: React.FC<ScenarioRunnerModalProps> = ({
  isOpen,
  onClose
}) => {
  const { runScenario } = useAlertSystem();
  const [runningIndex, setRunningIndex] = useState<number | null>(null);
  const [lastOutcome, setLastOutcome] = useState<{
    scenarioNum: number;
    success: boolean;
    message: string;
    details?: string;
  } | null>(null);

  const scenarios = [
    {
      number: 1,
      title: 'Student Marked Absent',
      desc: 'Explicitly records student Aarav Kumar as Absent for today. Generates an absence alert job with SMS & WhatsApp templates for parent Rajesh Kumar.',
      tag: 'Absence Rule'
    },
    {
      number: 2,
      title: 'Student Arrives Late',
      desc: 'Simulates gate arrival at 09:22 AM (exceeding 09:00 + 10m threshold). Generates a late-arrival alert job with arrival timestamp token.',
      tag: 'Late Rule'
    },
    {
      number: 3,
      title: 'Student Present (No Alert Generated)',
      desc: 'Records on-time arrival at 08:25 AM. Verifies system correctly generates zero alerts for present students.',
      tag: 'Negative Case'
    },
    {
      number: 4,
      title: 'Parent With Invalid / Missing Contact',
      desc: 'Student Keerthana R has an incomplete phone number. Evaluates alert generation and verifies mock providers flag validation failure.',
      tag: 'Data Validation'
    },
    {
      number: 5,
      title: 'Independent Channel: SMS Succeeds, WhatsApp Fails',
      desc: 'Demonstrates decoupled providers. SMS simulation delivers successfully while WhatsApp fails independently (opt-out / network error).',
      tag: 'Provider Independence'
    },
    {
      number: 6,
      title: 'Dual-Channel Failure Simulation',
      desc: 'Simulates simultaneous gateway timeouts on both SMS and WhatsApp. Transitions status to Failed with audit error logs.',
      tag: 'Fault Tolerance'
    },
    {
      number: 7,
      title: 'Duplicate CSV Import Protection',
      desc: 'Simulates importing the same attendance CSV twice. Idempotency engine accepts records on first pass, safely skips on second pass without creating duplicate alerts.',
      tag: 'Idempotency'
    },
    {
      number: 8,
      title: 'Administrator Retries Failed Alert',
      desc: 'Finds a failed notification job in queue and triggers targeted channel retry. Provider re-attempts simulated delivery and transitions state.',
      tag: 'Manual Recovery'
    }
  ];

  const handleRun = async (num: number) => {
    setRunningIndex(num);
    try {
      const outcome = await runScenario(num);
      setLastOutcome({
        scenarioNum: num,
        ...outcome
      });
    } finally {
      setRunningIndex(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="xl"
      title={
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-2xs">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Sandbox Scenario Simulator</h3>
            <p className="text-[11px] text-slate-500 font-normal">
              Execute and demonstrate the 8 required client attendance &amp; alert test scenarios
            </p>
          </div>
        </div>
      }
      footer={
        <div className="w-full flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">All results are simulated locally in the browser sandbox</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors"
          >
            Close Simulator
          </button>
        </div>
      }
    >
      <div className="space-y-3.5 text-xs">
        {/* Execution Feedback Banner */}
        {lastOutcome && (
          <div
            className={`p-3 rounded-xl border animate-in fade-in space-y-1 ${
              lastOutcome.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{lastOutcome.message}</span>
            </div>
            {lastOutcome.details && (
              <p className="text-[11px] text-slate-700 leading-relaxed pl-5 font-mono">
                {lastOutcome.details}
              </p>
            )}
          </div>
        )}

        {/* 8 Scenarios List */}
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
          {scenarios.map((sc) => {
            const isRunning = runningIndex === sc.number;
            return (
              <div
                key={sc.number}
                className="p-3 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {sc.number}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 font-bold text-xs">{sc.title}</strong>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold border border-slate-200">
                        {sc.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{sc.desc}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRun(sc.number)}
                  disabled={isRunning}
                  className="shrink-0 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold text-xs transition-colors shadow-2xs flex items-center gap-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{isRunning ? 'Running...' : 'Run'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
