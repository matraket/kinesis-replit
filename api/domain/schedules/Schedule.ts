export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Schedule {
  id: string;
  programId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  instructorId?: string;
  location?: string;
  maxCapacity?: number;
  currentEnrollment: number;
  isActive: boolean;
  validFrom?: Date;
  validUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export function createSchedule(data: Partial<Schedule> & Pick<Schedule, 'id' | 'programId' | 'dayOfWeek' | 'startTime' | 'endTime'>): Schedule {
  return {
    currentEnrollment: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  };
}
