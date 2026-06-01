/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, ListPlus } from 'lucide-react';
import { TaskCategory, TaskPriority, TaskStatus, Task } from '../types';

interface NewTaskFormProps {
  onAddTask: (task: Omit<Task, 'id'>) => void;
}

export function NewTaskForm({ onAddTask }: NewTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.ASSIGNMENT);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [dueDate, setDueDate] = useState('');
  const [memo, setMemo] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Custom Validation
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) {
      newErrors.title = '일정 제목을 입력해주세요.';
    }
    if (!dueDate.trim()) {
      newErrors.dueDate = '마감 시간을 입력해주세요 (예: 금요일 오후 6:00).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit
    onAddTask({
      title: title.trim(),
      category,
      dueDate: dueDate.trim(),
      priority,
      status: TaskStatus.BEFORE_START,
      memo: memo.trim(),
    });

    // Clear and collapse
    setTitle('');
    setCategory(TaskCategory.ASSIGNMENT);
    setPriority(TaskPriority.MEDIUM);
    setDueDate('');
    setMemo('');
    setErrors({});
    setIsOpen(false);
  };

  return (
    <div id="new-task-container" className="mb-6">
      {!isOpen ? (
        <motion.button
          id="btn-open-add-task"
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-primary-active text-on-primary py-3 px-4 rounded-md text-sm font-semibold transition-all duration-150 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>새로운 일정 추가하기</span>
        </motion.button>
      ) : (
        <AnimatePresence>
          <motion.div
            id="panel-add-task-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-canvas border border-[#e5e7eb] rounded-xl p-6 overflow-hidden shadow-sm"
          >
            <div className="flex items-center justify-between pb-4 border-b border-hairline mb-5">
              <div className="flex items-center gap-2">
                <ListPlus className="w-5 h-5 text-brand-primary" />
                <h3 className="text-sm font-bold text-brand-primary">새 일정 만들기</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setErrors({});
                }}
                className="p-1 text-muted-soft hover:text-brand-primary rounded-full hover:bg-surface-soft transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title input */}
              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1.5 leading-none">
                  일정 제목 <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-task-title"
                  type="text"
                  placeholder="예: 운영체제 프로젝트 보고서 제출, 캠퍼스 동아리 회의"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                  }}
                  className={`w-full px-3.5 py-2 text-sm bg-canvas border rounded-md text-brand-primary placeholder:text-muted focus:outline-hidden focus:border-brand-primary placeholder-slate-400 transition-colors ${
                    errors.title ? 'border-rose-400 focus:border-rose-500' : 'border-hairline'
                  }`}
                />
                {errors.title && <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category select */}
                <div>
                  <label className="block text-xs font-semibold text-brand-primary mb-1.5 leading-none">
                    구분
                  </label>
                  <select
                    id="select-task-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TaskCategory)}
                    className="w-full px-3.5 py-2 text-sm bg-canvas border border-hairline rounded-md text-brand-primary focus:outline-hidden focus:border-brand-primary transition-colors"
                  >
                    {Object.values(TaskCategory).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority select */}
                <div>
                  <label className="block text-xs font-semibold text-brand-primary mb-1.5 leading-none">
                    우선순위
                  </label>
                  <select
                    id="select-task-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full px-3.5 py-2 text-sm bg-canvas border border-hairline rounded-md text-brand-primary focus:outline-hidden focus:border-brand-primary transition-colors"
                  >
                    {Object.values(TaskPriority).map((prio) => (
                      <option key={prio} value={prio}>
                        {prio}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-xs font-semibold text-brand-primary mb-1.5 leading-none">
                    마감 시간 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-task-due-date"
                    type="text"
                    placeholder="예: 금요일 오후 6:00 또는 06/05 23:59"
                    value={dueDate}
                    onChange={(e) => {
                      setDueDate(e.target.value);
                      if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: '' }));
                    }}
                    className={`w-full px-3.5 py-2 text-sm bg-canvas border rounded-md text-brand-primary placeholder:text-muted focus:outline-hidden focus:border-brand-primary placeholder-slate-400 transition-colors ${
                      errors.dueDate ? 'border-rose-400 focus:border-rose-500' : 'border-hairline'
                    }`}
                  />
                  {errors.dueDate && <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.dueDate}</p>}
                </div>
              </div>

              {/* Memo input */}
              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1.5 leading-none">
                  메모 및 상세설명
                </label>
                <textarea
                  id="textarea-task-memo"
                  rows={2}
                  placeholder="추가 세부 사항, 준비물, 조원 명단 등 요약 메모 기입"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-canvas border border-hairline rounded-md text-brand-primary placeholder:text-muted focus:outline-hidden focus:border-brand-primary placeholder-slate-400 transition-colors resize-none"
                />
              </div>

              {/* Form submit/cancel */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-hairline-soft">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setErrors({});
                  }}
                  className="px-4 py-2 text-xs font-semibold border border-hairline hover:bg-surface-soft text-brand-primary rounded-md transition-colors"
                >
                  취소
                </button>
                <button
                  id="btn-submit-task"
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-brand-primary hover:bg-primary-active text-on-primary rounded-md transition-colors"
                >
                  일정 등록하기
                </button>
              </div>
            </form>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
