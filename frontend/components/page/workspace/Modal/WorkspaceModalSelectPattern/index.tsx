import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { useMemo, useState } from "react"
import BaseModal from "@/components/base/overlay/BaseModal"
import MuiButton from "@mui/material/Button"
import { MasterDocumentSizeDtoCodeEnum } from "@/openapi"

import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation } from "swiper"
import { FormControlLabel, Radio, RadioGroup } from "@mui/material"
import { TemplatePatterns } from "../../WorkspaceForm"
import { useApiClient } from "@/hooks/useApiClient"
import { useShowAlertMessage } from "@/components/domain/global/AlertMessageProvider"
import { useSetRecoilState } from "recoil"
import { GlobalLoadingState } from "@/atoms/global"
import { workspaceManuscriptState } from "@/atoms/workspace"

export type PatternSet = keyof typeof patternSets
interface Props {
  shown: boolean
  editId: string
  patterns: TemplatePatterns
  size: MasterDocumentSizeDtoCodeEnum
  onExact?: Function
  onClose?: Function
}
type Pattern = {
  type: string
  text: string
  image: string
}

const patternSets = {
  NINE: {
    dialogSize: "h-[640px] w-[1200px]",
    itemSize: "h-[141px] w-[285px]",
    items: [
      {
        type: "01",
        text: "2カラム",
        image: "/assets/pattern-two-col.png",
      },
      {
        type: "02",
        text: "2カラム (右 上下分割)",
        image: "/assets/pattern-two-col-split-r.png",
      },
      {
        type: "03",
        text: "2カラム (左 上下分割)",
        image: "/assets/pattern-two-col-split-l.png",
      },
      {
        type: "08",
        text: "2カラム(左3:右7)",
        image: "/assets/pattern-two-col-large-r.png",
      },
      {
        type: "09",
        text: "2カラム(左7:右3)",
        image: "/assets/pattern-two-col-large-l.png",
      },
      {
        type: "04",
        text: "3カラム",
        image: "/assets/pattern-three-col.png",
      },
      {
        type: "07",
        text: "3カラム (左 上下分割)",
        image: "/assets/pattern-three-col-split-l.png",
      },
      {
        type: "06",
        text: "3カラム(中央 上下分割)",
        image: "/assets/pattern-three-col-split-m.png",
      },
      {
        type: "05",
        text: "3カラム(右 上下分割)",
        image: "/assets/pattern-three-col-split-r.png",
      },
    ],
  },
  TWO: {
    dialogSize: "h-[462px] w-[860px]",
    itemSize: "h-[220px] w-[80px]",
    items: [
      {
        type: "10",
        text: "1段",
        image: "/assets/pattern-vert-row1.png",
      },
      {
        type: "11",
        text: "2段",
        image: "/assets/pattern-vert-row2.png",
      },
    ],
  },
  TWO_HALF: {
    dialogSize: "h-[462px] w-[860px]",
    itemSize: "h-[86px] w-[286px]",
    items: [
      {
        type: "12",
        text: "2カラム",
        image: "/assets/pattern-two-col-low.png",
      },
      {
        type: "13",
        text: "3カラム",
        image: "/assets/pattern-three-col-low.png",
      },
    ],
  },
  PRICE_TABLE: {
    dialogSize: "h-[462px] w-[860px]",
    itemSize: "h-[217px] w-[140px]",
    items: [
      {
        text: "1段",
        image: "/assets/pattern-pricetable-row1.png",
      },
      {
        text: "2段",
        image: "/assets/pattern-pricetable-row2.png",
      },
      {
        text: "3段",
        image: "/assets/pattern-pricetable-row3.png",
      },
    ],
  },
}

type PatternApplicationIndex = {
  text: string
  image: string
  applicablePatternSet: PatternSet
  tagId: string
}

const patternsOneFour: PatternApplicationIndex[] = [
  {
    text: "1段目",
    image: "/assets/pattern-one-four-row1.png",
    applicablePatternSet: "NINE",
    tagId: "APEAL_HARF02",
  },
  {
    text: "2段目",
    image: "/assets/pattern-one-four-row2.png",
    applicablePatternSet: "NINE",
    tagId: "APEAL_HARF03",
  },
]

const patternsOneTwo: PatternApplicationIndex[] = [
  {
    text: "1段目",
    image: "/assets/pattern-one-two-row1.png",
    applicablePatternSet: "NINE",
    tagId: "APEAL_HARF02",
  },
  {
    text: "2段目",
    image: "/assets/pattern-one-two-row2.png",
    applicablePatternSet: "NINE",
    tagId: "APEAL_HARF03",
  },
]

const patternsOneOne: PatternApplicationIndex[] = [
  {
    text: "2段目",
    image: "/assets/pattern-one-one-row2.png",
    applicablePatternSet: "TWO",
    tagId: "APEAL_1P02",
  },
  {
    text: "3段目",
    image: "/assets/pattern-one-one-row3.png",
    applicablePatternSet: "NINE",
    tagId: "APEAL_1P03",
  },
  {
    text: "4段目",
    image: "/assets/pattern-one-one-row4.png",
    applicablePatternSet: "NINE",
    tagId: "APEAL_1P04",
  },
  {
    text: "料金表上",
    image: "/assets/pattern-one-one-pricetable.png",
    applicablePatternSet: "PRICE_TABLE",
    tagId: "APEAL_1P05",
  },
]

type DisplayStatus =
  | "selectPatternIndex"
  | "selectPattern"
  | "overwriteConfirm"
  | "confirm"
  | "none"

const WorkspaceModalSelectPattern = (props: Props) => {
  const apiClient = useApiClient()
  const { showAlertMessage } = useShowAlertMessage()
  const setLoadingState = useSetRecoilState(GlobalLoadingState)
  const setManuscriptState = useSetRecoilState(workspaceManuscriptState)

  const [patternSet, setPatternSet] = useState<PatternSet>("NINE")
  const [selectedPattern, setSelectedPattern] = useState<Pattern>(null)
  const [selectedPatternApplicationIndex, setSelectedPatternApplicationIndex] =
    useState<number>(null)
  const [displayStatus, setDisplayStatus] =
    useState<DisplayStatus>("selectPatternIndex")

  const getPatterns = (size: MasterDocumentSizeDtoCodeEnum) => {
    console.log(size)
    if (size === "ONE_ONE") {
      return patternsOneOne
    } else if (size === "ONE_TWO") {
      return patternsOneTwo
    } else if (size === "ONE_FOUR") {
      return patternsOneFour
    }
  }

  const patterns = useMemo(() => {
    return getPatterns(props.size) || []
  }, [props.size])

  const applicationIndexDialogSize: {
    [key in MasterDocumentSizeDtoCodeEnum]: string
  } = {
    ONE_ONE: "h-[640px] w-[1200px]",
    ONE_TWO: "h-[450px] w-[900px]",
    ONE_FOUR: "h-[500px] w-[900px]",
  }

  const handleOnClickClose = () => {
    props.onClose()
    setSelectedPattern(null)
    setSelectedPatternApplicationIndex(null)
    setDisplayStatus("selectPatternIndex")
  }

  const handleOnExact = async () => {
    const selectedPatternApplication = patterns[selectedPatternApplicationIndex]
    try {
      setLoadingState(true)

      // パーツレイアウト作成
      const response =
        await apiClient.idmlReplaceApiFactory.idmlReplaceControllerCreateWorkspacePartsLayout(
          {
            editId: props.editId,
            packageId: "appeal_layout",
            tagId: selectedPatternApplication.tagId,
            patternType: selectedPattern.type,
          },
        )

      // 最新の項目レイアウト定義を取得
      const idmlResponse =
        await apiClient.idmlReplaceApiFactory.idmlReplaceControllerGetWorkspaceItems(
          props.editId,
        )
      setManuscriptState((state) => ({
        ...state,
        items: idmlResponse.data.items,
      }))

      props.onClose()
      setSelectedPattern(null)
      setDisplayStatus("selectPatternIndex")
    } catch (error) {
      showAlertMessage("error", "選択されたパターンを保存できませんでした")
    } finally {
      setLoadingState(false)
    }
  }

  const handleChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPattern(patternSets[patternSet].items[event.target.value])
  }

  const handleOnClickPatternIndex = (
    patternApplicationIndex: number,
    pattern: PatternApplicationIndex,
  ) => {
    if (Object.values(props.patterns)[patternApplicationIndex] !== null) {
      setDisplayStatus("overwriteConfirm")
    } else {
      setDisplayStatus("selectPattern")
    }
    setPatternSet(pattern.applicablePatternSet)
    setSelectedPatternApplicationIndex(patternApplicationIndex)
  }

  return (
    <BaseModal shown={props.shown} onClickClose={handleOnClickClose}>
      {displayStatus === "selectPatternIndex" && (
        <div
          className={`relative ${
            applicationIndexDialogSize[props.size]
          } px-9 pt-[56px]`}
        >
          <p className='text-center text-lg font-bold'>
            パターン適用箇所の選択
          </p>
          <div className='m-auto mt-5 flex justify-center gap-20'>
            {patterns.length > 3 ? (
              <>
                <Swiper
                  slidesPerView={3}
                  loop={false}
                  navigation={{
                    prevEl: ".custom-prev",
                    nextEl: ".custom-next",
                  }}
                  modules={[Pagination, Navigation]}
                  pagination={{
                    clickable: true,
                    el: "#pagination",
                  }}
                >
                  {patterns.map((pattern, index) => {
                    return (
                      <SwiperSlide key={`key-${index}`}>
                        <div className='relative ml-20 h-[458px] w-[232px]'>
                          <div className='flex h-[66px]  justify-between py-4 align-middle'>
                            <div className='flex items-center gap-3'>
                              <p className='text-[30px]  font-bold text-[#1976D2]'>
                                {index + 1}
                              </p>
                              <span className='font-medium text-[#001F29]'>
                                {pattern.text}
                              </span>
                            </div>
                            <MuiButton
                              variant='contained'
                              onClick={() =>
                                handleOnClickPatternIndex(index, pattern)
                              }
                            >
                              選択
                            </MuiButton>
                          </div>
                          <img
                            src={pattern.image}
                            className='h-auto w-full'
                            alt=''
                          />
                        </div>
                      </SwiperSlide>
                    )
                  })}
                  <button className='custom-prev absolute left-0 top-[50%] z-10 h-12 w-12 bg-transparent'>
                    <span className='material-symbols-outlined text-[48px] leading-none text-[#1976D2]'>
                      chevron_left
                    </span>
                  </button>
                  <button className='custom-next absolute right-0 top-[50%] z-10 h-12 w-12 bg-transparent'>
                    <span className='material-symbols-outlined text-[48px] leading-none text-[#1976D2]'>
                      chevron_right
                    </span>
                  </button>
                </Swiper>
                <div
                  id='pagination'
                  className='swiper-pagination !bottom-[32px] right-0 m-auto !w-[400px]'
                ></div>
              </>
            ) : (
              patterns.map((pattern, index) => {
                return (
                  <div
                    key={`${pattern.text}-${index}`}
                    className='relative h-[282px] w-[232px]'
                  >
                    <div className='flex h-[66px]  justify-between py-4 align-middle'>
                      <div className='flex items-center gap-3'>
                        <p className='text-[30px]  font-bold text-[#1976D2]'>
                          {index + 1}
                        </p>
                        <span className='font-medium text-[#001F29]'>
                          {pattern.text}
                        </span>
                      </div>
                      <MuiButton
                        variant='contained'
                        onClick={() =>
                          handleOnClickPatternIndex(index, pattern)
                        }
                      >
                        選択
                      </MuiButton>
                    </div>
                    <img src={pattern.image} className='h-auto w-full' alt='' />
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
      {displayStatus === "selectPattern" && (
        <div
          className={`relative ${patternSets[patternSet].dialogSize} px-14 pt-[40px]`}
        >
          <p className='text-center text-lg font-bold'>パターン選択</p>
          <div className='hidden-scrollbar mt-[40px] h-[420px] overflow-y-scroll px-16'>
            <RadioGroup
              aria-labelledby='demo-radio-buttons-group-label'
              name='radio-buttons-group'
              onChange={handleChangeRadio}
            >
              <div className='m-auto mt-5 flex flex-wrap gap-10'>
                {patternSets[patternSet].items.map((pattern, index) => {
                  return (
                    <div
                      key={`${pattern.text}-${index}`}
                      className={`relative ${patternSets[patternSet].itemSize}`}
                    >
                      <div className='text-center'>
                        <FormControlLabel
                          value={index}
                          control={<Radio />}
                          label={pattern.text}
                        />
                      </div>
                      <img
                        src={pattern.image}
                        className='h-auto w-full'
                        alt=''
                      />
                    </div>
                  )
                })}
              </div>
            </RadioGroup>
          </div>
          <div className='absolute bottom-0 left-0 flex w-full items-center justify-between px-9 pb-9'>
            <MuiButton
              color='inherit'
              variant='outlined'
              sx={{ width: 104 }}
              onClick={() => {
                handleOnClickClose()
              }}
            >
              キャンセル
            </MuiButton>
            <MuiButton
              variant='contained'
              sx={{ width: 104 }}
              disabled={!selectedPattern}
              onClick={() => {
                handleOnExact()
              }}
            >
              確定
            </MuiButton>
          </div>
        </div>
      )}
      {displayStatus === "overwriteConfirm" && (
        <div className='relative h-[320px] w-[600px]'>
          <div className='px-9 pt-[56px]'>
            <p className='text-center text-lg font-bold'>変更確認</p>
            <p className='mt-4 text-center text-sm font-medium'>
              パターンを再選択しますか？
              <br />
              入力した内容が削除されます。
            </p>
          </div>
          <div className='absolute bottom-0 left-0 flex w-full items-center justify-between px-9 pb-9'>
            <MuiButton
              color='inherit'
              variant='outlined'
              sx={{ width: 104 }}
              onClick={handleOnClickClose}
            >
              キャンセル
            </MuiButton>
            <MuiButton
              variant='contained'
              sx={{ width: 104 }}
              onClick={() => {
                setDisplayStatus("selectPattern")
              }}
            >
              確定
            </MuiButton>
          </div>
        </div>
      )}
    </BaseModal>
  )
}

export default WorkspaceModalSelectPattern
