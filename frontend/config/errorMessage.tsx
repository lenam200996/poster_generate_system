const errorMessage = {
  TWO_DIGIT_ALPHANUMERIC_MORE_ERROR: "2桁以上の半角英数字で入力してください",
  FOUR_DIGIT_NUMBER_LIMIT_ERROR: "4桁の半角数字で入力してください",
  CALENDAR_DATE_ERROR: "年は4桁、月・日は2桁の数字で入力してください",
  CALENDAR_DATE_BEFORE_ERROR:
    "最終更新日の絞り込み最終日は絞り込み開始日より先の日付で入力してください",
  CALENDAR_SALES_DATE_BEFORE_ERROR:
    "販売開始日は販売終了日より先の日付で入力してください",
  CALENDAR_DATE_AFTER_CM_ERROR:
    "終了日は開始日より後の日付を入力してください。",
  CALENDAR_DATE_BEFORE_CM_ERROR:
    "開始日は終了日より前の日付を入力してください。",
  CALENDAR_SALES_DATE_AFTER_ERROR:
    "販売終了日は販売開始日より後の日付で入力してください",
  ENTRYSHEET_IMPORT_ERROR: "エントリーシートのインポートに失敗しました",
  FLATPLAN_IMPORT_ERROR: "台割のインポートに失敗しました",
  ENTRYSHEET_FORMAT_ERROR:
    "エントリーシートのインポートに失敗しました。正しいフォーマットのExcelファイルを取り込んでください",
  FLATPLAN_FORMAT_ERROR:
    "台割のインポートに失敗しました。正しいフォーマットのExcelファイルを取り込んでください",
  EXCEL_FORMAT_ERROR:
    "取り込みに失敗しました。Excelファイルを取り込んでください。",
  EPS_FORMAT_ERROR:
    "取り込みに失敗しました。正しいフォーマットのEPSファイルを取り込んでください",
  PDF_FORMAT_ERROR:
    "取り込みに失敗しました。正しいフォーマットのPDFファイルを取り込んでください",
  TEMPLATE_FORMAT_ERROR:
    "取り込みに失敗しました。jpg、pngファイルを取り込んでください",
  HOTEL_CODE_NOT_EXIST: "宿コードが存在していません",
  INDESIGN_FORMAT_ERROR:
    "取り込みに失敗しました。idml、inddファイルを取り込んでください",
  THUMBNAIL_FORMAT_ERROR:
    "取り込みに失敗しました。jpg、png、epsファイルを取り込んでください",
  THUMBNAIL_PAIR_REQUIRE: "ツメ見出しは左右をセットで設定してください",
  THUMBNAIL_CODE_UNIQUE: "ツメ見出しの名称は一意にしてください",
  THUMBNAIL_CODE_FORMAT:
    "ツメ見出しコードは[名称_L]と[名称_R]で設定してください",
}

export default errorMessage
