'use client';

import React, { useRef } from 'react';
import { useRecorder } from '@/hooks/useRecorder';
import { Waveform } from './Waveform';
import { formatDuration } from '@/lib/utils';

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob, duration: number) => void;
}

type RecorderState = 'idle' | 'recording' | 'paused' | 'stopped';

export function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const { isRecording, isPaused, duration, audioBlob, stream, startRecording, stopRecording, pauseRecording, resumeRecording } =
    useRecorder();
  const audioRef = useRef<HTMLAudioElement>(null);

  const state: RecorderState = isRecording
    ? isPaused
      ? 'paused'
      : 'recording'
    : audioBlob
    ? 'stopped'
    : 'idle';

  const handleStop = () => {
    stopRecording();
  };

  const handleUse = () => {
    if (audioBlob) onRecordingComplete(audioBlob, duration);
  };

  const handleDiscard = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-4">
      <Waveform stream={stream} isActive={isRecording && !isPaused} />

      <div className="flex items-center justify-between">
        <span className="text-2xl font-mono font-bold text-foreground tabular-nums">
          {formatDuration(duration)}
        </span>
        {state === 'recording' && (
          <span className="flex items-center gap-2 text-sm text-red-500">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Recording
          </span>
        )}
        {state === 'paused' && (
          <span className="text-sm text-yellow-500">Paused</span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {state === 'idle' && (
          <button
            onClick={startRecording}
            className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition-colors"
          >
            Start Recording
          </button>
        )}

        {(state === 'recording' || state === 'paused') && (
          <>
            <button
              onClick={isPaused ? resumeRecording : pauseRecording}
              className="w-full sm:w-auto px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full font-semibold transition-colors"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={handleStop}
              className="w-full sm:w-auto px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-full font-semibold transition-colors"
            >
              Stop
            </button>
          </>
        )}

        {state === 'stopped' && audioBlob && (
          <>
            <audio
              ref={audioRef}
              src={URL.createObjectURL(audioBlob)}
              controls
              className="w-full"
            />
            <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full">
              <button
                onClick={handleUse}
                className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-blue-700 text-white rounded-full font-semibold transition-colors"
              >
                Use Recording
              </button>
              <button
                onClick={handleDiscard}
                className="w-full sm:w-auto px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-semibold transition-colors"
              >
                Discard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
