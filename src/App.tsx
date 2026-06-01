/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  RotateCcw, 
  Search, 
  GraduationCap, 
  Github, 
  BookOpen, 
  CheckCircle2, 
  Menu, 
  X,
  FileSpreadsheet
} from 'lucide-react';
import { Task, TaskCategory, TaskPriority, TaskStatus } from './types';
import { DEFAULT_TASKS } from './data';
import { DashboardSummary } from './components/DashboardSummary';
import { TaskCard } from './components/TaskCard';
import { NewTaskForm } from './components/NewTaskForm';

export default function App() {
  // Load initial tasks from standard localStorage, fallback to DEFAULT_TASKS
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('campus_tasks');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load tasks from local storage', e);
    }
    return DEFAULT_TASKS;
  });

  // Save tasks to localStorage on change
  useEffect(() => {
    localStorage.setItem('campus_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Navigation Filter state (전체 일정, 과제, 시험, 발표, 팀플)
  const [selectedCategory, setSelectedCategory] = useState<string>('전체 일정');
  
  // Status Filter state (전체, 시작 전, 진행 중, 완료)
  const [selectedStatus, setSelectedStatus] = useState<string>('전체');

  // Search filter
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Mobile menu open
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Status button cycle logic: 시작 전 → 진행 중 → 완료 → 시작 전
  const handleStatusChange = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          let nextStatus: TaskStatus;
          if (task.status === TaskStatus.BEFORE_START) {
            nextStatus = TaskStatus.IN_PROGRESS;
          } else if (task.status === TaskStatus.IN_PROGRESS) {
            nextStatus = TaskStatus.COMPLETED;
          } else {
            nextStatus = TaskStatus.BEFORE_START;
          }
          return { ...task, status: nextStatus };
        }
        return task;
      })
    );
  };

  // Delete a task
  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Add a task
  const handleAddTask = (newTaskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: Date.now().toString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // Reset tasks to original sample data
  const handleResetToDefault = () => {
    if (window.confirm('모든 원본 샘플 데이터로 복원하시겠습니까? 현재 추가된 내용은 삭제됩니다.')) {
      setTasks(DEFAULT_TASKS);
      setSelectedCategory('전체 일정');
      setSelectedStatus('전체');
      setSearchQuery('');
    }
  };

  // Multi-dimensional filter
  const filteredTasks = tasks.filter((task) => {
    // 1. Filter by category
    if (selectedCategory !== '전체 일정') {
      if (task.category !== selectedCategory) return false;
    }
    // 2. Filter by status
    if (selectedStatus !== '전체') {
      if (task.status !== selectedStatus) return false;
    }
    // 3. Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(query);
      const matchMemo = task.memo.toLowerCase().includes(query);
      if (!matchTitle && !matchMemo) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-canvas font-sans flex flex-col justify-between selection:bg-brand-primary selection:text-on-primary">
      {/* 1. Header (Navbar) */}
      <header className="sticky top-0 z-40 w-full bg-canvas border-b border-hairline py-4 px-6">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          
          {/* Service Logo & Title */}
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-brand-primary text-on-primary rounded-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="cal-sans-heading text-lg font-bold text-brand-primary">
                Campus Task Planner
              </h1>
              <span className="hidden sm:inline-block text-[11px] text-muted font-medium bg-surface-soft px-2 py-0.5 rounded-full mt-0.5 border border-hairline-soft">
                v1.0 UI Prototype
              </span>
            </div>
          </div>

          {/* Simple Navigation Area - Desktop (전체 일정, 과제, 시험, 발표, 팀플) */}
          <nav className="hidden md:flex items-center bg-surface-soft p-1 rounded-full border border-hairline-soft">
            {['전체 일정', '과제', '시험', '발표', '팀플'].map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all duration-150 ${
                    isActive
                      ? 'bg-canvas text-brand-primary shadow-xs border border-hairline-soft'
                      : 'text-muted hover:text-brand-primary border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </nav>

          {/* Dynamic Helper utilities */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToDefault}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-hairline hover:bg-surface-soft text-xs font-semibold text-brand-primary transition-all duration-150"
              title="초기 샘플 데이터로 복원"
            >
              <RotateCcw className="w-3.5 h-3.5 text-muted-soft" />
              <span className="hidden sm:inline">샘플 초기화</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-surface-soft border border-hairline text-brand-primary transition"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Navigation Area - Mobile Slide */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-4 pt-4 border-t border-hairline-soft flex flex-wrap gap-2 justify-center"
            >
              {['전체 일정', '과제', '시험', '발표', '팀플'].map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-brand-primary text-on-primary'
                        : 'bg-surface-soft text-muted hover:text-brand-primary border border-hairline-soft'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Subtitle Banner Area */}
      <section className="bg-canvas py-8 px-6 border-b border-hairline-soft">
        <div className="max-w-[1200px] mx-auto text-left md:text-center">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="cal-sans-heading text-2xl md:text-3xl font-semibold text-brand-primary mb-2"
          >
            대학생을 위한 과제·시험·발표·팀플 일정 관리 웹앱
          </motion.h2>
          <p className="text-sm text-body max-w-2xl md:mx-auto">
            학기 중 쏟아지는 과제와 과목별 시험 정보, 헷갈리는 팀 프로젝트(팀플) 마감 시간을 스마트하게 관리하세요.
            이 앱은 Cal.com의 고급스러운 디자인을 담아낸 UI 프로토타입 대시보드입니다.
          </p>
        </div>
      </section>

      {/* Main Content Dashboard */}
      <main className="flex-grow max-w-[1200px] w-full mx-auto py-8 px-6 space-y-8">
        
        {/* 2. Summary Dashboard */}
        <section id="dashboard-summary-section">
          <DashboardSummary tasks={tasks} />
        </section>

        {/* 3. Filter and Task management area */}
        <section id="tasks-manager-section" className="space-y-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Status filters (전체, 시작 전, 진행 중, 완료) styled as a nav-pill-group */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="text-xs font-bold text-brand-primary flex items-center gap-1">
                상태 필터:
              </span>
              <div id="status-pill-group" className="flex items-center bg-surface-soft p-1 rounded-md border border-hairline-soft">
                {['전체', '시작 전', '진행 중', '완료'].map((status) => {
                  const isActive = selectedStatus === status;
                  return (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
                        isActive
                          ? 'bg-canvas text-brand-primary shadow-xs border border-transparent'
                          : 'text-muted hover:text-brand-primary border border-transparent'
                      }`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Text Search input */}
            <div className="relative flex-grow lg:flex-grow-0 lg:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-soft pointer-events-none" />
              <input
                id="searchbar-tasks"
                type="text"
                placeholder="일정명 또는 메모 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-canvas border border-hairline rounded-md text-brand-primary placeholder:text-muted focus:outline-hidden focus:border-brand-primary transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-soft hover:text-brand-primary"
                >
                  지우기
                </button>
              )}
            </div>

          </div>

          {/* Add a collapsible card form to create tasks */}
          <NewTaskForm onAddTask={handleAddTask} />

          {/* Category-scoped view indicator */}
          <div className="flex items-center justify-between py-2 border-b border-hairline-soft">
            <span className="text-xs font-bold text-brand-primary flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-muted-soft" />
              <span>{selectedCategory}</span>
              <span className="text-[11px] font-normal text-muted-soft">({filteredTasks.length}개 발견됨)</span>
            </span>
            {(selectedCategory !== '전체 일정' || selectedStatus !== '전체' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('전체 일정');
                  setSelectedStatus('전체');
                  setSearchQuery('');
                }}
                className="text-xs text-brand-accent hover:underline font-medium"
              >
                모든 필터 초기화
              </button>
            )}
          </div>

          {/* 4. Task cards Grid & Responsive columns */}
          <div id="tasks-display-area">
            {filteredTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-surface-strong rounded-lg bg-surface-card"
              >
                <div className="p-3 bg-canvas border border-hairline rounded-full mb-3 text-muted-soft">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-brand-primary">보여줄 일정이 없습니다</h3>
                <p className="text-xs text-muted mt-1 text-center max-w-sm">
                  {selectedCategory !== '전체 일정' || selectedStatus !== '전체' || searchQuery
                    ? '설정하신 필터 또는 검색어와 일치하는 조건의 가용 목록이 없습니다. 다른 필터를 사용해보세요.'
                    : '등록된 일정이 하나도 없습니다! 위의 새로운 일정 추가 버튼으로 첫 일정을 시작해보세요.'}
                </p>
                {(selectedCategory !== '전체 일정' || selectedStatus !== '전체' || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedCategory('전체 일정');
                      setSelectedStatus('전체');
                      setSearchQuery('');
                    }}
                    className="mt-4 px-4 py-2 border border-hairline bg-canvas hover:bg-surface-soft text-xs font-semibold rounded-md transition"
                  >
                    전체 목록 보기
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div 
                layout 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </section>

        {/* Feature info banner (Product chrome display detail card helper) */}
        <section className="bg-surface-soft/40 border border-hairline p-6 rounded-lg text-left">
          <h3 className="text-xs font-bold text-brand-primary mb-1">
            💡 사용 안내 및 UI 프로토타입 시나리오
          </h3>
          <ul className="text-xs text-body space-y-1.5 list-disc pl-4">
            <li><strong>카테고리 별 필터링:</strong> 상단 헤더의 네비게이션 필터(전체 일정, 과제, 시험, 발표, 팀플)로 대단위 분류를 빠르게 넘나들 수 있습니다.</li>
            <li><strong>실시간 상태 토글:</strong> 각 일정 아래의 상태 버튼(<span className="text-brand-accent">시작 전 → 진행 중 → 완료</span>)을 클릭하면 일련의 순서대로 바뀝니다. 변경된 통계 카드는 대시보드 진행률에 실시간 누적 반영됩니다.</li>
            <li><strong>지속 동작형 로컬 스토리지:</strong> 본 서비스는 로컬 브라우저 상태를 유지하여 창을 새로고침하거나 브라우저를 껐다 켜도 내용이 소실되지 않고 지켜집니다.</li>
          </ul>
        </section>

      </main>

      {/* 8. Footer component (deliberate surface inversion is the ONLY dark area) */}
      <footer className="bg-surface-dark border-t border-surface-dark-elevated text-on-dark-soft pt-14 pb-16 px-6 mt-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* Branding Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-on-dark">
                <div className="p-1.5 bg-canvas text-brand-primary rounded-md">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="cal-sans-heading text-base font-bold">
                  Campus Task Planner
                </span>
              </div>
              <p className="text-xs text-on-dark-soft leading-relaxed max-w-sm">
                과제, 시험, 자료 발표, 조별 과제 등 한눈에 놓치기 쉬운 과부하 일정을 직관적으로 관리하여 일상 생산성을 확장해 주는 대학생 전용 스케줄 분석 및 정리 솔루션입니다.
              </p>
            </div>

            {/* Quick Link Categories 1 */}
            <div>
              <h4 className="text-xs font-bold text-on-dark uppercase tracking-wider mb-4">
                과제 & 공부 자료
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#tasks-manager-section" onClick={() => setSelectedCategory('과제')} className="hover:text-on-dark transition">전공 및 교양 과제</a></li>
                <li><a href="#tasks-manager-section" onClick={() => setSelectedCategory('시험')} className="hover:text-on-dark transition">시험대비 시험공부 일정</a></li>
                <li><a href="#tasks-manager-section" className="hover:text-on-dark transition">복습 마스터 플래너</a></li>
                <li><a href="#tasks-manager-section" className="hover:text-on-dark transition border-b border-[rgba(255,255,255,0.15)] pb-0.5">강의 요약 노트</a></li>
              </ul>
            </div>

            {/* Quick Link Categories 2 */}
            <div>
              <h4 className="text-xs font-bold text-on-dark uppercase tracking-wider mb-4">
                발표 & 팀 프로젝트
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#tasks-manager-section" onClick={() => setSelectedCategory('발표')} className="hover:text-on-dark transition">중간 및 기말 대본 자료</a></li>
                <li><a href="#tasks-manager-section" onClick={() => setSelectedCategory('팀플')} className="hover:text-on-dark transition">팀플 회의록 및 요약</a></li>
                <li><a href="#tasks-manager-section" className="hover:text-on-dark transition">협업 연락처 보관소</a></li>
                <li><a href="#tasks-manager-section" className="hover:text-on-dark transition">마일스톤 추진 일지</a></li>
              </ul>
            </div>

            {/* Tech / Source spec columns */}
            <div>
              <h4 className="text-xs font-bold text-on-dark uppercase tracking-wider mb-4">
                프로토타입 가이드라인
              </h4>
              <p className="text-xs leading-relaxed max-w-sm mb-3">
                본 웹 어플리케이션은 대학 과제용 시스템 프로토타입으로 작성되어, 상용 결제 또는 민감한 로그인은 포함하고 있지 않습니다.
              </p>
              <div className="flex items-center gap-2 pt-2 text-on-dark border-t border-[rgba(255,255,255,0.06)]">
                <span className="text-[11px] bg-surface-dark-elevated px-2 py-1 rounded text-muted-soft flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  React 19 & Tailwind 4
                </span>
              </div>
            </div>

          </div>

          {/* Bottom attribution row */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-surface-dark-elevated gap-4 text-xs text-muted-soft">
            <div>
              &copy; {new Date().getFullYear()} Campus Task Planner. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[11px]">Designed in spirit of Cal.com visual framework</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
