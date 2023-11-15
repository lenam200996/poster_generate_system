import { EatingPlacesEnum } from "../enum"

export const yearOptions = [
  { label: "2030", value: "2030" },
  { label: "2029", value: "2029" },
  { label: "2028", value: "2028" },
  { label: "2027", value: "2027" },
  { label: "2026", value: "2026" },
  { label: "2025", value: "2025" },
  { label: "2024", value: "2024" },
  { label: "2023", value: "2023" },
  { label: "2022", value: "2022" },
]

export const monthOptions = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "10", value: "10" },
  { label: "11", value: "11" },
  { label: "12", value: "12" },
]

export const documentSizeOptions = [
  { label: "1", value: "ONE_ONE" },
  { label: "1/2", value: "ONE_TWO" },
  { label: "1/4", value: "ONE_FOUR" },
]

export const pcTypeOptions = [
  { label: "win", value: "WIN" },
  { label: "mac", value: "MAC" },
]

export const inDesignVersionOptions = [
  { label: "InDesign 2023", value: "InDesign 2023" },
  { label: "InDesign 2022", value: "InDesign 2022" },
  { label: "InDesign 2021", value: "InDesign 2021" },
  { label: "InDesign 2020", value: "InDesign 2020" },
]

export const orderOptions = [
  { label: "作成順", value: "created" },
  { label: "更新日時順", value: "updated" },
]

export const mediaOptions = [
  { label: "ゆこゆこ本誌", value: "MAGAZINE" },
  { label: "テスト", value: "TEST" },
]

export const taxOptions = [
  { label: "税込", value: "TAX_INCLUDED" },
  { label: "税抜", value: "TAX_EXCLUDED" },
]

// NORMAL: 通常宿
// COMMON: 共通
// SELECTION: セレクション
// PHOTO: 写真ユニット
export const categoryOptions = [
  { label: "通常宿", value: "NORMAL" },
  { label: "共通", value: "COMMON" },
  { label: "セレクション", value: "SELECTION" },
  { label: "写真ユニット", value: "PHOTO" },
]

export const columnCategoryOptions = [
  { key: "NORMAL", label: "プランコラム", value: "1" },
  { key: "NORMAL", label: "お品書きコラム", value: "2" },
  { key: "NORMAL", label: "選べる客室コラム", value: "3" },
  {
    key: "NORMAL",
    label: "おすすめオプションコラム",
    value: "4",
  },
  { key: "NORMAL", label: "各プラン共通コラム", value: "5" },
  { key: "NORMAL", label: "ゆこ得コラム", value: "6" },
  {
    key: "COMMON",
    label: "宿からのお知らせコラム",
    value: "7",
  },
  { key: "COMMON", label: "宿からの声コラム", value: "8" },
  { key: "COMMON", label: "周辺情報コラム", value: "9" },
  {
    key: "COMMON",
    label: "おすすめポイントコラム",
    value: "10",
  },
  { key: "COMMON", label: "ご褒美コラム", value: "11" },
  { key: "COMMON", label: "注目宿コラム", value: "12" },
  { key: "COMMON", label: "泊まった方の声", value: "13" },
  { key: "COMMON", label: "企画コラム", value: "14" },
  { key: "SELECTION", label: "プランコラム", value: "15" },
  { key: "SELECTION", label: "お品書きコラム", value: "16" },
  { key: "SELECTION", label: "選べる客室コラム", value: "17" },
  { key: "SELECTION", label: "ゆこ得コラム", value: "18" },
  {
    key: "SELECTION",
    label: "おすすめオプションコラム",
    value: 19,
  },
  {
    key: "SELECTION",
    label: "各プラン共通コラム",
    value: "20",
  },
  {
    key: "SELECTION",
    label: "滞在中のおもてなしコラム",
    value: "21",
  },
  {
    key: "SELECTION",
    label: "セレクトポイントコラム",
    value: "22",
  },
  {
    key: "PHOTO",
    label: "写真ユニット",
    value: "23",
  },
  {
    key: "PHOTO",
    label: "カスタム画像",
    value: "24",
  },
]

export const eatingPlacesOptions = [
  { label: "未設定", value: "" },
  { label: "なし", value: EatingPlacesEnum.None },
  { label: "会場食", value: EatingPlacesEnum.Restaurant },
  { label: "個室会場食", value: EatingPlacesEnum.PrivateRestaurant },
  { label: "部屋食", value: EatingPlacesEnum.Guestroom },
  {
    label: "会場食または個室会場食",
    value: EatingPlacesEnum.RestaurantAndPrivateRestaurant,
  },
  {
    label: "会場食または部屋食",
    value: EatingPlacesEnum.RestaurantAndGuestroom,
  },
  {
    label: "部屋食または個室会場食",
    value: EatingPlacesEnum.GuestroomAndPrivateRestaurant,
  },
]

export const booleanOptions = [
  { label: "", value: "false" },
  { label: "●", value: "true" },
]

export const endIndexStatusOptions = [
  { label: "", value: "NONE" },
  { label: "▲", value: "PARTIAL" },
  { label: "●", value: "FULL" },
]
