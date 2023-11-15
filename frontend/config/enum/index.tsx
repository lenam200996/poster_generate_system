export const MediaTypeEnum = {
  MAGAZINE: "ゆこゆこ本誌",
  TEST: "テスト",
}

export const StampCategoryEnum = {
  PRIDE: "自慢",
  SCORES: "口コミ点数",
}

export const DocumentSizeEnum = {
  ONE_ONE: "1",
  ONE_TWO: "1/2",
  ONE_FOUR: "1/4",
}

export const PartsTypeEnum = {
  yado: "通常宿",
  selection: "セレクション",
  common: "共通",
  photo: "写真ユニット",
}

export const EditionUpperCaseEnum = {
  HOKKAIDO: "北海道",
  TOUHOKU: "東北",
  JOSHINETSU: "上信越",
  KITA_KANTO: "北関東",
  KANTO: "関東",
  TOKAI: "東海",
  KANSAI: "関西",
  HOKURIKU: "北陸",
  TOUHOKU_HOKURIKU: "東海・北陸",
  KANSAI_HOKURIKU: "関西・北陸",
  CHUGOKU_SHIKOKU: "中国・四国",
  KYUSHU: "九州",
  TEST: "テスト",
}

export const CoumnCategoryEnum = {
  NORMAL: "通常",
  COMMON: "共通",
  SELECTION: "セレクション",
  PLANNING: "企画",
}

export const StatusEnum = {
  MAKING: "制作中",
  NOT_START: "未着手",
  CHECKING: "校正依頼中",
  SEND_BACK: "差し戻し",
  PROOFREADING: "校了",
}

export const IDMLTagEnum = {
  // 都道府県
  TemplatePrefectureName: "PRF_NAME",
  // 温泉地名
  TemplateSpaName: "SPR_NAME",
  // 宿コード(上)
  TemplateHotelCodeTop: "NET_HTL_CD_Text_1",
  // 宿コード(下)
  TemplateHotelCodeBottom: "NET_HTL_CD_Text_2",
  // 客室
  TemplateGuestRoom: "HTL_GR_NUM",
  // 宿名大
  TemplateHotelNameLarge: "HTL_NAME",
  // 宿名小
  TemplateHotelNameSmall: "HTL_NAME_SUB",
  // ふりがな大
  TemplateFuriganaLarge: "HTL_KANA",
  // ふりがな小
  TemplateFuriganaSmall: "HTL_KANA_SUB",
  // キャッチコピー
  TemplateCatchCopy: "GNK_MAIN_CTH",
  // 補足欄テキスト
  TemplateOtherInfo: "GNK_FACILITY_TXT",
  // アクセス情報欄
  TemplateAccessInfo: "GNK_ACI_TXT",
  // 外観画像
  TemplateExteriorImage: "GLI_IMG1",
  // 朝食
  TemplateBreakfast: "GNK_ICON08_IMG",
  // 夕食
  TemplateDinner: "GNK_ICON07_IMG",
  // 露天風呂
  TemplateOpenAirBath: "GNK_ICON01_IMG",
  // かけ流し
  TemplateKakenagashi: "GNK_ICON02_IMG",
  // エレベーター
  TemplateElevator: "GNK_ICON03_IMG",
  // 当日予約可
  TemplateSameDayReservationAvailable: "GNK_ICON04_IMG",
  // 送りあり
  TemplateHasDropOffService: "GNK_ICON05_IMG",
  // 禁煙予約可
  TemplateNonSmokingReservationAvailable: "GNK_ICON06_IMG",
  // ネット関連動画
  TemplateNetImage: "NET_IMG",
  // 評価パーツ欄
  TemplateReviewRating: "REVIEW_RATING",
  // 訴求エリア
  TemplateAppealArea: "APEAL",
  // 可変エリア
  TemplateVariableArea: "VARIABLE",
  // 料金表ヘッダ
  TemplateFeeTableHeader: "FEE_TBL_HDR",
  // 料金表
  TemplateFeeTableBody: "FEE_TBL_BODY",
}

export const IDMLPartsTagEnum = {
  //プラン名
  PlanName: "PLN_NAME",
  //コラムタイプ
  ColumnType: "GLI_CLT_CD",
  //料金種別
  OptionPriceType: "GLI_OPC_CD",
  //料金種別
  PriceType: "GLI_PRICE_CD",
  //料金
  PriceText: "GLI_PRC_TXT",
  //オプション名
  OptionName: "ROP_NAME",
  //受け付け種別
  AcceptanceType: "ROP_CLS",
  //料金種別
  OptionPriceText: "ROP_PRICE",
  //料金
  PlanPriceText: "PLN_PRICE",
  //コピー
  CopyText: "GLI_BODY_TXT",
  //注釈
  Caption: "GLI_CMT_TXT",
  //画像1
  Image1: "GLI_IMG1",
  //画像1タイトル
  Image1Title: "GLI_IMG_CPTN1",
  //画像2
  Image2: "GLI_IMG2",
  //画像2タイトル
  Image2Title: "GLI_IMG_CPTN2",
}

export const EatingPlacesEnum = {
  None: "NONE",
  Restaurant: "RESTAURANT",
  PrivateRestaurant: "PRIVATE_RESTAURANT",
  Guestroom: "GUESTROOM",
  RestaurantAndPrivateRestaurant: "RESTAURANT_AND_PRIVATE_RESTAURANT",
  RestaurantAndGuestroom: "RESTAURANT_AND_GUESTROOM",
  GuestroomAndPrivateRestaurant: "GUESTROOM_AND_PRIVATE_RESTAURANT",
}
