import { useEffect, useMemo, useRef, useState } from "react"
import { useRecoilState } from "recoil"
import MuiButton from "@mui/material/Button"
import { Checkbox, FormControlLabel, Radio, Tooltip } from "@mui/material"
import { Favorite, FavoriteBorder } from "@mui/icons-material"
import BaseModal from "@/components/base/overlay/BaseModal"
import BaseFilterSelectCheckbox from "@/components/base/form/BaseFilterSelectCheckbox"
import BaseFilterInputText from "@/components/base/form/BaseFilterInputText"
import { favoriteImagesState } from "@/atoms/image"
import { ImageLibrary } from "@/api/imageLibraries"
import { OptionType } from "@/types/page/workspace/optionType"

interface ImageListItemProps {
  item: ImageLibrary
  selected?: boolean
  favorite?: boolean
  used?: boolean
  top: number
  onSelect: (id: number) => void
  onChangeFavorite: (id: number, favorite: boolean) => void
}

const ImageListItem = (props: ImageListItemProps) => {
  const [showZoomImage, setShowZoomImage] = useState(false)
  const ref = useRef(null)
  return (
    <div
      ref={ref}
      className='w-[203px] rounded border border-divider-accent-secondary pb-2'
    >
      {showZoomImage && (
        <div
          style={{ top: `${ref.current.offsetTop - props.top}px` }}
          className='pointer-events-none fixed z-50 h-[346px] border border-divider-accent-secondary bg-container-main-primary p-2'
        >
          <img
            className='h-full w-full object-contain'
            src={props.item.imageConvert}
            alt={props.item.caption}
          />
        </div>
      )}
      <div className=' h-[148px] w-full'>
        <img
          className='h-full w-full object-contain'
          src={props.item.imageConvert}
          alt={props.item.caption}
          onMouseEnter={() => setShowZoomImage(true)}
          onMouseLeave={() => setShowZoomImage(false)}
        />
      </div>
      <p className='mx-2 mt-2 text-base font-bold text-content-default-primary'>
        {props.item.caption}
      </p>
      <div className='flex items-center justify-between pl-2 pr-1'>
        <p className='text-xxs font-medium text-content-default-quaternary'>
          {/* {`${props.item.width}px x ${props.item.height}px`} */}
          {props.item.size}
        </p>
        <div className='flex items-center'>
          {props.used && (
            <span className='rounded bg-container-sleep-primary px-1 py-[2px] text-xxs font-medium text-white-0'>
              使用済
            </span>
          )}
          <Tooltip title='お気に入り' arrow>
            <Checkbox
              size='small'
              icon={<FavoriteBorder color='primary' />}
              checkedIcon={<Favorite />}
              checked={props.favorite}
              onChange={(event) =>
                props.onChangeFavorite(props.item.id, event.target.checked)
              }
            />
          </Tooltip>
        </div>
      </div>
      <div className='mx-2 px-2'>
        <FormControlLabel
          control={
            <Radio
              disableFocusRipple
              size='small'
              checked={props.selected}
              onChange={() => props.onSelect(props.item.id)}
            />
          }
          label={
            <span className='text-base text-content-default-primary'>
              {props.item.title}
            </span>
          }
        />
      </div>
    </div>
  )
}

interface Props {
  items: ImageLibrary[]
  useCodes?: number[]
  categoryOptions: OptionType[]
  typeOptions: OptionType[]
  onSelect: (id: number) => void
  onReload: () => void
  onClose: () => void
}

const WorkspaceModalImageSelect = (props: Props) => {
  const [favoriteImages, setFavoriteImages] =
    useRecoilState(favoriteImagesState)

  const { categoryOptions, typeOptions, items: imageLibraries } = props
  const [selected, setSelected] = useState<number>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedImageTypes, setSelectedImageTypes] = useState<string[]>([])
  const [keyword, setKeyword] = useState("")
  const [filterMode, setFilterMode] = useState<"use" | "favorite" | "">("")
  const divRef = useRef()
  const [offsetHeight, setOffsetHeight] = useState(0)

  useEffect(() => {
    setSelected(null)
    setSelectedCategories([])
    setSelectedImageTypes([])
    setKeyword("")
    setFilterMode("")
  }, [props.items])
  const handleOnScroll = (e: any) => {
    setOffsetHeight(e.target.scrollTop)
  }
  const handleOnExtractCategory = (values: string[]) =>
    setSelectedCategories(values)
  const handleOnExtractImageTypes = (values: string[]) =>
    setSelectedImageTypes(values)
  const handleOnExtractKeyword = (value) => setKeyword(value)

  const handleOnChangeFavorite = (id, favorite) => {
    if (favorite) {
      setFavoriteImages((state) => [...state, id])
    } else {
      setFavoriteImages((state) => state.filter((value) => value !== id))
    }
  }

  const handleOnClick = () => {
    if (selected !== null) {
      props.onSelect(selected)
    }
  }

  const handleOnClose = () => {
    props.onClose()
  }

  const items = useMemo(() => {
    return imageLibraries
      .filter(
        (item) =>
          filterMode === "" ||
          (filterMode === "use"
            ? (props.useCodes ?? []).includes(item.id)
            : favoriteImages.includes(item.id)),
      )
      .filter(
        (item) =>
          selectedCategories.length === 0 ||
          selectedCategories.includes(item.imageCategoryId.toString()),
      )
      .filter(
        (item) =>
          selectedImageTypes.length === 0 ||
          item.libraryImageTypes.some((type) =>
            selectedImageTypes.includes(type.imageTypeId.toString()),
          ),
      )
      .filter((item) => keyword === "" || item.keywords.indexOf(keyword) >= 0)
  }, [
    imageLibraries,
    filterMode,
    props.useCodes,
    favoriteImages,
    selectedCategories,
    selectedImageTypes,
    keyword,
  ])

  useEffect(() => {
    if (!items.some((item) => item.id === selected)) {
      setSelected(null)
    }
  }, [items, selected])

  return (
    <BaseModal shown={true} onClickClose={handleOnClose}>
      <div className='relative flex h-[640px] w-[1200px] flex-col'>
        <div className='relative mt-10'>
          <p className='text-center text-lg font-bold text-content-default-primary'>
            画像の選択
          </p>
          <div className='absolute right-[104px] top-0'>
            <MuiButton
              variant='contained'
              size='small'
              sx={{ width: 104 }}
              onClick={props.onReload}
            >
              再読込み
            </MuiButton>
          </div>
        </div>
        <div className='flex items-center justify-between px-[60px] pb-3 pt-4'>
          <div className='flex items-center space-x-3'>
            <BaseFilterSelectCheckbox
              placeholder='カテゴリ'
              selectedValues={selectedCategories}
              options={categoryOptions}
              onExact={handleOnExtractCategory}
            />
            <BaseFilterSelectCheckbox
              placeholder='画像タイプ'
              selectedValues={selectedImageTypes}
              options={typeOptions}
              onExact={handleOnExtractImageTypes}
            />
            <BaseFilterInputText
              placeholder='キーワード'
              value={keyword}
              onExact={handleOnExtractKeyword}
            />
          </div>
          <div className='flex items-center space-x-8'>
            <MuiButton
              color='inherit'
              size='small'
              onClick={() =>
                setFilterMode((state) => (state === "use" ? "" : "use"))
              }
            >
              <span className='text-sm font-medium text-content-default-primary'>
                使用画像
              </span>
              <span
                className={`material-symbols-outlined ml-4 text-[25px] text-content-default-tertiary`}
              >
                {filterMode === "use"
                  ? "keyboard_double_arrow_up"
                  : "keyboard_double_arrow_down"}
              </span>
            </MuiButton>
            <MuiButton
              color='inherit'
              size='small'
              onClick={() =>
                setFilterMode((state) =>
                  state === "favorite" ? "" : "favorite",
                )
              }
            >
              <span className='text-sm font-medium text-content-default-primary'>
                お気に入り画像
              </span>
              <span
                className={`material-symbols-outlined ml-4 text-[25px] text-content-default-tertiary`}
              >
                {filterMode === "favorite"
                  ? "keyboard_double_arrow_up"
                  : "keyboard_double_arrow_down"}
              </span>
            </MuiButton>
          </div>
        </div>
        <div
          ref={divRef}
          onScroll={handleOnScroll}
          className='mb-24 flex flex-1 flex-wrap overflow-y-auto px-[60px] pt-3'
        >
          {items.map((item) => (
            <div key={item.id} className='mb-6 mr-3'>
              <ImageListItem
                top={offsetHeight}
                item={item}
                selected={selected === item.id}
                favorite={favoriteImages.includes(item.id)}
                used={props.useCodes.includes(item.id)}
                onSelect={(id) =>
                  setSelected((state) =>
                    state === null || state !== id ? id : null,
                  )
                }
                onChangeFavorite={handleOnChangeFavorite}
              />
            </div>
          ))}
          {items.length === 0 && (
            <div className='mx-auto mt-20 text-sm text-gray-90'>
              絞り込み結果がありません
            </div>
          )}
        </div>
        <div className='absolute bottom-0 left-0 flex w-full items-center justify-between px-9 pb-9'>
          <MuiButton
            color='inherit'
            variant='outlined'
            sx={{ width: 104 }}
            onClick={handleOnClose}
          >
            キャンセル
          </MuiButton>
          <MuiButton
            variant='contained'
            sx={{ width: 104 }}
            disabled={selected === null}
            onClick={handleOnClick}
          >
            確定
          </MuiButton>
        </div>
      </div>
    </BaseModal>
  )
}

export default WorkspaceModalImageSelect
