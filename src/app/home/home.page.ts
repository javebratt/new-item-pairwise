import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith, pairwise } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tasksSource = new BehaviorSubject<Task[]>([
    {
      id: 'c9540838-6dfb-46d0-b2ad-b97187474e8a',
      title: 'Read',
      description: 'Read 3 pages of a book',
    },
    {
      id: '9509dcec-81e7-4b3e-b3bb-9d77b07b5876',
      title: 'Meditate',
      description: 'Close your eyes for 3 minutes',
    },
    {
      id: '4ad092f7-59e0-48c2-b5a8-c1c2671ffb2b',
      title: 'Coffee',
      description: 'Take a small coffee break',
    },
  ]);
  tasks$ = this.tasksSource.asObservable();

  taskList$: Observable<Task[]> = this.tasks$.pipe(
    startWith([]),
    pairwise(),
    map(([previousTasks, tasks]) => ({
      tasks,
      previousIdSet: new Set(previousTasks.map((task) => task.id)),
    })),
    map(({ tasks, previousIdSet }) =>
      tasks.map((note) => ({
        ...note,
        wasAdded: previousIdSet.size > 0 && !previousIdSet.has(note.id),
      }))
    )
  );

  constructor() {}

  confirm() {
    const newTask = {
      id: uuidv4(),
      title: 'I am a new task',
      description: 'I am the details of a new task',
    };
    this.tasksSource.next([newTask, ...this.tasksSource.value]);
  }
}

interface Task {
  id: string;
  title: string;
  description: string;
  wasAdded?: boolean;
}
