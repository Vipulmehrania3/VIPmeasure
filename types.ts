export interface Point {
  x: number;
  y: number;
}

export enum AppState {
  START,
  CAMERA_ERROR,
  CAMERA_OFF,
  CALIBRATE_STEP_1,
  CALIBRATE_STEP_2,
  CALIBRATE_INPUT,
  MEASURE_STEP_1,
  MEASURE_STEP_2,
  SHOW_RESULT,
}

export const UNITS = ['cm', 'm', 'in', 'ft'] as const;
export type Unit = typeof UNITS[number];