import { DocumentContentResponseDtoBikingDinnerStatusEnum } from "@/openapi"

export type PriceStandardType = {
  // 販売期間 販売開始日
  startSalesData?: string

  // 販売開始日 販売終了日
  endSalesDate?: string

  // メインプラン
  mainPlan?: {
    entryPlanId: string
    code: string
    name: string
    hotelCode: string
    room_code: string
  }

  // メインプラン部屋名称 プラン名変更
  travelPlanNameOverwriteText: string

  // メインプラン部屋変更　プラン名変更　使用する
  travelPlanNameOverwriteVisibility: boolean

  // 料金表
  priceTable?: Array<number>

  // 入湯税
  bashTaxes?: Array<number>

  // 入湯税　表示
  bathTaxVisibility: boolean

  // 入湯税　改行
  bathTaxBreakLine: boolean

  // 子供料金
  childFare: string
  // 子供料金
  childrenFareBreakLine: boolean

  // 子供料金　表示
  childrenFareVisibility: boolean

  // 子供料金　改行
  breakChildFare: boolean

  // 支払方法
  isPayCredit: boolean

  // 支払方法　表示
  payMethodVisibility: boolean

  // 支払方法　改行
  payMethodBreakLine: boolean

  // 当日予約
  sameDayReservationText: string

  // 当日予約　表示
  sameDayReservationVisibility: boolean

  // 当日予約　改行
  sameDayReservationBreakLine: boolean

  // チェックイン/アウト
  checkoutTime: string

  // チェックイン/アウト
  checkInStartTime: string

  // チェックイン/アウト　表示
  checkInOutVisibility: boolean

  // チェックイン/アウト　改行
  checkInOutBreakLine: boolean

  // プランのお部屋
  planRoomText: string

  // プランのお部屋　表示
  planRoomVisibility: boolean

  // プランのお部屋　改行
  planRoomBreakLine: boolean

  // お風呂
  bathText: string

  // お風呂　表示
  bathVisibility: boolean

  // お風呂　改行
  bathBreakLine: boolean
  //入湯税
  bathTaxElementary: number
  //入湯税
  bathTaxInfant: number
  //入湯税
  bathTaxAdult: number

  // 泉質
  hotSpringQualityText: string

  // 泉質　使用
  hotSpringQualityVisibility: boolean
  //夕食バイキング
  bikingDinnerStatus: DocumentContentResponseDtoBikingDinnerStatusEnum
  // ペット可
  petAllowedStatus: DocumentContentResponseDtoBikingDinnerStatusEnum
  // ベッド
  bedStatus: DocumentContentResponseDtoBikingDinnerStatusEnum
  // 夕食部屋食
  roomDinnerStatus: DocumentContentResponseDtoBikingDinnerStatusEnum
  // 洗浄トイレ
  washletStatus: DocumentContentResponseDtoBikingDinnerStatusEnum
  // 禁煙
  smokingStatus: DocumentContentResponseDtoBikingDinnerStatusEnum
  //露天風呂
  hasOpenAirBath: boolean
  //貸し切り風呂
  hasReservedBath: boolean
  //当日予約
  hasSameDayReservation: boolean
  //送迎あり
  hasDropOffService: boolean
  //一人泊
  hasSingleGuest: boolean
}

export const initialPriceStandard: PriceStandardType = {
  startSalesData: null,
  endSalesDate: null,
  mainPlan: undefined,
  priceTable: undefined,
  bashTaxes: undefined,
  travelPlanNameOverwriteText: "",
  childrenFareBreakLine: true, // true - 要問合せ | false - 不可,
  childrenFareVisibility: true,
  childFare: "要問合せ",
  isPayCredit: false, // "当日現金またはクレジットカード",
  bathTaxElementary: 0,
  bathTaxInfant: 0,
  bathTaxAdult: 0,
  sameDayReservationText: "",
  checkInStartTime: "1500",
  checkoutTime: "1100",
  checkInOutBreakLine: false,
  checkInOutVisibility: true,
  planRoomText: "",
  bathText: "",
  hotSpringQualityText: "",
  travelPlanNameOverwriteVisibility: false,
  bathTaxVisibility: true,
  bathTaxBreakLine: false,
  breakChildFare: false,
  payMethodVisibility: true,
  payMethodBreakLine: false,
  sameDayReservationVisibility: true,
  sameDayReservationBreakLine: false,
  planRoomVisibility: true,
  planRoomBreakLine: false,
  bathVisibility: true,
  bathBreakLine: false,
  hotSpringQualityVisibility: true,
  bikingDinnerStatus: DocumentContentResponseDtoBikingDinnerStatusEnum.None,
  bedStatus: DocumentContentResponseDtoBikingDinnerStatusEnum.None,
  petAllowedStatus: DocumentContentResponseDtoBikingDinnerStatusEnum.None,
  roomDinnerStatus: DocumentContentResponseDtoBikingDinnerStatusEnum.None,
  smokingStatus: DocumentContentResponseDtoBikingDinnerStatusEnum.None,
  washletStatus: DocumentContentResponseDtoBikingDinnerStatusEnum.None,
  hasOpenAirBath: false,
  hasReservedBath: false,
  hasSameDayReservation: false,
  hasDropOffService: false,
  hasSingleGuest: false,
}
