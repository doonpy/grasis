import { TopicStudent } from './topic-student/topic-student.interface';
import { Topic } from './topic.interface';

export function sortByStudentRegisterStatus(a: TopicStudent, b: TopicStudent): number {
  if (a.status < b.status) {
    return -1;
  }
  if (a.status > b.status) {
    return 1;
  }
  return 0;
}

export function sortByCreator(a: Topic, b: Topic): number {
  if (a.creator.id > b.creator.id) {
    return 1;
  }

  if (a.creator.id < b.creator.id) {
    return -1;
  }

  return 0;
}

export function sortBySubject(a: Topic, b: Topic): number {
  if (a.subject > b.subject) {
    return 1;
  }

  if (a.subject < b.subject) {
    return -1;
  }

  return 0;
}

export function sortByRegisterStatus(a: Topic, b: Topic): number {
  if (a.registerStatus > b.registerStatus) {
    return 1;
  }

  if (a.registerStatus < b.registerStatus) {
    return -1;
  }

  return 0;
}

export function sortByMaxStudent(a: Topic, b: Topic): number {
  if (a.maxStudent > b.maxStudent) {
    return 1;
  }

  if (a.maxStudent < b.maxStudent) {
    return -1;
  }

  return 0;
}

export function sortByTopicStatus(a: Topic, b: Topic): number {
  if (a.status > b.status) {
    return 1;
  }

  if (a.status < b.status) {
    return -1;
  }

  return 0;
}

export function sortByRemainSlot(a: Topic, b: Topic): number {
  const remainSlotA = a.maxStudent - a.currentStudent;
  const remainSlotB = b.maxStudent - b.currentStudent;

  if (remainSlotA > remainSlotB) {
    return 1;
  }

  if (remainSlotA < remainSlotB) {
    return -1;
  }

  return 0;
}
