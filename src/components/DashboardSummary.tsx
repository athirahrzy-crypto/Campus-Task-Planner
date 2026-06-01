/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Calendar, CheckCircle2, CircleDot, Clock } from 'lucide-react';
import { Task, TaskStatus } from '../types';

interface DashboardSummaryProps {
  tasks: Task[];
}

export function DashboardSummary({ tasks }: DashboardSummaryProps) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const inProgress = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
  const remaining = tasks.filter(t => t.status !== TaskStatus.COMPLETED).length;

  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    {
      label: '전체 일정',
      value: total,
      icon: Calendar,
      colorClass: 'text-brand-primary bg-surface-soft border-hairline',
    },
    {
      label: '완료',
      value: completed,
      icon: CheckCircle2,
      colorClass: 'text-badge-emerald bg-[rgba(52,211,153,0.1)] border-[rgba(52,211,153,0.2)]',
    },
    {
      label: '진행 중',
      value: inProgress,
      icon: Clock,
      colorClass: 'text-brand-accent bg-[rgba(59,130,246,0.1)] border-[rgba(59,130,246,0.2)]',
    },
    {
      label: '남은 일정',
      value: remaining,
      icon: CircleDot,
      colorClass: 'text-badge-orange bg-[rgba(251,146,60,0.1)] border-[rgba(251,146,60,0.2)]',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 4 Cards Grid */}
      <div id="stats-grid" className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              id={`stat-card-${i}`}
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#f5f5f5] border border-[#e5e7eb] p-5 rounded-xl transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-1">{stat.label}</span>
                <div className={`p-1.5 rounded-full ${stat.label === '진행 중' ? 'text-[#3b82f6]' : 'text-brand-primary'}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline">
                <span className={`cal-sans-heading text-3xl font-bold tracking-tight ${stat.label === '진행 중' ? 'text-[#3b82f6]' : 'text-[#111111]'}`}>
                  {stat.value}
                </span>
                <span className="text-xs text-muted ml-1">개</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Bar Container */}
      <motion.div
        id="completion-progress-container"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-canvas p-6 rounded-xl border border-[#e5e7eb]"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-brand-primary flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] inline-block"></span>
              전체 진행률
            </h3>
            <p className="text-xs text-muted mt-0.5">
              조회 중인 필터 조건과 별개로, 전체 할 일의 누적 진행 성과를 보여줍니다.
            </p>
          </div>
          <div className="flex items-baseline gap-1 md:text-right">
            <span className="text-xs text-muted font-medium">완료율</span>
            <span id="progress-text" className="cal-sans-heading text-2xl font-bold text-brand-primary">{percent}%</span>
          </div>
        </div>

        {/* The bar track */}
        <div className="relative w-full h-3 bg-[#f5f5f5] rounded-full overflow-hidden">
          <motion.div
            id="progress-bar"
            className="absolute left-0 top-0 h-full bg-[#111111]"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        <div className="flex justify-between items-center mt-3 text-xs text-muted">
          <span>0% 시작</span>
          <span className="font-semibold text-[#111111]">
            {completed} / {total} 완료됨
          </span>
          <span>100% 달성</span>
        </div>
      </motion.div>
    </div>
  );
}
