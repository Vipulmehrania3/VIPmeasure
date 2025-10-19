import React from 'react';
import { useMeasurement } from './hooks/useMeasurement';
import { AppState } from './types';
import Pin from './components/Pin';
import ConnectingLine from './components/ConnectingLine';
import UICard from './components/UICard';
import CalibrationInput from './components/CalibrationInput';
import ResultDisplay from './components/ResultDisplay';
import CameraFeed from './components/CameraFeed';
import PlaneShiftControl from './components/PlaneShiftControl';

const App: React.FC = () => {
  const {
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
  } = useMeasurement();

  const getInstruction = (): React.ReactNode => {
    switch (state) {
      case AppState.START:
        return 'Starting camera...';
      case AppState.CAMERA_OFF:
        return 'Camera is off. Turn it on to begin measuring.';
      case AppState.CAMERA_ERROR:
        return (
          <div className="text-red-400">
            <p className="font-bold mb-1">Camera Error</p>
            <p className="text-sm">{cameraError?.message || 'Could not access camera.'}</p>
          </div>
        );
      case AppState.CALIBRATE_STEP_1:
        return 'Place the first pin on one end of an object with a known length.';
      case AppState.CALIBRATE_STEP_2:
        return 'Place the second pin on the other end of the object.';
      case AppState.CALIBRATE_INPUT:
        return 'Enter the object\'s details to calibrate the scale.';
      case AppState.MEASURE_STEP_1:
        return 'Calibration complete! Place the first pin to start measuring.';
      case AppState.MEASURE_STEP_2:
        return 'Place the second pin to finish the measurement.';
      case AppState.SHOW_RESULT:
        return 'Measurement successful!';
      default:
        return '';
    }
  };

  const showMeasurementUI = state === AppState.MEASURE_STEP_1 || state === AppState.MEASURE_STEP_2 || state === AppState.SHOW_RESULT;

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-black text-white">
      <main 
        className="relative flex-grow w-full"
        onClick={handleScreenClick}
      >
        {isCameraOn && <CameraFeed onStreamReady={handleCameraReady} onError={handleCameraError} />}
        
        <div
          className="absolute inset-0 w-full h-full cursor-crosshair"
        >
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {/* Lines */}
            {calibrationPoints.length === 2 && (
              <ConnectingLine p1={calibrationPoints[0]} p2={calibrationPoints[1]} color="rgba(250, 204, 21, 0.8)" />
            )}
            {measurementPoints.length === 2 && (
              <ConnectingLine p1={measurementPoints[0]} p2={measurementPoints[1]} color="rgba(59, 130, 246, 0.8)" />
            )}

            {/* Points */}
            {calibrationPoints.map((p, i) => (
              <Pin key={`cal-${i}`} point={p} color="#facc15" />
            ))}
            {measurementPoints.map((p, i) => (
              <Pin key={`mes-${i}`} point={p} color="#3b82f6" />
            ))}
          </svg>
        </div>
        
        {(state === AppState.CALIBRATE_INPUT || state === AppState.SHOW_RESULT) && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm px-4">
              <UICard className="ui-card-interactive">
                  {state === AppState.CALIBRATE_INPUT && <CalibrationInput onSubmit={handleCalibrationSubmit} />}
                  {state === AppState.SHOW_RESULT && measuredDistance !== null && (
                      <ResultDisplay distance={measuredDistance} unit={unit} onRemeasure={remeasure} onRecalibrate={recalibrate} />
                  )}
              </UICard>
          </div>
        )}
      </main>

      <footer className="w-full bg-gray-900 p-4 border-t border-sky-500/20 flex items-center justify-between gap-8">
        <div className="flex items-center gap-4 max-w-md">
            <div className="flex-grow">
                <h1 className="text-lg font-bold text-sky-300">AR Pixel Ruler</h1>
                <p className="text-gray-300 text-sm">{getInstruction()}</p>
            </div>
            <button
                onClick={toggleCamera}
                className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/70 transition-colors flex-shrink-0"
                aria-label={isCameraOn ? 'Turn camera off' : 'Turn camera on'}
            >
                {isCameraOn ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 13.5 5.25h-9a2.25 2.25 0 0 0-2.25 2.25v9A2.25 2.25 0 0 0 4.5 18.75Z" />
                </svg>
                ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 0 1-2.25-2.25v-9A2.25 2.25 0 0 1 4.5 5.25H9M12 18.75h.375a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H12m-8.25 9 12-12" />
                </svg>
                )}
            </button>
        </div>

        <div className="flex-grow">
            {showMeasurementUI && calibrationDistance ? (
                <PlaneShiftControl 
                    value={planeShift}
                    onChange={setPlaneShift}
                    unit={unit}
                    maxForward={calibrationDistance}
                />
            ) : (
            <div className="text-center text-gray-500">
                <p>Calibrate to enable measurement controls</p>
            </div>
            )}
        </div>
      </footer>
    </div>
  );
};

export default App;