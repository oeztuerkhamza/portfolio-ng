import { InjectionToken } from '@angular/core';
import type { PlannerComponent } from './planner.component';

/**
 * Der Planer, wie der Einrichtungsassistent ihn sieht. Ein Token statt eines
 * direkten Imports, damit Planer und Assistent sich nicht gegenseitig laden.
 */
export const PLANNER = new InjectionToken<PlannerComponent>('PlannerComponent');
