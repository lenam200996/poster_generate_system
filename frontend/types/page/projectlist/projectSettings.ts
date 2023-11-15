export type IconData = {
  file: File
  name: string
  path: string
}

export interface ProjectSettings {
  // 消費税
  consumptionTax?: string

  // 販売期間
  salesStartDate: string
  salesEndDate: string

  // 口コミ評価対象期間
  reviewRatingStartDate: string
  reviewRatingEndDate: string

  // ツメ見出し
  thumbIndexId?: number

  // 見出し
  headLineId?: number

  // 欄外下画像
  pageMountId?: number

  // 露天アイコン　あり
  openAirIconOn?: IconData

  // 露天アイコン　なし
  openAirIconOff?: IconData

  // かけ流しアイコン　あり
  freeFlowingIconOn?: IconData

  // かけ流しアイコン　なし
  freeFlowingIconOff?: IconData

  // エレベーターアイコン　あり
  elevatorIconOn?: IconData

  // エレベーターアイコン　なし
  elevatorIconOff?: IconData

  // 当日予約アイコン　あり
  sameDayReservationIconOn?: IconData

  // 当日予約アイコン　なし
  sameDayReservationIconOff?: IconData

  // 送迎有アイコン　あり
  pickUpAvailableIconOn?: IconData

  // 送迎有アイコン　なし
  pickUpAvailableIconOff?: IconData

  // 禁煙有アイコン　あり
  noSmokingIconOn?: IconData

  // 禁煙有アイコン　なし
  noSmokingIconOff?: IconData

  // 夕食　会場食
  dinnerVenueMeal?: IconData

  // 夕食　個室会場食
  dinnerPrivateRoomDining?: IconData

  // 夕食　部屋食
  dinnerRoomMeal?: IconData

  // 夕食　会場食または個室会場食
  dinnerVenueMealOorPrivateDiningRoom?: IconData

  // 夕食　会場食または部屋食
  dinnerVenueMealOrRoomService?: IconData

  // 夕食　部屋食または個室会場食
  dinnerRoomOrPrivateDiningRoom?: IconData

  // 夕食　なし
  dinnerNone?: IconData

  // 朝食　会場食
  breakfastVenueMeal?: IconData

  // 朝食　個室会場食
  breakfastPrivateRoomDining?: IconData

  // 朝食　部屋食
  breakfastRoomMeal?: IconData

  // 朝食　会場食または個室会場食
  breakfastVenueMealOorPrivateDiningRoom?: IconData

  // 朝食　会場食または部屋食
  breakfastVenueMealOrRoomService?: IconData

  // 朝食　部屋食または個室会場食
  breakfastRoomOrPrivateDiningRoom?: IconData

  // 朝食　なし
  breakfastNone?: IconData

  // 月号データ
  issueDataImage?: IconData
}

export const initialSettings: ProjectSettings = {
  salesStartDate: undefined,
  salesEndDate: undefined,
  reviewRatingStartDate: undefined,
  reviewRatingEndDate: undefined,
  thumbIndexId: undefined,
  headLineId: undefined,
  pageMountId: undefined,
  openAirIconOn: undefined,
  openAirIconOff: undefined,
  freeFlowingIconOn: undefined,
  freeFlowingIconOff: undefined,
  elevatorIconOn: undefined,
  elevatorIconOff: undefined,
  sameDayReservationIconOn: undefined,
  sameDayReservationIconOff: undefined,
  pickUpAvailableIconOn: undefined,
  pickUpAvailableIconOff: undefined,
  noSmokingIconOn: undefined,
  noSmokingIconOff: undefined,
  dinnerVenueMeal: undefined,
  dinnerPrivateRoomDining: undefined,
  dinnerRoomMeal: undefined,
  dinnerVenueMealOorPrivateDiningRoom: undefined,
  dinnerVenueMealOrRoomService: undefined,
  dinnerRoomOrPrivateDiningRoom: undefined,
  dinnerNone: undefined,
  breakfastVenueMeal: undefined,
  breakfastPrivateRoomDining: undefined,
  breakfastRoomMeal: undefined,
  breakfastVenueMealOorPrivateDiningRoom: undefined,
  breakfastVenueMealOrRoomService: undefined,
  breakfastRoomOrPrivateDiningRoom: undefined,
  breakfastNone: undefined,
  issueDataImage: undefined,
}
