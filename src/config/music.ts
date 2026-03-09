// 音乐播放列表配置
// 把音乐文件放在 /public/music/ 文件夹里
// 然后在下面添加歌曲信息

export interface MusicTrack {
  name: string        // 歌曲名（显示用）
  url: string         // 文件路径，格式：/music/文件名.扩展名
  artist?: string     // 艺术家（可选）
}

// ========================================
// 在这里添加你的音乐
// ========================================
export const MUSIC_PLAYLIST: MusicTrack[] = [
  {
    name: 'Reminiscence',
    url: '/music/Reminiscence.ogg',
    artist: 'Pixabay'
  },
  // 添加更多音乐，例如：
  // {
  //   name: '我的歌曲1',
  //   url: '/music/song1.mp3',
  //   artist: '艺术家名'
  // },
  // {
  //   name: '我的歌曲2', 
  //   url: '/music/song2.mp3',
  //   artist: '艺术家名'
  // },
]

// 获取播放列表
export function getPlaylist(): MusicTrack[] {
  if (MUSIC_PLAYLIST.length === 0) {
    return [
      {
        name: '暂无音乐',
        url: '',
        artist: '请添加音乐到 /public/music/ 文件夹'
      }
    ]
  }
  return MUSIC_PLAYLIST
}
