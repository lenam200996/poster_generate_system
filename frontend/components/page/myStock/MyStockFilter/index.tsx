import { copiesMock, mediaMock } from "@/config/api/mock/projects/index"
import BaseFilterSelectCheckbox from "@/components/base/form/BaseFilterSelectCheckbox"
import BaseFilterInputText from "@/components/base/form/BaseFilterInputText"
import MuiChip from "@mui/material/Chip"
import { FilterSearchCondition } from "@/types/page/projectlist/filterSearchCondition"
import BaseFilterSelectRadio from "@/components/base/form/BaseFilterSelectRadio"
import { useRouter } from "next/router"
import { mediaOptions } from "@/config/options"

type SelectOptionsType = { label: string; value: string }[]

interface Props {
  sizeOptions: SelectOptionsType
  conditions: FilterSearchCondition[]
  onSearch: (conditions: FilterSearchCondition[]) => void
}

const MyStockFilter = (props: Props) => {
  const router = useRouter()
  const handleExactMedia = (values) => handleChangeCondition("media", values)
  const handleExactCopies = (values) => handleChangeCondition("edition", values)
  const handleExactHotelCode = (value) =>
    handleChangeCondition("hotelCode", [value])
  const handleExactHotelName = (value) =>
    handleChangeCondition("hotelName", [value])
  const handleExactSizes = (value) => handleChangeCondition("size", [value])

  //-------------------------------------------------------------------------
  /**
   * 対象の項目が変更された際の適応処理
   * * 対象は「媒体、版、宿コード、宿名、原稿サイズ」など。
   *
   * @param key 検索対象
   * @param values 対象の変更内容
   */
  //-------------------------------------------------------------------------
  const handleChangeCondition = (
    key: FilterSearchCondition["key"],
    values: string[],
  ) => {
    // オブジェクトリストが持っている情報からkeyが指定した情報を取得
    const query = Object.keys(router.query).reduce((obj, _key) => {
      if (key !== _key) {
        obj[_key] = router.query[_key]
      }
      return obj
    }, {})

    // 配列で持ってた値をカンマ区切りの文字列に変換
    // (例){'MAGAZINE', 'TEST'} -> "MAGAZINE,TEST"
    const value = Array.from(new Set(values))
      .map((value) => value)
      .join(",")

    // 値があればqyeryに設定
    if (value !== "") {
      query[key] = value
    }

    // マイストックの画面に遷移
    router.replace({
      pathname: "/myStock",
      query,
    })
  }

  //-------------------------------------------------------------------------
  /**
   * 複数の検索対象による検索処理
   * * 主に「媒体、版」で使用する。
   * * 1. 対象のチェックボックスにチェックした内容を使って検索。
   * * 2. データが存在すれば、それを返却する。
   * * 3. この時、複数件が一致すれば「AAA,BBB,CCC」とコンマで区切る。
   *
   * @param key 検索対象( media、editionなど )
   * @returns 検索対象に対して一致したデータ
   */
  //-------------------------------------------------------------------------
  const filterArrayValues = (key: FilterSearchCondition["key"]) => {
    const item = props.conditions.find((item) => item.key === key)
    return item ? item.value.split(",") : []
  }

  //-------------------------------------------------------------------------
  /**
   * 検索対象による検索処理
   * * 主に「宿コード、宿名」で使用する。
   * * 1. テキストボックスに入力した内容を使って検索。
   * * 2. データが存在すれば、それを返却する。
   *
   * @param key 検索対象( hotelName、hotelCodeなど )
   * @returns 検索対象に対して一致したデータ
   */
  //-------------------------------------------------------------------------
  const filterTextValue = (key: FilterSearchCondition["key"]) => {
    const item = props.conditions.find((item) => item.key === key)
    return item ? item.value : ""
  }

  //-------------------------------------------------------------------------
  /**
   * チップ名の生成（ドロップダウンリストで選択した項目）
   *
   * @param targetOptions 対象オプション
   * @param selectedValues 選択項目（ID的な状態）
   * @returns 画面表示する形式にした選択項目
   */
  //-------------------------------------------------------------------------
  //
  // [ 概要 ]
  // selectedValuesには画面のドロップダウンリストで選択した項目があり、
  // それに適応したtargetOptionsにある画面表示に適した形式を返却する。
  //
  // [ イメージ ]
  // targetOptions <= [ { label:"ゆこゆこ本誌", values:"MAGAZZINE" },
  //                    { label:"テスト", values:"TEST" } ]
  //
  // selectedValues <= "MAGAZINE,TEST"
  //
  // return "ゆこゆこ本誌,テスト"
  //
  //-------------------------------------------------------------------------
  const generateChipName = (targetOptions, selectedValues) => {
    const array = targetOptions
      .filter((copy) => selectedValues.split(",").includes(copy.value))
      .map((copy) => copy.label)
    return array.join(",")
  }

  return (
    <>
      <div className='mb-1 flex items-start'>
        <div className='flex flex-1 flex-wrap'>
          <div className='mr-3 mb-3'>
            <BaseFilterSelectCheckbox
              placeholder='媒体'
              onExact={handleExactMedia}
              options={mediaMock}
              selectedValues={filterArrayValues("media")}
            />
          </div>
          <div className='mr-3 mb-3'>
            <BaseFilterSelectCheckbox
              placeholder='版'
              onExact={handleExactCopies}
              options={copiesMock}
              selectedValues={filterArrayValues("edition")}
            />
          </div>
          <div className='mr-3 mb-3'>
            <BaseFilterInputText
              placeholder='宿コード'
              onExact={handleExactHotelCode}
              value={filterTextValue("hotelCode")}
            />
          </div>
          <div className='mr-3 mb-3'>
            <BaseFilterInputText
              placeholder='宿名'
              onExact={handleExactHotelName}
              value={filterTextValue("hotelName")}
            />
          </div>
          <div className='mr-3 mb-3'>
            <BaseFilterSelectRadio
              placeholder='原稿サイズ'
              onExact={handleExactSizes}
              options={props.sizeOptions}
              value={
                props.conditions.find((item) => item.key === "size")?.value ??
                ""
              }
            />
          </div>
        </div>
      </div>
      {props.conditions.length > 0 && (
        <div className='mb-4 mt-3 flex flex-wrap'>
          {/* マイストックのドロップダウンリストの数だけ繰り返し */}
          {/*「媒体、版、宿コード、宿名、原稿サイズ」*/}
          {props.conditions.map(({ key, value: _value }) => {
            // ドロップダウンリストから指定中の項目名をtitleに設定
            //「媒体」のドロップダウンリストでどれかの項目にチェックあれば画面表示の対象とする
            const title =
              key === "media"
                ? "媒体"
                : key === "edition"
                ? "版"
                : key === "yearMonth"
                ? "号"
                : key === "hotelCode"
                ? "宿コード"
                : key === "hotelName"
                ? "宿名"
                : key === "size"
                ? "原稿サイズ"
                : key === "sales"
                ? "営業担当"
                : key === "manuscriptID"
                ? "原稿ID"
                : key === "updated"
                ? "最終更新日"
                : ""

            // ドロップダウンリストの選択項目が無ければここで終了
            // 選択中の項目表示はしない
            if (title === "" || _value === "") {
              return null
            }

            // 変数に選択項目の値を設定
            //（※媒体は選択項目に表示していた内容ではない）
            let value = _value

            // valueに画面表示に適さない形式で値が入っているので編集
            // (例)"MAGAZINE,TEST" -> "ゆこゆこ本誌,テスト"
            //  - media：媒体
            //  - edition：版
            if (key === "media") {
              value = generateChipName(mediaOptions, value)
            } else if (key === "edition") {
              value = generateChipName(copiesMock, value)
            }

            // 選択中の項目を表示
            //  - 表示内容は「媒体:ゆこゆこ本誌」のようにする
            return (
              <div key={`${key}_${value}`} className='mr-2 mb-2'>
                <MuiChip
                  label={`${title}: ${value}`}
                  size='small'
                  onDelete={() => {
                    router.replace({
                      pathname: "/myStock",
                      query: Object.keys(router.query).reduce((obj, _key) => {
                        if (key !== _key) {
                          obj[_key] = router.query[_key]
                        }
                        return obj
                      }, {}),
                    })
                  }}
                />
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

export default MyStockFilter
