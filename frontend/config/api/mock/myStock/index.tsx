export type PageType = "plan" | "halfTitlePage" | "advertising" | "information"
export type ManuscriptType = "plan" | "chartTitle" | "smallAssembly"
export type Order = "1" | "2" | "3" | "4"
export type MediaType = "MAGAZINE" | "TEST"
export type Layout = "1" | "1/2" | "1/4"

export type Alias = Manuscript

export type Manuscript = {
  id: string
  manuscriptId: string
  size: "1" | "1/2" | "1/4"
  type: ManuscriptType
  hotelCode?: string
  hotelName?: string
  status?: string
  manager?: string
  changer?: string
  order: "1" | "2" | "3" | "4"
  image?: string
  lastUpdated: string
  mediaType: {
    code: string
    name: string
    kana: string
    description: string
    location: string
  }
  alias?: Alias[]
}

export type Page = {
  id: number
  setting?: {
    type: PageType
    planLayout?: "a" | "b" | "c" | "d" | "e"
  }
  data: Manuscript[]
}

export const userCognitoMock: string = "AAAXXXCCVCC"

export type Project = {
  id: number
  issueYear: number
  issueMonth: number
  mediaType: MediaType
  created: string
  updated: string
  modifiedAt: string
  createdAt: string
  manuscripts: Manuscript[]
}

export const project: Project = {
  id: 1,
  issueYear: 2022,
  issueMonth: 10,
  mediaType: "MAGAZINE",
  created: "2021-12-05T06:25:24Z",
  updated: "2022-08-16T06:25:24Z",
  modifiedAt: "2022-08-16T06:25:24Z",
  createdAt: "2021-12-05T06:25:24Z",
  manuscripts: [
    {
      id: "1",
      manuscriptId: "Z202210ES00001",
      type: "plan",
      size: "1",
      hotelCode: "1111",
      hotelName: "ソラリア西鉄ホテル銀座",
      status: "制作中",
      changer: "山田 太郎",
      manager: "長谷川 あゆみ",
      order: "1",
      image: "/assets/plan-a.png",
      lastUpdated: "2023-08-19T12:41:00Z",
      mediaType: {
        code: "magazine",
        name: "ゆこゆこ本誌",
        kana: "ユコユコホンシ",
        description: "本誌の説明",
        location: "中国・四国版",
      },
    },
  ],
}

export const projects: Project[] = [
  {
    id: 1,
    issueYear: 2022,
    issueMonth: 10,
    mediaType: "MAGAZINE",
    created: "2022-12-25T06:25:24Z",
    updated: "2022-12-26T06:25:24Z",
    modifiedAt: "2022-08-16T06:25:24Z",
    createdAt: "2021-12-05T06:25:24Z",
    manuscripts: [
      {
        id: "1",
        manuscriptId: "Z202210ES20001",
        type: "plan",
        size: "1/2",
        hotelCode: "1111",
        hotelName: "ソラリア西鉄ホテル銀座",
        status: "制作中",
        changer: "山田 太郎",
        manager: "長谷川 あゆみ",
        order: "1",
        image: "/assets/plan-a.png",
        lastUpdated: "2023-08-19T12:41:00Z",
        mediaType: {
          code: "magazine",
          name: "ゆこゆこ本誌",
          kana: "ユコユコホンシ",
          description: "本誌の説明",
          location: "中国・四国",
        },
        alias: [
          {
            id: "10",
            manuscriptId: "Z202206ES00002",
            type: "plan",
            size: "1/2",
            hotelCode: "1111",
            hotelName: "ソラリア西鉄ホテル銀座",
            status: "制作中",
            changer: "山田 太郎",
            manager: "長谷川 あゆみ",
            order: "1",
            image: "/assets/plan-a.png",
            lastUpdated: "2023-08-19T12:41:00Z",
            mediaType: {
              code: "magazine",
              name: "ゆこゆこ本誌",
              kana: "ユコユコホンシ",
              description: "本誌の説明",
              location: "北海道",
            },
          },
        ],
      },
      {
        id: "2",
        manuscriptId: "Z202210ES20002",
        type: "plan",
        size: "1/2",
        hotelCode: "2222",
        hotelName: "ゆこゆこ温泉",
        status: "制作中",
        changer: "山田 太郎",
        manager: "長谷川 あゆみ",
        order: "2",
        image: "/assets/plan-a.png",
        lastUpdated: "2023-08-19T12:41:00Z",
        mediaType: {
          code: "magazine",
          name: "ゆこゆこ本誌",
          kana: "ユコユコホンシ",
          description: "本誌の説明",
          location: "北海道",
        },
      },
    ],
  },
  {
    id: 2,
    issueYear: 2022,
    issueMonth: 10,
    mediaType: "MAGAZINE",
    created: "2022-12-22T06:25:24Z",
    updated: "2022-12-23T06:25:24Z",
    modifiedAt: "2022-08-16T06:25:24Z",
    createdAt: "2021-12-05T06:25:24Z",
    manuscripts: [
      {
        id: "3",
        manuscriptId: "Z202210ES30001",
        type: "plan",
        size: "1/4",
        hotelCode: "1111",
        hotelName: "ソラリア西鉄ホテル銀座",
        status: "未着手",
        changer: "山田 太郎",
        manager: "長谷川 あゆみ",
        order: "1",
        lastUpdated: "2023-08-19T12:41:00Z",
        mediaType: {
          code: "magazine",
          name: "ゆこゆこ本誌",
          kana: "ユコユコホンシ",
          description: "本誌の説明",
          location: "中国・四国",
        },
      },
    ],
  },
  {
    id: 3,
    issueYear: 2021,
    issueMonth: 10,
    mediaType: "MAGAZINE",
    created: "2021-12-22T06:25:24Z",
    updated: "2021-12-23T06:25:24Z",

    modifiedAt: "2022-08-16T06:25:24Z",
    createdAt: "2021-12-05T06:25:24Z",
    manuscripts: [
      {
        id: "4",
        manuscriptId: "Z202210ES30001",
        type: "plan",
        size: "1/4",
        hotelCode: "1111",
        hotelName: "ソラリア西鉄ホテル銀座",
        status: "制作中",
        changer: "山田 太郎",
        manager: "長谷川 あゆみ",
        order: "1",
        image: "/assets/plan-a.png",
        lastUpdated: "2023-08-19T12:41:00Z",
        mediaType: {
          code: "magazine",
          name: "ゆこゆこ本誌",
          kana: "ユコユコホンシ",
          description: "本誌の説明",
          location: "北海道",
        },
      },
    ],
  },
]

export const editions = [
  { label: "北海道", value: "北海道" },
  { label: "東北", value: "東北" },
  { label: "上信越", value: "上信越" },
  { label: "北関東", value: "北関東" },
  { label: "関東", value: "関東" },
  { label: "東海", value: "東海" },
  { label: "関西", value: "関西" },
  { label: "北陸", value: "北陸" },
  { label: "東海・北陸", value: "東海・北陸" },
  { label: "関西・北陸", value: "関西・北陸" },
  { label: "中国・四国", value: "中国・四国" },
  { label: "九州", value: "九州" },
  { label: "テスト", value: "テスト" },
]

export const orderOptions = [
  { label: "作成順", value: "created" },
  { label: "年月号順", value: "year" },
]

export const manuscriptSizes = [
  { label: "指定なし", value: "" },
  { label: "1", value: "1" },
  { label: "1/2", value: "1/2" },
  { label: "1/4", value: "1/4" },
]
