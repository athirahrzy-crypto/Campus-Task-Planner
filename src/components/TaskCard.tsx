/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Calendar, Trash2, ArrowRight } from 'lucide-react';
import { Task, TaskCategory, TaskPriority, TaskStatus } from '../types';

interface TaskCardProps {
  key?: string;
  task: Task;
  onStatusChange: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  // Category colors according to the specification
  const getCategoryStyles = (category: TaskCategory) => {
    switch (category) {
      case TaskCategory.ASSIGNMENT:
        return 'bg-[rgba(236,72,153,0.1)] text-badge-pink border-[rgba(236,72,153,0.2)]';
      case TaskCategory.PRESENTATION:
        return 'bg-[rgba(251,146,60,0.1)] text-badge-orange border-[rgba(251,146,60,0.2)]';
      case TaskCategory.EXAM:
        return 'bg-[rgba(139,92,246,0.1)] text-badge-violet border-[rgba(139,92,246,0.2)]';
      case TaskCategory.TEAM_PROJECT:
        return 'bg-[rgba(52,211,153,0.1)] text-badge-emerald border-[rgba(52,211,153,0.2)]';
      default:
        return 'bg-surface-card text-muted border-hairline';
    }
  };

  const getPriorityBadgeColors = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'text-[#ef4444] bg-[#ef4444]/5 border-[#ef4444]/15 font-bold';
      case TaskPriority.MEDIUM:
        return 'text-[#f59e0b] bg-[#f59e0b]/5 border-[#f59e0b]/15 font-bold';
      case TaskPriority.LOW:
        return 'text-[#3b82f6] bg-[#3b82f6]/5 border-[#3b82f6]/15 font-bold';
      default:
        return 'text-muted bg-surface-soft border-hairline';
    }
  };

  const getStatusButtonStyles = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.BEFORE_START:
        return {
          bg: 'bg-[#f5f5f5] text-[#374151] border-[#e5e7eb]',
          dot: 'bg-[#898989]',
        };
      case TaskStatus.IN_PROGRESS:
        return {
          bg: 'bg-[#3b82f6] text-white border-transparent font-medium',
          dot: 'bg-white',
        };
      case TaskStatus.COMPLETED:
        return {
          bg: 'bg-[#10b981] text-white border-transparent font-bold',
          dot: 'bg-white',
        };
      default:
        return {
          bg: 'bg-[#f5f5f5] text-[#374151] border-[#e5e7eb]',
          dot: 'bg-[#898989]',
        };
    }
  };

  const statusStyles = getStatusButtonStyles(task.status);

  return (
    <motion.div
      id={`task-card-item-${task.id}`}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`relative flex flex-col justify-between bg-canvas border rounded-xl p-5 transition-all duration-200 
        ${task.status === TaskStatus.COMPLETED ? 'border-hairline shadow-none opacity-85' : 'border-[#e5e7eb] shadow-sm hover:shadow-md'}`}
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryStyles(task.category)}`}>
            {task.category}
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${getPriorityBadgeColors(task.priority)}`}>
              우선순위: {task.priority}
            </span>
          </div>
        </div>

        {/* Title */}
        <h4 className={`text-base font-semibold text-brand-primary leading-tight mb-2 tracking-tight ${task.status === TaskStatus.COMPLETED ? 'line-through text-muted' : ''}`}>
          {task.title}
        </h4>

        {/* Short Memo */}
        {task.memo && (
          <p className="text-xs text-body leading-relaxed mb-4 bg-surface-soft/60 p-2.5 rounded border border-hairline-soft italic font-normal">
            {task.memo}
          </p>
        )}
      </div>

      <div>
        {/* Due Date Row */}
        <div className="flex items-center gap-1.5 text-muted mb-4">
          <Calendar className="w-3.5 h-3.5 text-muted-soft" />
          <span className="text-xs font-medium">마감: {task.dueDate}</span>
        </div>

        {/* Footer Interaction Action Buttons */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-hairline-soft">
          <button
            id={`task-status-btn-${task.id}`}
            onClick={() => onStatusChange(task.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs leading-none transition-colors duration-150 ${statusStyles.bg}`}
            title="상태를 변경하려면 클릭하세요 (시작 전 → 진행 중 → 완료)"
          >
            <span className={`w-2 h-2 rounded-full ${statusStyles.dot}`} />
            <span>{task.status}</span>
            <ArrowRight className="w-3 h-3 opacity-60 ml-0.5" />
          </button>

          <button
            id={`task-delete-btn-${task.id}`}
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-muted-soft hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all duration-150 border border-transparent hover:border-rose-100"
            title="일정 삭제"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
