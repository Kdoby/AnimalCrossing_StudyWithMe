import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// ES Module에서 __dirname 대체
const UPLOADS_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../uploads",
);

// 저장 위치와 파일명 규칙: 충돌 방지를 위해 타임스탬프 + 난수로 파일명 생성
const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});

const limits = { fileSize: 50 * 1024 * 1024 }; // 50MB

// 주민 영상 업로드: video 필드 1개, 영상 파일만 허용
export const uploadVideo = multer({
  storage,
  limits,
  fileFilter: (req, file, cb) => {
    const allowed =
      file.mimetype.startsWith("video/") || file.mimetype.startsWith("image/");
    if (allowed) cb(null, true);
    else cb(new Error("영상 또는 이미지 파일만 업로드 가능합니다."));
  },
}).fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

// 배경음악 업로드: audio 필드 1개, 오디오 파일만 허용
export const uploadAudio = multer({
  storage,
  limits,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("audio/")) cb(null, true);
    else cb(new Error("오디오 파일만 업로드 가능합니다."));
  },
}).fields([{ name: "audio", maxCount: 1 }]);

// 컨셉 영상 업로드: video + thumbnail 필드, 영상/이미지 모두 허용
export const uploadConceptVideo = multer({
  storage,
  limits,
  fileFilter: (req, file, cb) => {
    const allowed =
      file.mimetype.startsWith("video/") || file.mimetype.startsWith("image/");
    if (allowed) cb(null, true);
    else cb(new Error("영상 또는 이미지 파일만 업로드 가능합니다."));
  },
}).fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);
