export const priceMock = [
  {
    id: 1,
    name: "ベースプラン(【未使用】8畳和室)",
    hiddenName: "APIテスト",
    type: "10畳洋室（禁煙・喫煙お任せ）",
    options: [
      { name: "5名", id: 5 },
      { name: "4名", id: 4 },
      { name: "3名", id: 3 },
      { name: "2名", id: 2 },
      { name: "1名", id: 1 },
    ],
  },
  {
    id: 2,
    name: "ベースプラン(10畳洋室（禁煙・喫煙お任せ）)",
    hiddenName: "APIテスト",
    type: "【未使用】8畳和室",
    options: [
      { name: "5名", id: 5 },
      { name: "4名", id: 4 },
      { name: "3名", id: 3 },
      { name: "2名", id: 2 },
      { name: "1名", id: 1 },
    ],
  },
  {
    id: 3,
    name: "ベースプラン(【未使用】8畳和室)",
    hiddenName: "APIテスト",
    type: "和室",
    options: [
      { name: "5名", id: 5 },
      { name: "4名", id: 4 },
      { name: "3名", id: 3 },
      { name: "2名", id: 2 },
      { name: "1名", id: 1 },
    ],
  },
  {
    id: 4,
    name: "ベースプラン(10畳洋室（禁煙・喫煙お任せ）)",
    hiddenName: "APIテスト",
    type: "おまかせ客室（禁煙）",
    options: [
      { name: "5名", id: 5 },
      { name: "4名", id: 4 },
      { name: "3名", id: 3 },
      { name: "2名", id: 2 },
      { name: "1名", id: 1 },
    ],
  },
  {
    id: 5,
    name: "ベースプラン(【未使用】8畳和室)",
    hiddenName: "APIテスト",
    type: "おまかせ客室（禁煙）",
    options: [
      { name: "5名", id: 5 },
      { name: "4名", id: 4 },
      { name: "3名", id: 3 },
      { name: "2名", id: 2 },
      { name: "1名", id: 1 },
    ],
  },
  {
    id: 6,
    name: "ベースプラン(10畳洋室（禁煙・喫煙お任せ）)",
    hiddenName: "APIテスト",
    type: "【未使用】8畳和室",
    options: [
      { name: "5名", id: 5 },
      { name: "4名", id: 4 },
      { name: "3名", id: 3 },
      { name: "2名", id: 2 },
      { name: "1名", id: 1 },
    ],
  },
]

export const appearancePatternMock = [
  { name: "一室人数", id: 1, value: "A" },
  { name: "プラン名称", id: 2, value: "B" },
  { name: "××円増し/引き", id: 3, value: "D" },
  { name: "最低〜最大料金表示", id: 4, value: "E" },
  { name: "ヘッダ二段", id: 5, value: "C" },
]

export type Plan = {
  id: number // 対象プランID
  manual?: boolean // 手動編集許可フラグ
  options?: Array<number> // 一室人数
}

export type Plans = Array<Plan>
