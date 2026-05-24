# 백엔드 개발 원칙

## API 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/videos/samples` | 랜딩용 샘플 영상 목록 |
| POST | `/api/videos/upload` | 주민 영상 업로드 |
| GET | `/api/videos/:id` | 주민 영상 스트리밍 |
| GET | `/api/concept-videos` | 컨셉 영상 목록 조회 |
| POST | `/api/concept-videos/upload` | 컨셉 영상 업로드 |
| GET | `/api/concept-videos/:id` | 컨셉 영상 스트리밍 |
| GET | `/api/audio` | 배경음악 목록 |

## DB 스키마

### videos 테이블
- `id` INT PK AUTO_INCREMENT
- `filename` VARCHAR(255)
- `original_name` VARCHAR(255)
- `duration` FLOAT (초 단위)
- `is_sample` BOOLEAN DEFAULT false
- `created_at` TIMESTAMP

### concept_videos 테이블
- `id` INT PK AUTO_INCREMENT
- `title` VARCHAR(255) — 장소/분위기 이름 (예: 카페 공부방, 도서관 저녁)
- `filename` VARCHAR(255) — 영상 파일명
- `original_name` VARCHAR(255)
- `thumbnail_filename` VARCHAR(255) NULL
- `created_at` TIMESTAMP

## 개발 시 주의사항

- 영상 파일 크기 제한: 50MB
- 영상 길이 제한: 15초 (프론트에서 검증, 서버는 파일만 저장)
- 두 유형 모두 루프 재생용 단편 클립. 긴 영상은 업로드 불가
- 로그인 없이 모든 기능 사용 가능 (비회원 서비스)
- 배경음악 파일은 `client/src/assets/audio/`에 위치
- 업로드된 영상은 `server/uploads/`에 임시 저장 (videos, concept_videos 공용)
