type SmallAssembly = {
  id: string
  code: string
  size: string
  detail: string
}

export const smallAssemblies: SmallAssembly[] = [
  { id: "1", code: "Y01", size: "1/4", detail: "カレンダー10-12月" },
  { id: "1", code: "Y01", size: "1/4", detail: "カレンダー10-12月" },
  { id: "1", code: "Y01", size: "1/4", detail: "カレンダー10-12月" },
  { id: "1", code: "Y01", size: "1/4", detail: "カレンダー10-12月" },
]

// export const mockMealIcons = [
//   { label: "なし", value: "0" },
//   { label: "会場食", value: "1" },
//   { label: "個室会場食", value: "2" },
//   { label: "部屋食", value: "3" },
//   { label: "会場食または個室会場食", value: "4" },
//   { label: "会場食または部屋食", value: "5" },
//   { label: "部屋食または個室会場食", value: "6" },
// ]

export const breakfastIcons = [
  { label: "なし", value: "朝食アイコンOFF.jpg" },
  { label: "会場食", value: "朝食アイコン_会場食.jpg" },
  { label: "個室会場食", value: "朝食アイコン_個室会場食.jpg" },
  { label: "部屋食", value: "朝食アイコン_部屋食.jpg" },
  {
    label: "会場食または個室会場食",
    value: "朝食アイコン_会場食または個室会場食.jpg",
  },
  { label: "会場食または部屋食", value: "朝食アイコン_会場食または部屋食.jpg" },
  {
    label: "部屋食または個室会場食",
    value: "朝食アイコン_部屋食または個室会場食.jpg",
  },
]

export const dinnerIcons = [
  { label: "なし", value: "夕食アイコンOFF.jpg" },
  { label: "会場食", value: "夕食アイコン_会場食.jpg" },
  { label: "個室会場食", value: "夕食アイコン_個室会場食.jpg" },
  { label: "部屋食", value: "夕食アイコン_部屋食.jpg" },
  {
    label: "会場食または個室会場食",
    value: "夕食アイコン_会場食または個室会場食.jpg",
  },
  { label: "会場食または部屋食", value: "夕食アイコン_会場食または部屋食.jpg" },
  {
    label: "部屋食または個室会場食",
    value: "夕食アイコン_部屋食または個室会場食.jpg",
  },
]

export const elevatorIcons = [
  {
    label: "●",
    value: "elevatorアイコンON.jpg",
  },
]

// export const mockElevators = [
//   { label: "●", value: "1" },
//   { label: "▲", value: "2" },
// ]

export const booklets = [
  {
    id: "1",
    pageNumber: "01",
    pageName: undefined,
    copies: undefined,
  },
  {
    id: "2",
    pageNumber: "02",
    pageName: undefined,
    copies: [
      {
        id: "Z202206ES00001",
        size: "1/4",
        hotelCode: "1111",
        hotelName: "ソラリア西鉄ホテル銀座",
        status: "未着手",
        changer: "山田 太郎",
        manager: "長谷川 あゆみ",
      },
      {
        id: "Z202206ES00002",
        size: "1/4",
        hotelCode: "2222",
        hotelName: "グランヴィリオホテル宮島和蔵 ルートインホテルズ",
        status: "未着手",
        changer: "山田 太郎",
        manager: "長谷川 あゆみ",
      },
    ],
  },
]

export const managers = [
  {
    label: "長谷川 あゆみ",
    value: "長谷川 あゆみ",
  },
  {
    label: "山田 太郎",
    value: "山田 太郎",
  },
  {
    label: "大沢 貴紀",
    value: "大沢 貴紀",
  },
]

export const pageTypes = [
  { label: "宿原稿", value: "HOTEL_MANUSCRIPT" },
  { label: "中扉", value: "CHAPTER_TITLE_PAGE" },
  { label: "広告", value: "ADVERTISEMENT" },
  { label: "情報", value: "INFORMATION" },
]

export const lodgingPlanDesignTemplates = [
  {
    id: 1,
    recommend: true,
    name: "本誌1/2 松茸コラム 2023年10月号",
    image: "/assets/design-template-sample.png",
  },
  {
    id: 2,
    recommend: true,
    name: "本誌1/2 松茸コラム 2023年10月号",
    image: "/assets/design-template-sample.png",
  },
  {
    id: 3,
    recommend: true,
    name: "本誌1/2 松茸コラム 2023年10月号",
    image: "/assets/design-template-sample.png",
  },
  {
    id: 4,
    recommend: true,
    name: "本誌1/2 松茸コラム 2023年10月号",
    image: "/assets/design-template-sample.png",
  },
  {
    id: 5,
    recommend: true,
    name: "本誌1/2 松茸コラム 2023年10月号",
    image: "/assets/design-template-sample.png",
  },
  {
    id: 6,
    recommend: true,
    name: "本誌1/2 松茸コラム 2023年10月号",
    image: "/assets/design-template-sample.png",
  },
  {
    id: 7,
    recommend: true,
    name: "本誌1/2 松茸コラム 2023年10月号",
    image: "/assets/design-template-sample.png",
  },
  {
    id: 8,
    recommend: true,
    name: "本誌1/2 松茸コラム 2023年10月号",
    image: "/assets/design-template-sample.png",
  },
  {
    id: 9,
    recommend: true,
    name: "本誌1/2 松茸コラム 2023年10月号",
    image: "/assets/design-template-sample.png",
  },
  {
    id: 10,
    recommend: true,
    name: "本誌1/2 松茸コラム 2023年10月号",
    image: "/assets/design-template-sample.png",
  },
  {
    id: 11,
    recommend: true,
    name: "本誌1/2 松茸コラム 2023年10月号",
    image: "/assets/design-template-sample.png",
  },
]
export const chartTitleTemplates = [
  {
    id: 1,
    recommend: false,
    name: "A01_M",
    image: "/assets/design-template-chart-title.png",
  },
  {
    id: 2,
    recommend: false,
    name: "A01_M",
    image: "/assets/design-template-chart-title.png",
  },
  {
    id: 3,
    recommend: false,
    name: "A01_M",
    image: "/assets/design-template-chart-title.png",
  },
  {
    id: 4,
    recommend: false,
    name: "A01_M",
    image: "/assets/design-template-chart-title.png",
  },
  {
    id: 5,
    recommend: false,
    name: "A01_M",
    image: "/assets/design-template-chart-title.png",
  },
  {
    id: 6,
    recommend: false,
    name: "A01_M",
    image: "/assets/design-template-chart-title.png",
  },
  {
    id: 7,
    recommend: false,
    name: "A01_M",
    image: "/assets/design-template-chart-title.png",
  },
  {
    id: 8,
    recommend: false,
    name: "A01_M",
    image: "/assets/design-template-chart-title.png",
  },
  {
    id: 9,
    recommend: false,
    name: "A01_M",
    image: "/assets/design-template-chart-title.png",
  },
  {
    id: 10,
    recommend: false,
    name: "A01_M",
    image: "/assets/design-template-chart-title.png",
  },
  {
    id: 11,
    recommend: false,
    name: "A01_M",
    image: "/assets/design-template-chart-title.png",
  },
]

export const smallAssemblyTemplates = [
  {
    id: 1,
    recommend: false,
    name: "あて原1003",
    image: "/assets/design-template-small-assembly.png",
  },
  {
    id: 2,
    recommend: false,
    name: "あて原1003",
    image: "/assets/design-template-small-assembly.png",
  },
  {
    id: 3,
    recommend: false,
    name: "あて原1003",
    image: "/assets/design-template-small-assembly.png",
  },
  {
    id: 4,
    recommend: false,
    name: "あて原1003",
    image: "/assets/design-template-small-assembly.png",
  },
  {
    id: 5,
    recommend: false,
    name: "あて原1003",
    image: "/assets/design-template-small-assembly.png",
  },
  {
    id: 6,
    recommend: false,
    name: "あて原1003",
    image: "/assets/design-template-small-assembly.png",
  },
  {
    id: 7,
    recommend: false,
    name: "あて原1003",
    image: "/assets/design-template-small-assembly.png",
  },
  {
    id: 8,
    recommend: false,
    name: "あて原1003",
    image: "/assets/design-template-small-assembly.png",
  },
  {
    id: 9,
    recommend: false,
    name: "あて原1003",
    image: "/assets/design-template-small-assembly.png",
  },
  {
    id: 10,
    recommend: false,
    name: "あて原1003",
    image: "/assets/design-template-small-assembly.png",
  },
  {
    id: 11,
    recommend: false,
    name: "あて原1003",
    image: "/assets/design-template-small-assembly.png",
  },
]

export const daishi: { value: string; label: string }[] = [...Array(9)].map(
  (_, i) => ({
    value: `a0${i}_r`,
    label: `A0${i}_R`,
  }),
)
