# 프론트엔드 개발 원칙

## 파일 구조
- `components/` — 2개 이상의 페이지에서 쓰이거나, 독립적인 역할이 있는 UI는 반드시 분리. 각 컴포넌트는 디렉토리 단위로 구성 (예: `components/Button/index.jsx`)
- `pages/` — 레이아웃 조합과 상태 관리에만 집중. UI 세부 구현은 컴포넌트에 위임. 디렉토리 단위로 구성 (예: `pages/Gallery/index.jsx`)
- `hooks/` — 컴포넌트에서 로직이 복잡해지면 커스텀 훅으로 추출
- `reducers/` — `useReducer`에 사용하는 리듀서 함수 모음 (예: `playerReducer.js`)
- `services/` — API 호출 코드. 도메인별 파일로 분리 (예: `videoService.js`, `conceptVideoService.js`)
- `constant/` — 앱 전역에서 쓰는 상수 (예: `durations.js`)
- `lib/` — axios 인스턴스 등 공통 유틸리티 (예: `fetcher.js`)
- `layouts/` — 여러 페이지가 공유하는 레이아웃 컴포넌트
- `assets/` — 이미지·오디오 등 정적 파일만

## 스타일
- 인라인 `style={{ color: ... }}` 금지. 색상은 `index.css`의 `@theme`에 토큰으로 등록하고 Tailwind 유틸리티 클래스로 사용
- 새로운 색상이 필요하면 `@theme`에 추가 후 클래스로 적용
- 반응형은 Tailwind의 `sm:` / `md:` 브레이크포인트 기준으로 작성

## 컴포넌트 설계
- props는 명시적으로. 암묵적인 전역 상태나 컨텍스트 남용 금지
- variant / size 패턴으로 다형성 처리 (예: `<Button variant="secondary" size="lg">`)
- 선택된 영상 목록, 공부 시간 설정값 등 전역 공유 상태는 Context API 또는 Zustand로 관리

## 인터랙션 & 디자인 품질
- 모든 클릭 가능한 요소에 hover/active 피드백 필수
- 카드류 컴포넌트는 `shadow-md` 기본, hover 시 `shadow-xl` + 미세한 이동 효과 (`hover:-translate-y-2`)
- 트랜지션은 `transition-all duration-300` 기본값
- 로딩·에러·빈 상태(empty state)를 항상 처리

## 라우팅

React Router v6 사용. `createBrowserRouter` + `RouterProvider` 방식으로 설정. 라우트 정의는 `src/router.jsx` 한 곳에서 관리.

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | `pages/Home` | 모드 선택 화면 (줌공부 / 컨셉영상) |
| `/zoom` | `pages/Gallery` | 주민 영상 갤러리. 멀티 셀렉트 |
| `/concept` | `pages/ConceptGallery` | 컨셉 영상 갤러리. 싱글 셀렉트 |
| `/study-room` | `pages/StudyRoom` | 공부방 화면 (줌/싱글 공통) |
| `/upload` | `pages/Upload` | 영상 업로드 |

- 중첩 레이아웃은 Outlet을 활용하고, 공통 레이아웃은 `layouts/` 에 분리
- 동적 라우트 파라미터(`/video/:id`)는 `useParams`로만 접근

## API 레이어 / 데이터 페칭
- `src/services/` 에 도메인별 파일로 분리
  - `videoService.js` — 주민 영상 CRUD (`GET /videos`, `POST /videos/upload`)
  - `conceptVideoService.js` — 컨셉 영상 조회 (`GET /concept-videos`)
- axios 인스턴스는 `src/lib/fetcher.js` 에서 단일 생성 후 재사용 (baseURL, timeout, 공통 헤더 설정)
- 서비스 함수는 axios 호출만 담당. 에러 변환·상태 관리는 훅에서 처리
- 서버 상태(데이터 페칭·캐싱)는 React Query(`@tanstack/react-query`) 사용. `useQuery` / `useMutation` 으로 로딩·에러 상태를 컴포넌트에서 직접 관리하지 않음
- 쿼리 키는 `src/services/queryKeys.js` 에 상수로 정의 (`videos`, `conceptVideos` 네임스페이스)

## 에러 핸들링
- 페이지 단위로 `ErrorBoundary` 적용. 전역 fallback UI는 `components/ErrorFallback.jsx`
- API 에러는 axios interceptor에서 공통 처리 (401, 500 등 HTTP 상태 코드별 분기)
- 사용자에게 노출하는 에러 메시지는 별도 상수 파일(`src/constants/errorMessages.js`)로 관리
- `try/catch` 는 비동기 이벤트 핸들러에서만 사용. 렌더링 중 에러는 ErrorBoundary가 담당

## 성능 최적화
- 페이지 컴포넌트는 `React.lazy` + `Suspense` 로 코드 스플리팅
- `React.memo` 는 props가 자주 바뀌지 않는 순수 표시용 컴포넌트에만 적용. 남용 금지
- `useMemo` / `useCallback` 은 실제 렌더링 병목이 확인된 경우에만 사용
- 영상·이미지처럼 무거운 리소스는 `loading="lazy"` 또는 Intersection Observer로 지연 로드

## 공부방 구현 포인트

### 공부 모드 & 페이지 간 데이터 전달
- 각 갤러리에서 영상 선택 + 공부 시간 선택 후 `/study-room`으로 navigate
- navigate state 형태: `{ videos: Video[], duration: number, mode: 'zoom' | 'single' }`
  - `mode: 'zoom'` — `/zoom`에서 진입. 멀티 셀렉트, 줌 그리드 레이아웃
  - `mode: 'single'` — `/concept`에서 진입. 싱글 셀렉트, 풀스크린 레이아웃
- StudyRoom은 videos 배열 길이로 그리드를 자동 결정하므로 mode로 레이아웃을 별도 분기하지 않음
- 공부 완료 / 종료(✕) 시 mode에 따라 귀환: `'single'` → `/concept`, 그 외 → `/zoom`

### 영상 재생
- HTML5 `<video>` 태그, `loop` 속성으로 반복 재생
- 초기 `muted` 처리 (브라우저 자동재생 정책 대응), 사운드 on/off 토글 제공

### 줌 레이아웃
- CSS Grid로 영상 수에 따라 동적 레이아웃 적용
- 줌 스타일: 어두운 배경(`#1C1C1C`), 흰색 네임태그, 둥근 테두리
- 영상 수 → 그리드: 1개=풀스크린, 2개=1×2, 3~4개=2×2, 5개+=갤러리 뷰

### 타이머
- 공부 시간을 초 단위로 카운트다운 (`playerReducer` 재사용)
- 종료 시 완료 화면 오버레이

### 서버 미연결 시 fallback
- 주민 영상: Gallery 컴포넌트 내 `FALLBACK_VIDEOS` 상수로 대체
- 컨셉 영상: ConceptGallery 컴포넌트 내 `FALLBACK_CONCEPT_VIDEOS` 상수로 대체
- `URL.createObjectURL`로 로컬 Blob URL 생성 가능. 메타데이터는 LocalStorage 또는 IndexedDB에 저장
