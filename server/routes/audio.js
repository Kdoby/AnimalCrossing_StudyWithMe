import { Router } from 'express';

const router = Router();

const AUDIO_LIST = [
  { value: 'none', label: '없음' },
  { value: 'white-noise', label: '백색소음' },
  { value: 'cafe', label: '카페 소음' },
  { value: 'fireplace', label: '장작소리' },
  { value: 'rain', label: '빗소리' },
];

router.get('/', (req, res) => {
  res.json(AUDIO_LIST);
});

export default router;
