export const queryKeys = {
  videos: {
    all: ['videos'],
    list: (params) => ['videos', 'list', params],
  },
  conceptVideos: {
    all: ['conceptVideos'],
    list: (params) => ['conceptVideos', 'list', params],
  },
  audio: {
    list: () => ['audio', 'list'],
  },
};
