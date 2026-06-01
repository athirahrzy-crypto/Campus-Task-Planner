/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum TaskCategory {
  ASSIGNMENT = '과제',
  PRESENTATION = '발표',
  EXAM = '시험',
  TEAM_PROJECT = '팀플',
}

export enum TaskPriority {
  HIGH = '높음',
  MEDIUM = '보통',
  LOW = '낮음',
}

export enum TaskStatus {
  BEFORE_START = '시작 전',
  IN_PROGRESS = '진행 중',
  COMPLETED = '완료',
}

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  dueDate: string; // e.g. "화요일 오후 11:59" or ISO format if we support creating custom deadlines
  priority: TaskPriority;
  status: TaskStatus;
  memo: string;
}
