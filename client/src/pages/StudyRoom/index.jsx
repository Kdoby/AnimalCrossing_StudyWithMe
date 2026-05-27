import { useReducer, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  playerReducer,
  initialPlayerState,
} from '../../reducers/playerReducer';

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function getGridClass(count) {
  if (count === 1) return 'grid-cols-1 grid-rows-1';
  if (count === 2) return 'grid-cols-2 grid-rows-1';
  if (count <= 4) return 'grid-cols-2 grid-rows-2';
  return 'grid-cols-3';
}

export default function StudyRoomPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const config = location.state;

  const [state, dispatch] = useReducer(playerReducer, initialPlayerState);
  const [bgmOn, setBgmOn] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const videoRefs = useRef([]);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // config.bgm이 있을 때만 오디오 엘리먼트가 의미 있음
  const hasBgm = Boolean(config?.bgm?.url);

  useEffect(() => {
    if (!config) {
      navigate('/', { replace: true });
      return;
    }
    dispatch({ type: 'INIT', payload: config.duration * 60 });
  }, []);

  useEffect(() => {
    if (!config) return;
    if (state.paused || state.finished) {
      clearInterval(intervalRef.current);
    } else {
      intervalRef.current = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [state.paused, state.finished]);

  useEffect(() => {
    videoRefs.current.forEach((v) => {
      if (!v) return;
      if (state.paused) v.pause();
      else v.play().catch(() => {});
    });
    const audio = audioRef.current;
    if (!audio) return;
    if (state.paused) audio.pause();
    else if (bgmOn) audio.play().catch(() => {});
  }, [state.paused]);

  if (!config) return null;

  const { videos } = config;
  const gridClass = getGridClass(videos.length);

  if (state.finished) {
    const backPath = config.mode === 'single' ? '/concept' : '/zoom';
    return (
      <div className="fixed inset-0 bg-[#1C1C1C] flex flex-col items-center justify-center text-white">
        <div className="text-6xl mb-6 animate-bounce">🌿</div>
        <h2 className="text-2xl font-bold mb-2">공부 완료!</h2>
        <p className="text-white/50 text-sm mb-8">오늘도 주민들과 함께 고생했어요</p>
        <button
          onClick={() => navigate(backPath)}
          className="px-6 py-3 bg-leaf text-white rounded-xl font-semibold hover:bg-leaf-dark transition-colors duration-200 cursor-pointer"
        >
          갤러리로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#1C1C1C] flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 bg-black/40 backdrop-blur-sm">
        <span className="text-white/50 text-sm font-medium">
          🌿 Study With Dongsoop
        </span>

        <span className="text-white text-lg font-mono font-bold tabular-nums">
          {formatTime(state.remaining)}
        </span>

        <div className="flex items-center gap-4">
          {/* BGM 선택 시에만 뮤트 토글 + 볼륨 슬라이더 표시 */}
          {hasBgm && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const audio = audioRef.current;
                  if (!audio) return;
                  if (bgmOn) {
                    audio.pause();
                  } else if (!state.paused) {
                    audio.play().catch(() => {});
                  }
                  setBgmOn((v) => !v);
                }}
                className="text-white/60 hover:text-white text-xl transition-colors duration-200"
                title={config.bgm.title}
              >
                {bgmOn ? '🔊' : '🔇'}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setVolume(v);
                  if (audioRef.current) audioRef.current.volume = v;
                }}
                className="w-20 accent-white/60 cursor-pointer"
              />
            </div>
          )}

          <button
            onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}
            className="text-white/60 hover:text-white text-xl transition-colors duration-200"
          >
            {state.paused ? '▶' : '⏸'}
          </button>

          <button
            onClick={() => navigate(config.mode === 'single' ? '/concept' : '/zoom')}
            className="text-white/40 hover:text-white text-xl transition-colors duration-200"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 선택된 BGM이 있을 때만 audio 엘리먼트 렌더링 */}
      {hasBgm && <audio ref={audioRef} src={config.bgm.url} loop />}

      <div className={`flex-1 grid ${gridClass} gap-4 p-8 overflow-hidden`}>
        {videos.map((video, i) => (
          <div
            key={video.id}
            className="relative bg-black rounded-xl overflow-hidden flex items-center justify-center"
          >
            {video.videoUrl ? (
              <video
                ref={(el) => (videoRefs.current[i] = el)}
                src={video.videoUrl}
                loop
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-sage/20 to-leaf/10">
                <span className="text-6xl animate-float">🌿</span>
              </div>
            )}

            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-md">
              {video.animalName ?? video.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
