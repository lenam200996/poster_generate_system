export interface FilterSearchCondition {
  key:
    | "status"
    | "media"
    | "edition"
    | "yearMonth"
    | "hotelCode"
    | "hotelName"
    | "size"
    | "sales"
    | "manuscript"
    | "manuscriptID"
    | "updated"
  value: string
}
