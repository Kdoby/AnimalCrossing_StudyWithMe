import { useReducer, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  playerReducer,
  initialPlayerState,
} from '../../reducers/playerReducer';

// 초(seconds)를 "MM:SS" 또는 "H:MM:SS" 형식으로 변환
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  // padStart(2, '0'): 한 자리 숫자 앞에 0 붙임. 예: 5 → "05"
  if (h > 0)
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// 영상 수에 따라 CSS Grid 클래스를 결정
function getGridClass(count) {
  if (count === 1) return 'grid-cols-1 grid-rows-1'; // 풀스크린
  if (count === 2) return 'grid-cols-2 grid-rows-1'; // 좌우 분할
  if (count <= 4) return 'grid-cols-2 grid-rows-2'; // 2x2
  return 'grid-cols-3'; // 3열 갤러리
}

export default function StudyRoomPage() {
  // useLocation: 이전 페이지(Gallery)에서 navigate로 넘긴 state를 꺼냄
  // { videos: [...], duration: 60 } 형태
  const location = useLocation();
  const navigate = useNavigate();
  const config = location.state;

  // useReducer: 복잡한 상태(remaining, paused, finished)를 한 곳에서 관리
  // dispatch로 액션을 보내면 playerReducer가 새 상태를 만들어 반환
  const [state, dispatch] = useReducer(playerReducer, initialPlayerState);

  // 배경 오디오 on/off. 초기값 false(음소거) — 브라우저 자동재생 정책 대응
  const [bgmOn, setBgmOn] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const videoRefs = useRef([]);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // 컴포넌트가 처음 마운트될 때 한 번 실행
  // config가 없으면(직접 URL 접근 등) 메인으로 리다이렉트
  useEffect(() => {
    if (!config) {
      navigate('/', { replace: true });
      return;
    }
    // duration(분) * 60 = 총 초로 변환해서 타이머 초기화
    dispatch({ type: 'INIT', payload: config.duration * 60 });
  }, []);

  // paused 또는 finished 상태가 바뀔 때마다 타이머(setInterval) 재설정
  useEffect(() => {
    if (!config) return;
    if (state.paused || state.finished) {
      // 일시정지 or 완료 상태면 타이머 멈춤
      clearInterval(intervalRef.current);
    } else {
      // 1000ms(1초)마다 TICK 액션을 보내 remaining을 1씩 감소
      intervalRef.current = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    }
    // cleanup: 다음 effect 실행 전 또는 언마운트 시 타이머 정리
    return () => clearInterval(intervalRef.current);
  }, [state.paused, state.finished]);

  // paused 상태가 바뀔 때 video + 배경 오디오 동시 제어
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

  // config가 아직 없으면 아무것도 렌더링하지 않음 (리다이렉트 대기 중)
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
      {/* 상단 컨트롤 바 */}
      <div className="flex items-center justify-between px-6 py-3 bg-black/40 backdrop-blur-sm">
        <span className="text-white/50 text-sm font-medium">
          🌿 Study With Dongsoop
        </span>

        {/* 타이머: font-mono로 숫자 너비를 고정해 숫자가 바뀌어도 레이아웃이 흔들리지 않음 */}
        <span className="text-white text-lg font-mono font-bold tabular-nums">
          {formatTime(state.remaining)}
        </span>

        <div className="flex items-center gap-4">
          {/* 배경 오디오 토글 + 볼륨 슬라이더 */}
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

          {/* 재생/일시정지 */}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}
            className="text-white/60 hover:text-white text-xl transition-colors duration-200"
          >
            {state.paused ? '▶' : '⏸'}
          </button>

          {/* 종료 */}
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

      {/* 배경 오디오 — 렌더링 없음. public/bgm.mp3 파일을 넣으면 동작 */}
      <audio ref={audioRef} src="/forest_rain_bgm.mp3" loop />

      {/* 영상 그리드 - flex-1로 남은 공간 전체를 채움 */}
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
              // videoUrl이 없을 때(서버 연결 전) 보여줄 플레이스홀더
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-sage/20 to-leaf/10">
                <span className="text-6xl animate-float">🌿</span>
              </div>
            )}

            {/* 줌 스타일 네임태그 - absolute로 영상 위에 겹쳐서 표시 */}
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-md">
              {video.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
