/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task, TaskCategory, TaskPriority, TaskStatus } from './types';

export const DEFAULT_TASKS: Task[] = [
  {
    id: '1',
    title: '인공지능기초 자유주제 URL 제출',
    category: TaskCategory.ASSIGNMENT,
    dueDate: '화요일 오후 11:59',
    priority: TaskPriority.HIGH,
    status: TaskStatus.IN_PROGRESS,
    memo: '배포 URL과 UI 설명글 제출',
  },
  {
    id: '2',
    title: '머신러닝 중간발표 준비',
    category: TaskCategory.PRESENTATION,
    dueDate: '금요일 오후 6:00',
    priority: TaskPriority.HIGH,
    status: TaskStatus.IN_PROGRESS,
    memo: '결과 그래프와 발표 대본 확인',
  },
  {
    id: '3',
    title: '운영체제 프로젝트 보고서',
    category: TaskCategory.ASSIGNMENT,
    dueDate: '일요일 오후 11:59',
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.BEFORE_START,
    memo: '코드 설명과 실행 결과 정리',
  },
  {
    id: '4',
    title: '데이터베이스 퀴즈 복습',
    category: TaskCategory.EXAM,
    dueDate: '수요일 오전 10:00',
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.COMPLETED,
    memo: 'JOIN과 트랜잭션 복습',
  },
  {
    id: '5',
    title: '팀플 자료 정리',
    category: TaskCategory.TEAM_PROJECT,
    dueDate: '목요일 오후 3:00',
    priority: TaskPriority.LOW,
    status: TaskStatus.BEFORE_START,
    memo: '팀원별 자료 합치기',
  },
];
