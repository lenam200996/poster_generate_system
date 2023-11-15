import { ChangeEvent, KeyboardEvent, useEffect, useMemo, useState } from "react"
import { Button as MuiButton } from "@mui/material"
import BaseModal from "@/components/base/overlay/BaseModal"
import BaseFilterSelectCheckbox from "@/components/base/form/BaseFilterSelectCheckbox"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import BaseTextField from "@/components/base/form/BaseTextField"
import { DocumentPartsResponseDto, MasterPartsClassDto } from "@/openapi"

type MasterType = {
  value: string
  label: string
}

interface Props {
  items: DocumentPartsResponseDto[]
  shown?: boolean
  onSelect: (id: number) => void
  onClose: () => void
  partsCategoryList: MasterPartsClassDto[]
}

const PartsClass = {
  NORMAL: "通常宿",
  SELECTION: "セレクション",
  COMMON: "共通",
  PHOTO: "写真ユニット",
}
type DisplayStatus = "selectParts" | "detailParts"

const WorkspaceModalPartsSelect = (props: Props) => {
  const [partsDetail, setPartsDetail] = useState<DocumentPartsResponseDto>(null)
  const [filterTypes, setFilterTypes] = useState<string[]>([])
  const [filterCategories, setFilterCategories] = useState<string[]>([])
  // 検索キーワード
  const [filterKeyword, setFilterKeyword] = useState<string>("")
  const [keyword, setKeyword] = useState("")

  const [displayStatus, setDisplayStatus] =
    useState<DisplayStatus>("selectParts")

  const [partsCategoryMaster, setPartsCategoryMaster] = useState<MasterType[]>(
    [],
  )

  // パーツの種別
  const partsTypeMaster = props.partsCategoryList.map((item) => {
    return {
      value: item.code.toString(),
      label: item.name,
    }
  })

  useEffect(() => {
    const partsCatetoryMaster = props.partsCategoryList.flatMap((item) => {
      return item.documentPartsCategories.map((category) => {
        return {
          value: category.id.toString(),
          label: category.name,
        }
      })
    })
    setPartsCategoryMaster(partsCatetoryMaster)
  }, [])

  const filteredItems = useMemo(() => {
    return props.items
      .filter(
        (item) =>
          filterTypes.length === 0 ||
          filterTypes.includes(item.documentPartsClass),
      )
      .filter(
        (item) =>
          filterCategories.length === 0 ||
          filterCategories.includes(item.documentPartsCategoryId.toString()),
      )
      .filter(
        (item) =>
          filterKeyword === "" ||
          item.name.includes(filterKeyword) ||
          item.comment.includes(filterKeyword) ||
          item.freeWord.includes(filterKeyword),
      )
  }, [filterCategories, filterTypes, props.items, filterKeyword])

  // パーツの種別プルダウンリスト選択イベントハンドラー
  const handleExactPartsTypes = (values: string[]) => {
    let partsCategoryList = props.partsCategoryList

    if (values && values.length > 0) {
      partsCategoryList = partsCategoryList.filter((item) =>
        values.includes(item.code),
      )
    }

    const partsTypeMaster = partsCategoryList.flatMap((item) => {
      return item.documentPartsCategories.map((category) => {
        return {
          value: category.id.toString(),
          label: category.name,
        }
      })
    })

    setFilterTypes(values)
    setPartsCategoryMaster(partsTypeMaster)
  }

  // コラムのカテゴリプルダウンリスト選択イベントハンドラー
  const handleExactPartsCategory = (values: string[]) =>
    setFilterCategories(values)

  // パーツ選択する処理
  const handleOnClickSelect = (partsId: number) => {
    setFilterKeyword("")
    setKeyword("")
    props.onSelect(partsId)
  }

  // 検索欄の文字列変換処理
  const handleOnChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setKeyword(event.target.value)
  }

  // 検索欄のEnterキー押下処理
  const handleOnKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.code === "Enter") {
      setFilterKeyword(keyword)
    }
  }

  // クリアボタン押下処理
  const handleOnClickClear = () => {
    setFilterKeyword("")
    setKeyword("")
  }

  // 検索ボタン押下処理
  const handleOnClickSearch = () => {
    setFilterKeyword(keyword)
  }

  // 詳細ボタン押下処理
  const handleOnClickDetail = (parts: DocumentPartsResponseDto) => {
    setPartsDetail(parts)
    setDisplayStatus("detailParts")
  }

  // 画面閉じる処理
  const handleOnClickClose = () => {
    setFilterKeyword("")
    setKeyword("")
    setDisplayStatus("selectParts")
    props.onClose()
  }

  const ImageListItem = (props: { parts: DocumentPartsResponseDto }) => {
    return (
      <div className='w-[265px] overflow-hidden rounded border border-divider-accent-secondary px-4 pt-4'>
        <div className='mx-auto h-full w-[220px]'>
          <img
            className='mb-4 h-full w-full object-contain'
            src={props.parts.imageThumbnail}
            alt={""}
          />
        </div>
        <div className='px-3'>
          <p className='mt-1 text-xs text-content-active-primary'>
            {props.parts.documentPartsClass &&
              `${PartsClass[props.parts.documentPartsClass]}`}
            {props.parts.documentPartsCategory &&
              `　${props.parts.documentPartsCategory.name}`}
          </p>
          <p className='mt-1 text-sm font-bold text-content-default-primary'>
            {props.parts.name}
          </p>
          <div className='mt-4 mb-10 flex items-center justify-between'>
            <BaseButtonIconText
              icon='loupe'
              text='詳細'
              onClick={() => {
                handleOnClickDetail(props.parts)
              }}
            />
            <MuiButton
              variant='contained'
              sx={{ width: 47 }}
              size='small'
              onClick={() => handleOnClickSelect(props.parts.id)}
            >
              選択
            </MuiButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <BaseModal shown={props.shown ?? true} onClickClose={handleOnClickClose}>
        <div className='relative flex h-[640px] w-[1200px] flex-col px-[54px]'>
          {displayStatus === "selectParts" && (
            <>
              <div className='mt-12 mb-8 flex items-center space-x-6'>
                <p className='text-center text-lg font-bold text-content-default-primary'>
                  パーツの選択
                </p>
                <BaseFilterSelectCheckbox
                  placeholder='パーツの種別'
                  selectedValues={filterTypes}
                  options={partsTypeMaster}
                  onExact={handleExactPartsTypes}
                />
                <BaseFilterSelectCheckbox
                  placeholder='コラムのカテゴリ'
                  selectedValues={filterCategories}
                  options={partsCategoryMaster}
                  onExact={handleExactPartsCategory}
                />
                <BaseTextField
                  sx={{ minWidth: 360 }}
                  size='small'
                  value={keyword}
                  placeholder={"例）選べる客室"}
                  onChange={handleOnChange}
                  onKeyDown={handleOnKeyDown}
                />
                <MuiButton
                  variant='contained'
                  sx={{ width: 104 }}
                  size='small'
                  onClick={handleOnClickSearch}
                >
                  検索
                </MuiButton>
                <MuiButton
                  color='inherit'
                  variant='outlined'
                  sx={{ width: 104 }}
                  size='small'
                  onClick={handleOnClickClear}
                >
                  クリア
                </MuiButton>
              </div>
              <div className='hidden-scrollbar mb-24 flex flex-1 flex-wrap overflow-y-auto'>
                {filteredItems.map((item) => (
                  <div key={item.id} className='mb-6 mr-2'>
                    <ImageListItem parts={item} />
                  </div>
                ))}
                {filteredItems.length === 0 && (
                  <div className='mx-auto mt-20 text-sm text-gray-90'>
                    絞り込み結果がありません
                  </div>
                )}
              </div>
              <div className='absolute bottom-0 left-0 flex w-full items-end justify-center px-9 pb-9'>
                <MuiButton
                  color='inherit'
                  variant='outlined'
                  sx={{ width: 104 }}
                  size='small'
                  onClick={handleOnClickClose}
                >
                  戻る
                </MuiButton>
              </div>
            </>
          )}
          {displayStatus === "detailParts" && (
            <div className='py-8'>
              <div className='flex items-center space-x-6'>
                <p className='text-center text-lg font-bold text-content-default-primary'>
                  {partsDetail.name}
                </p>
              </div>
              <div className='flex h-[500px]'>
                <div className='flex-1 grow p-3'>
                  <img
                    className='h-full w-full object-contain'
                    src={partsDetail.imageThumbnail}
                    alt={""}
                  />
                </div>
                <div className='flex flex-1 grow justify-center'>
                  <table className='my-auto w-full border-collapse '>
                    <tbody>
                      <tr className='border-b border-gray-40'>
                        <th className='p-3 text-left text-content-default-primary'>
                          種別
                        </th>
                        <td className='p-3 font-light text-content-default-primary'>
                          {PartsClass[partsDetail.documentPartsClass]}
                        </td>
                      </tr>
                      <tr className='border-b border-gray-40'>
                        <th className='p-3 text-left text-content-default-primary'>
                          カテゴリ
                        </th>
                        <td className='p-3 font-light text-content-default-primary'>
                          {partsDetail.documentPartsCategory.name}
                        </td>
                      </tr>
                      <tr className='border-b border-gray-40'>
                        <th className='p-3 text-left text-content-default-primary'>
                          備考
                        </th>
                        <td className='p-3 font-light text-content-default-primary'>
                          {partsDetail.comment}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className='flex w-full items-end justify-between'>
                <MuiButton
                  color='inherit'
                  variant='outlined'
                  sx={{ width: 150 }}
                  size='small'
                  onClick={() => setDisplayStatus("selectParts")}
                >
                  パーツ選択へ戻る
                </MuiButton>
                <MuiButton
                  variant='contained'
                  sx={{ width: 104 }}
                  size='small'
                  onClick={() => handleOnClickSelect(partsDetail.id)}
                >
                  選択
                </MuiButton>
              </div>
            </div>
          )}
        </div>
      </BaseModal>
    </>
  )
}

export default WorkspaceModalPartsSelect
