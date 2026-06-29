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
          <span className="flex items-center gap-2 text-sm text-destructive">
            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            Recording
          </span>
        )}
        {state === 'paused' && (
          <span className="text-sm text-muted-foreground">Paused</span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {state === 'idle' && (
          <button
            onClick={startRecording}
            className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:brightness-110 transition-all active:scale-[0.97] animate-breathe"
          >
            Start Recording
          </button>
        )}

        {(state === 'recording' || state === 'paused') && (
          <>
            <button
              onClick={isPaused ? resumeRecording : pauseRecording}
              className="w-full sm:w-auto px-6 py-3 bg-secondary text-foreground border border-border rounded-full font-semibold hover:bg-muted transition-all active:scale-[0.97]"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={handleStop}
              className="w-full sm:w-auto px-6 py-3 bg-destructive text-destructive-foreground rounded-full font-semibold hover:brightness-110 transition-all active:scale-[0.97]"
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
                className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:brightness-110 transition-all active:scale-[0.97]"
              >
                Use Recording
              </button>
              <button
                onClick={handleDiscard}
                className="w-full sm:w-auto px-6 py-3 bg-secondary text-foreground border border-border rounded-full font-semibold hover:bg-muted transition-all active:scale-[0.97]"
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
