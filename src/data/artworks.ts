export interface Artwork {
  id: string;
  title: string;
  poeticalTitle: string;
  description: string;
  poet: string;
  poem: string;
  imageUrl: string;
  year: string;
}

export const artworks: Artwork[] = [
  {
    id: '1',
    title: '山水之间',
    poeticalTitle: '烟雨江南',
    description: '云雾缭绕的山峦，若隐若现，如同泼墨山水画中的意境。',
    poet: '苏轼',
    poem: '水光潋滟晴方好，山色空蒙雨亦奇。\n欲把西湖比西子，淡妆浓抹总相宜。',
    imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80',
    year: '2024'
  },
  {
    id: '2',
    title: '墨竹',
    poeticalTitle: '清风徐来',
    description: '竹叶在风中摇曳，墨色浓淡相宜，展现竹子的坚韧与气节。',
    poet: '郑燮',
    poem: '咬定青山不放松，立根原在破岩中。\n千磨万击还坚劲，任尔东西南北风。',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    year: '2024'
  },
  {
    id: '3',
    title: '秋江独钓',
    poeticalTitle: '枫桥夜泊',
    description: '秋水共长天一色，一叶扁舟，独自垂钓，意境深远。',
    poet: '张继',
    poem: '月落乌啼霜满天，江枫渔火对愁眠。\n姑苏城外寒山寺，夜半钟声到客船。',
    imageUrl: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=800&q=80',
    year: '2023'
  },
  {
    id: '4',
    title: '梅花傲雪',
    poeticalTitle: '暗香浮动',
    description: '白雪覆盖的山崖上，梅花独自绽放，香气袭人。',
    poet: '王安石',
    poem: '墙角数枝梅，凌寒独自开。\n遥知不是雪，为有暗香来。',
    imageUrl: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=800&q=80',
    year: '2023'
  },
  {
    id: '5',
    title: '云海翻涌',
    poeticalTitle: '望岳',
    description: '云海如潮水般翻涌，山峰若隐若现，气势磅礴。',
    poet: '杜甫',
    poem: '会当凌绝顶，一览众山小。\n荡胸生层云，决眦入归鸟。',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    year: '2024'
  },
  {
    id: '6',
    title: '荷塘月色',
    poeticalTitle: '采莲曲',
    description: '月光下的荷塘，荷叶田田，荷花娇羞欲语。',
    poet: '李商隐',
    poem: '荷叶生时春恨生，荷叶枯时秋恨成。\n深知身在情长在，怅望江头江水声。',
    imageUrl: 'https://images.unsplash.com/photo-1437952841905-34d1c04528da?w=800&q=80',
    year: '2023'
  }
];
