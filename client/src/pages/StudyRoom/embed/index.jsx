import { useReducer, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  playerReducer,
  initialPlayerState,
} from '../../../reducers/playerReducer';
import { extractYouTubeId } from '../../../lib/youtube';

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

function loadYouTubeAPI() {
  if (document.getElementById('yt-api-script')) return;
  const tag = document.createElement('script');
  tag.id = 'yt-api-script';
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}

export default function StudyRoomEmbedPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const config = location.state;

  const [state, dispatch] = useReducer(playerReducer, initialPlayerState);
  const [bgmOn, setBgmOn] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const ytPlayersRef = useRef([]);
  const intervalRef = useRef(null);
  const loopPollRef = useRef(null);
  const audioRef = useRef(null);

  const hasBgm = Boolean(config?.bgm?.url);

  useEffect(() => {
    if (!config) {
      navigate('/', { replace: true });
      return;
    }
    dispatch({ type: 'INIT', payload: config.duration * 60 });
  }, []);

  // YouTube IFrame API로 플레이어 초기화
  useEffect(() => {
    if (!config) return;
    const videos = config.videos;

    loadYouTubeAPI();

    const initPlayers = () => {
      videos.forEach((video, i) => {
        const videoId = extractYouTubeId(video.youtubeUrl);
        if (!videoId) return;

        ytPlayersRef.current[i] = new window.YT.Player(`yt-player-${video.id}`, {
          width: '100%',
          height: '100%',
          videoId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            disablekb: 1,
            rel: 0,
            playsinline: 1,
            modestbranding: 1,
          },
        });
      });
    };

    if (window.YT?.Player) {
      initPlayers();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        initPlayers();
      };
    }

    return () => {
      ytPlayersRef.current.forEach((p) => p?.destroy?.());
      ytPlayersRef.current = [];
    };
  }, []);

  // PLAYING 상태에서 끝나기 0.3초 전에 seekTo(0) — ENDED 상태 자체를 막아 YouTube UI 차단
  useEffect(() => {
    loopPollRef.current = setInterval(() => {
      ytPlayersRef.current.forEach((player) => {
        if (!player?.getDuration) return;
        try {
          const duration = player.getDuration();
          const current = player.getCurrentTime();
          if (duration > 0 && current >= duration - 0.3) {
            player.seekTo(0, true);
          }
        } catch {}
      });
    }, 200);
    return () => clearInterval(loopPollRef.current);
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
    ytPlayersRef.current.forEach((player) => {
      if (!player) return;
      if (state.paused) player.pauseVideo?.();
      else player.playVideo?.();
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
        <p className="text-white/50 text-sm mb-8">
          오늘도 주민들과 함께 고생했어요
        </p>
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
            onClick={() =>
              navigate(config.mode === 'single' ? '/concept' : '/zoom')
            }
            className="text-white/40 hover:text-white text-xl transition-colors duration-200"
          >
            ✕
          </button>
        </div>
      </div>

      {hasBgm && <audio ref={audioRef} src={config.bgm.url} loop />}

      <div className={`flex-1 grid ${gridClass} gap-4 p-8 overflow-hidden`}>
        {videos.map((video, i) => {
          const videoId = extractYouTubeId(video.youtubeUrl);
          const displayName = video.animalName ?? video.title;

          return (
            <div
              key={video.id}
              className="relative bg-black rounded-xl overflow-hidden flex items-center justify-center"
            >
              {videoId ? (
                <div id={`yt-player-${video.id}`} className="w-full h-full" />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-linear-to-br from-sage/20 to-leaf/10">
                  <span className="text-6xl animate-float">🌿</span>
                </div>
              )}

              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-md pointer-events-none">
                {displayName}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
