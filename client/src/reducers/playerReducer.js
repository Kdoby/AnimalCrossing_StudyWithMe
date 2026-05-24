// 공부방 타이머의 초기 상태
export const initialPlayerState = {
  remaining: 0,      // 남은 시간 (초 단위)
  paused: false,     // 일시정지 여부
  finished: false,   // 공부 완료 여부
};

// useReducer에 쓰이는 순수 함수 - state와 action을 받아 새 state를 반환
// 직접 state를 바꾸지 않고 항상 새 객체를 반환해야 함 (불변성)
export function playerReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      // 공부방 진입 시 타이머 초기화. payload에 총 시간(초)이 담겨옴
      return { ...initialPlayerState, remaining: action.payload };

    case 'TICK':
      // 1초마다 호출. 0이 되면 finished를 true로 바꿔 완료 화면으로 전환
      if (state.remaining <= 1) return { ...state, remaining: 0, finished: true };
      return { ...state, remaining: state.remaining - 1 };

    case 'TOGGLE_PAUSE':
      // paused를 반전시켜 재생/일시정지 토글
      return { ...state, paused: !state.paused };

    default:
      return state;
  }
}
