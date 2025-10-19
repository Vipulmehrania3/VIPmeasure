import { useState, useCallback, MouseEvent, useEffect, useMemo } from 'react';
import { AppState, Point, Unit } from '../types';

const calculatePixelDistance = (p1: Point, p2: Point): number => {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
};

export const useMeasurement = () => {
  const [state, setState] = useState<AppState>(AppState.START);
  const [cameraError, setCameraError] = useState<Error | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const [calibrationPoints, setCalibrationPoints] = useState<Point[]>([]);
  const [measurementPoints, setMeasurementPoints] = useState<Point[]>([]);
  
  const [pixelsPerUnitAtCalibration, setPixelsPerUnitAtCalibration] = useState<number | null>(null);
  const [calibrationDistance, setCalibrationDistance] = useState<number | null>(null);
  const [planeShift, setPlaneShift] = useState<number>(0);
  
  const [unit, setUnit] = useState<Unit>('cm');
  const [measuredDistance, setMeasuredDistance] = useState<number | null>(null);

  const toggleCamera = useCallback(() => {
    setIsCameraOn(prev => !prev);
  }, []);

  useEffect(() => {
    if (!isCameraOn) {
      // Reset all measurement/calibration data when camera is turned off
      setCalibrationPoints([]);
      setMeasurementPoints([]);
      setPixelsPerUnitAtCalibration(null);
      setCalibrationDistance(null);
      setMeasuredDistance(null);
      setPlaneShift(0);
      setUnit('cm');
      setState(AppState.CAMERA_OFF);
    } else {
      // If camera was just turned ON from an off state, restart the process.
      if (state === AppState.CAMERA_OFF) {
        setState(AppState.START);
      }
    }
  }, [isCameraOn, state]);

  const handleCameraReady = useCallback(() => {
      if(isCameraOn) {
        setState(AppState.CALIBRATE_STEP_1);
      }
  }, [isCameraOn]);

  const handleCameraError = useCallback((error: Error) => {
      setCameraError(error);
      setState(AppState.CAMERA_ERROR);
  }, []);

  const handleScreenClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if ((event.target as HTMLElement).closest('.ui-card')) {
        return;
      }

      const point: Point = { x: event.clientX, y: event.clientY };

      switch (state) {
        case AppState.CALIBRATE_STEP_1:
          setCalibrationPoints([point]);
          setState(AppState.CALIBRATE_STEP_2);
          break;
        case AppState.CALIBRATE_STEP_2:
          setCalibrationPoints((prev) => [...prev, point]);
          setState(AppState.CALIBRATE_INPUT);
          break;
        case AppState.MEASURE_STEP_1:
          setMeasurementPoints([point]);
          setState(AppState.MEASURE_STEP_2);
          break;
        case AppState.MEASURE_STEP_2:
          setMeasurementPoints((prev) => [...prev, point]);
          break;
        default:
          break;
      }
    },
    [state]
  );

  const handleCalibrationSubmit = useCallback(
    (knownLength: number, selectedUnit: Unit, distanceFromObject: number) => {
      if (calibrationPoints.length !== 2 || knownLength <= 0 || distanceFromObject <= 0) return;

      const pixelDistance = calculatePixelDistance(calibrationPoints[0], calibrationPoints[1]);
      setPixelsPerUnitAtCalibration(pixelDistance / knownLength);
      setCalibrationDistance(distanceFromObject);
      setUnit(selectedUnit);
      setMeasurementPoints([]);
      setPlaneShift(0);
      setState(AppState.MEASURE_STEP_1);
    },
    [calibrationPoints]
  );
  
  const effectivePixelsPerUnit = useMemo(() => {
      if (!pixelsPerUnitAtCalibration || !calibrationDistance) return null;
      
      const effectiveDistance = calibrationDistance + planeShift;
      if (effectiveDistance <= 0) return null; // Avoid impossible scenarios
      
      const scaleFactor = calibrationDistance / effectiveDistance;
      return pixelsPerUnitAtCalibration * scaleFactor;
  }, [pixelsPerUnitAtCalibration, calibrationDistance, planeShift]);


  useEffect(() => {
    if (state === AppState.MEASURE_STEP_2 && measurementPoints.length === 2 && effectivePixelsPerUnit) {
        const pixelDistance = calculatePixelDistance(measurementPoints[0], measurementPoints[1]);
        setMeasuredDistance(pixelDistance / effectivePixelsPerUnit);
        setState(AppState.SHOW_RESULT);
    }
  }, [measurementPoints, effectivePixelsPerUnit, state]);

  // Also recalculate when planeShift changes while showing result
  useEffect(() => {
    if (state === AppState.SHOW_RESULT && measurementPoints.length === 2 && effectivePixelsPerUnit) {
      const pixelDistance = calculatePixelDistance(measurementPoints[0], measurementPoints[1]);
      setMeasuredDistance(pixelDistance / effectivePixelsPerUnit);
    }
  }, [effectivePixelsPerUnit, state, measurementPoints]);


  const recalibrate = useCallback(() => {
    setState(AppState.CALIBRATE_STEP_1);
    setCalibrationPoints([]);
    setMeasurementPoints([]);
    setPixelsPerUnitAtCalibration(null);
    setCalibrationDistance(null);
    setMeasuredDistance(null);
    setPlaneShift(0);
    setUnit('cm');
  }, []);

  const remeasure = useCallback(() => {
    setMeasurementPoints([]);
    setMeasuredDistance(null);
    setPlaneShift(0);
    setState(AppState.MEASURE_STEP_1);
  }, []);


  return {
    state,
    cameraError,
    isCameraOn,
    calibrationPoints,
    measurementPoints,
    unit,
    measuredDistance,
    planeShift,
    calibrationDistance,
    handleCameraReady,
    handleCameraError,
    handleScreenClick,
    handleCalibrationSubmit,
    setPlaneShift,
    toggleCamera,
    recalibrate,
    remeasure,
  };
};