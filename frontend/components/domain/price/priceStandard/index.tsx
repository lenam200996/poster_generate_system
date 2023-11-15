import { useState, ChangeEventHandler, useEffect, useMemo } from "react"
import { styled } from "@mui/material/styles"
import MuiTextField from "@mui/material/TextField"
import MuiButton from "@mui/material/Button"
import MuiCheckbox from "@mui/material/Checkbox"
import MuiDivider from "@mui/material/Divider"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import {
  Radio,
  FormControlLabel,
  MenuItem as MuiMenuItem,
  Select as MuiSelect,
} from "@mui/material"
import RadioGroup from "@mui/material/RadioGroup"
import {
  PriceStandardType,
  initialPriceStandard,
} from "@/types/page/workspace/priceStandard"
import PriceModalSelectMainPlan from "@/components/domain/price/PriceModalSelectMainPlan"
import PriceModalSelectPlan from "../PriceModalSelectPlan"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { workspaceManuscriptState } from "@/atoms/workspace"
import { useRouter } from "next/router"
import dayjs from "@/util/dayjs"
import { useApiClient } from "@/hooks/useApiClient"
import { LoadingButton } from "@mui/lab"
import {
  DocumentContentResponseDtoBikingDinnerStatusEnum,
  EntryPlanReponseDto,
  HotelAgeChargeDto,
  UpdateDocumentContentDto,
} from "@/openapi"
import { countBytes } from "@/util/strings"
import { GlobalLoadingState } from "@/atoms/global"
import { useShowAlertMessage } from "@/components/domain/global/AlertMessageProvider"
import errorMessage from "@/config/errorMessage"
import { z } from "zod"
import { Dayjs } from "dayjs"
import BaseErrorBody from "@/components/base/typography/BaseErrorBody"
const utc = require("dayjs/plugin/utc") // Import plugin utc
const timezone = require("dayjs/plugin/timezone") // Import plugin timezone
dayjs.extend(utc) // Extend dayjs with utc
dayjs.extend(timezone) // Extend dayjs with timezone

const StyledCalendarTextField = styled(MuiTextField)(() => ({
  "& .MuiInputBase-root": {
    width: "140px",
    height: "32px",
    borderColor: "#C0C8CC",
  },
  "& .MuiInputBase-input": {
    fontSize: 14,
    padding: "0 8px",
  },
}))

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 180,
    },
  },
}

const endIndexes = Object.values(
  DocumentContentResponseDtoBikingDinnerStatusEnum,
)
const showStatus = (status) => {
  switch (status) {
    case DocumentContentResponseDtoBikingDinnerStatusEnum.None:
      return "空白"
    case DocumentContentResponseDtoBikingDinnerStatusEnum.Partial:
    case false:
      return "▲"
    case DocumentContentResponseDtoBikingDinnerStatusEnum.Full:
    case true:
      return "●"
    default:
      return "空白"
  }
}
const TableRow = (props: { children?: any; heading: string }) => (
  <tr className='border-b border-container-sleep-secondary'>
    <th className='min-w-[200px] text-left'>
      <div className='flex items-center whitespace-pre-wrap py-4 font-medium'>
        {props.heading}
      </div>
    </th>
    <td className='flex items-center'>
      <div className='flex w-full items-center py-4'>{props.children}</div>
    </td>
  </tr>
)

const EndIndexSelectBox = (props: {
  heading: string
  onChange?: (value: DocumentContentResponseDtoBikingDinnerStatusEnum) => void
  value?: DocumentContentResponseDtoBikingDinnerStatusEnum | boolean
  disableChange?: boolean
}) => (
  <div className='mb-8 flex w-[134px] flex-col items-center'>
    <p className='mb-3 text-xs font-medium'>{props.heading}</p>
    {props.disableChange ? (
      <div className={`mt-1 text-sm`}>
        {showStatus(
          props.value == null
            ? DocumentContentResponseDtoBikingDinnerStatusEnum.None
            : props.value,
        )}
      </div>
    ) : (
      <MuiSelect
        size='small'
        sx={{ minWidth: 87, height: 32 }}
        displayEmpty
        //  defaultValue={DocumentContentResponseDtoBikingDinnerStatusEnum.None}
        inputProps={{ "aria-label": "Without label" }}
        value={
          props.value == null
            ? DocumentContentResponseDtoBikingDinnerStatusEnum.None
            : props.value
        }
        MenuProps={MenuProps}
        name='thumbIndexId'
        onChange={(event) =>
          props.onChange(
            event.target
              .value as DocumentContentResponseDtoBikingDinnerStatusEnum,
          )
        }
      >
        {endIndexes.map((item) => (
          <MuiMenuItem key={item} value={item}>
            <div
              className={`w-full text-center text-xl leading-6 text-content-default-primary 
           ${
             item == DocumentContentResponseDtoBikingDinnerStatusEnum.None
               ? "text-sm"
               : ""
           }
           `}
            >
              {showStatus(item)}
            </div>
          </MuiMenuItem>
        ))}
      </MuiSelect>
    )}
  </div>
)

type PriceStandardProps = {
  hotelName: string
  idmlEditId: string
  onChange?: () => void
  onSave?: () => void
}

interface IExclusion {
  [id: string | number]: {
    value: any
    deleted: boolean
  }
}
const startSalesSchema = z.object({
  startSalesInvalidError: z
    .string()
    .regex(
      new RegExp("^[0-9]{4}/(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])$"),
      errorMessage.CALENDAR_DATE_ERROR,
    ),
})
const finishSalesSchema = z.object({
  finishSalesInvalidError: z
    .string()
    .regex(
      new RegExp("^[0-9]{4}/(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])$"),
      errorMessage.CALENDAR_DATE_ERROR,
    ),
})

const PriceStandard = (props: PriceStandardProps) => {
  const router = useRouter()
  const { showAlertMessage } = useShowAlertMessage()
  const setManuscriptState = useSetRecoilState(workspaceManuscriptState)
  const setLoadingState = useSetRecoilState(GlobalLoadingState)
  const manuscript = useRecoilValue(workspaceManuscriptState)
  const items = manuscript.items
  const documentId = manuscript.id
  const [shownPreview, setShownPreview] = useState(false)
  const [item, setItem] = useState<PriceStandardType>(initialPriceStandard)
  const apiClient = useApiClient()
  const [shownMainPlanSelectModal, setShownMainPlanSelectModal] =
    useState(false)
  const [priceList, setPriceList] = useState([])
  const [exclusion, setExclusion] = useState<IExclusion>({})
  // const [allExclusion, setAllExclusion] = useState(true)
  const [saleStartDate, setSaleStartDate] = useState(null)
  const [saleEndDate, setSaleEndDate] = useState(null)
  const [elementaryPrice, setElementaryPrice] = useState([])
  const [infantPrice, setInfantPrice] = useState([])
  const [elementarySelected, setElementarySelected] = useState(null)
  const [infantSelected, setInfantSelected] = useState(null)
  const [hotspringfee, setHotspringfee] = useState(true)
  const [mainTravelPlans, setMainTravelPlans] = useState<EntryPlanReponseDto[]>(
    [],
  )
  const [deletedPriceList, setDeletedPriceList] = useState([])
  const [priceTableWillEdit, setPriceTableWillEdit] = useState(null)
  const [errors, setErrors] = useState(null)
  // const [emptyMainPlan, setemptyMainPlan] = useState( manuscript.document && manuscript.document.documentContent && manuscript.document.documentContent.mainPlanCode  )
  const { id } = router.query
  useEffect(() => {
    initItem(true)
  }, [])

  useEffect(() => {
    // 入湯税
    // ラジオボタンの選択状態を初期化するように値を設定しておく
    if (
      dayjs(saleStartDate).isValid() &&
      dayjs(saleEndDate).isValid() &&
      !errors.startSalesInvalidError &&
      !errors.finishSalesInvalidError
    )
      getHotelAgeCharge(true)
  }, [saleStartDate, saleEndDate])

  const validateStartSales = (value: Dayjs | null) => {
    if (!dayjs(value).isValid()) {
      setErrors((prev) => {
        if (prev)
          return {
            ...prev,
            startSalesInvalidError: errorMessage.CALENDAR_DATE_ERROR,
          }
        else
          return {
            startSalesInvalidError: errorMessage.CALENDAR_DATE_ERROR,
          }
      })
    } else {
      if (
        dayjs(saleEndDate).isValid() &&
        dayjs.tz(value, "UTC").isAfter(dayjs.tz(saleEndDate, "UTC"))
      ) {
        setErrors((prev) => {
          if (prev)
            return {
              ...prev,
              startSalesInvalidError:
                errorMessage.CALENDAR_SALES_DATE_BEFORE_ERROR,
            }
          else
            return {
              startSalesInvalidError:
                errorMessage.CALENDAR_SALES_DATE_BEFORE_ERROR,
            }
        })
      } else {
        setErrors((prev) => {
          if (prev)
            return {
              ...prev,
              startSalesInvalidError: null,
            }
          else null
        })
      }
    }
  }

  const validateEndSales = (value: Dayjs | null) => {
    if (!dayjs(value).isValid()) {
      setErrors((prev) => {
        if (prev)
          return {
            ...prev,
            finishSalesInvalidError: errorMessage.CALENDAR_DATE_ERROR,
          }
        else
          return {
            finishSalesInvalidError: errorMessage.CALENDAR_DATE_ERROR,
          }
      })
    } else {
      if (
        dayjs(saleStartDate).isValid() &&
        dayjs.tz(value, "UTC").isBefore(dayjs.tz(saleStartDate, "UTC"))
      ) {
        setErrors((prev) => {
          if (prev)
            return {
              ...prev,
              finishSalesInvalidError:
                errorMessage.CALENDAR_SALES_DATE_AFTER_ERROR,
            }
          else
            return {
              finishSalesInvalidError:
                errorMessage.CALENDAR_SALES_DATE_AFTER_ERROR,
            }
        })
      } else {
        setErrors((prev) => {
          if (prev)
            return {
              ...prev,
              finishSalesInvalidError: null,
            }
          else return null
        })
      }
    }
  }

  // 画面項目の初期化
  const initItem = (initAgeChargeSelected: boolean) => {
    setErrors({})
    // 入湯税
    // ラジオボタンの選択状態の初期化有無を設定して実行
    getHotelAgeCharge(initAgeChargeSelected)

    // メインプラン・メインプラン部屋タイプ名称編集
    // 料金表
    getMainTravelPlanList()
    getPriceTable()
    // getChildrenPrice()
    const mainPlanUpdate = {
      hotelCode: manuscript.document?.hotelCode,
    }
    if (manuscript.document.documentContent.mainPlanCode || item.mainPlan) {
      mainPlanUpdate["code"] =
        manuscript.document.documentContent.mainPlanCode || item.mainPlan.code
    }
    setItem((state) => ({
      ...state,
      mainPlan: {
        ...state.mainPlan,
        ...mainPlanUpdate,
      },
      ...manuscript.document.documentContent,
      startSalesData:
        manuscript.document.documentContent.salesStartDate ||
        manuscript.document.project.salesStartDate,
      endSalesDate:
        manuscript.document.documentContent.salesEndDate ||
        manuscript.document.project.salesEndDate,
    }))
    setSaleStartDate(
      manuscript.document.documentContent.salesStartDate ||
        manuscript.document.project.salesStartDate,
    )
    setSaleEndDate(
      manuscript.document.documentContent.salesEndDate ||
        manuscript.document.project.salesEndDate,
    )
  }

  const emptyMainPlan = useMemo(() => {
    return (
      !manuscript.document ||
      !manuscript.document.documentContent ||
      !manuscript.document.documentContent.mainPlanCode
    )
  }, [manuscript])

  // メインプランのデータ有無によってボタンの無効化状態を返却
  //  - true ：ボタンを無効化にする
  //  - false：ボタンを有効化にする
  const isMainPlanDisabled = useMemo(() => {
    // 処理概要
    //  - メインプランが存在しなければ、ボタンを非活性にする
    //  - メインプラン名が存在しなければ、ボタンを非活性にする
    //  - メインプラン名が存在すれば、ボタンを活性にする

    // メインプランの存在チェック
    if (item.mainPlan === undefined) {
      // メインプランが無い場合
      // ボタンを無効化する状態を返却
      return true
    } else {
      // メインボタンがある場合
      // メインプラン名の存在チェック
      if (item.mainPlan.name === "" || item.mainPlan.name === undefined) {
        // メインプラン名が無い場合
        // ボタンを無効化する状態を返却
        return true
      } else {
        // メインプラン名がある場合
        // ボタンを有効化する状態を返却
        return false
      }
    }
  }, [item.mainPlan])

  const checkInOutTime = useMemo(() => {
    const hoursIn = Math.floor(Number(item.checkInStartTime) / 100)
    const hoursOut = Math.floor(Number(item.checkoutTime) / 100)
    const minutesIn = Number(item.checkInStartTime) % 100
    const minutesOut = Number(item.checkoutTime) % 100

    return `${String(hoursIn).padStart(2, "0")}:${String(minutesIn).padStart(
      2,
      "0",
    )}/${String(hoursOut).padStart(2, "0")}:${String(minutesOut).padStart(
      2,
      "0",
    )}`
  }, [item.checkInStartTime, item.checkoutTime])

  const outRangeAll = (d: dayjs.Dayjs) => {
    if (dayjs(d).isValid()) {
      d = dayjs.tz(d, "UTC").hour(0).minute(0).second(0).millisecond(0)
      let startSale = dayjs
        .tz(manuscript.document.project.salesStartDate, "UTC")
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0)
      let endSale = dayjs
        .tz(manuscript.document.project.salesEndDate, "UTC")
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0)
      return startSale.isAfter(d, "day") || endSale.isBefore(d, "day")
    }
  }

  const salePeriodDateError = useMemo(() => {
    if (saleStartDate == null && saleEndDate == null) return false
    return outRangeAll(saleStartDate) || outRangeAll(saleEndDate)
  }, [saleStartDate, saleEndDate])

  const showPayCreditText = useMemo(() => {
    return item.isPayCredit ? "当日現金またはクレジットカード" : "当日現金のみ"
  }, [item.isPayCredit])

  const generatedText = useMemo(() => {
    let elementary = item.bathTaxElementary || 0
    let infant = item.bathTaxInfant || 0
    let adult = item.bathTaxAdult || 0
    if (adult == 0 && elementary == 0 && infant == 0) {
      return `なし`
    }
    if (adult === elementary && adult === infant) {
      return `別途${adult}円(大人・子供・幼児)`
    }
    if (adult === elementary && adult != infant) {
      return `別途${adult}円(大人・子供のみ)、${infant}円(幼児)`
    }
    if (adult != elementary && elementary == infant && elementary != 0) {
      const elementarySelectedText = elementary
        ? `、${elementary}円(子供・幼児のみ)`
        : ""

      return `別途${adult}円(大人)${elementarySelectedText}`
    }
    let textFull = `別途${adult}円(大人)`
    if (elementary > 0) textFull += `、${elementary}円(子供)`
    if (infant > 0) textFull += `、${infant}円(幼児)`
    return textFull
  }, [item.bathTaxAdult, item.bathTaxInfant, item.bathTaxElementary])

  const exclusionObj = useMemo(() => {
    let isAll = priceList.every(
      (price) => exclusion[price.id] && !exclusion[price.id].deleted,
    )
    const mergedArray = [].concat(
      ...Object.values(exclusion).map((d) => d.value),
    )

    let groupByExclusion = {}
    let groupByPlan = {}

    mergedArray.forEach((data) => {
      if (!groupByPlan[data.entry_plan_id]) groupByPlan[data.entry_plan_id] = []
      groupByPlan[data.entry_plan_id].push(data)
    })
    const newData = []
    Object.values(groupByPlan).forEach(
      (planDataLists: any[], index: number) => {
        if (planDataLists.length > 0)
          newData.push({
            entry_plan_id: planDataLists[0].entry_plan_id,
            plan_name: (
              planDataLists[0].plan_name ||
              getPlanName(planDataLists[0].entry_plan_id)
            ).replace(/(^\d{4})*\：/, ""),
            exclusion: Array.from(
              new Set(planDataLists.map((d) => d.exclusion)),
            ).join("、"),
          })
      },
    )
    Object.values(newData).map((exclusionData) => {
      if (!groupByExclusion[exclusionData.exclusion])
        groupByExclusion[exclusionData.exclusion] = []
      groupByExclusion[exclusionData.exclusion].push(exclusionData.plan_name)
    })
    const result = Object.keys(groupByExclusion).map((exclusion) => {
      return `${groupByExclusion[exclusion].join("、")}の${exclusion}は除く。`
    })
    return {
      isAll,
      result: result.join(""),
      length: result.join("").length,
    }
  }, [exclusion])

  const mainPlanData = useMemo(() => {
    return item.mainPlan
      ? mainTravelPlans.find(
          (tp) => tp.entry_plan_id === item.mainPlan.entryPlanId,
        )
      : {
          plan_name: "",
          room_name: "",
        }
  }, [item.mainPlan, mainTravelPlans])

  const savingPriceList = useMemo(() => {
    return priceList.filter((p) => p.status !== "deleted" && p.json)
  }, [priceList])

  const newPriceList = useMemo(() => {
    return priceList.filter((price) => price.status == "new")
  }, [priceList])

  const updatePriceList = useMemo(() => {
    return priceList.filter((price) => price.status == "updated")
  }, [priceList])

  const getPlanName = (entry_plan_id: string) => {
    return (
      mainTravelPlans.find((plan) => plan.entry_plan_id == entry_plan_id)
        ?.plan_name || ""
    )
  }
  const getMainTravelPlanList = async () => {
    const { data } =
      await apiClient.priceTableApiFactory.priceTableControllerGetEntryTravels(
        manuscript.document.hotelCode,
        `${manuscript.document.project.issueYear}${String(
          manuscript.document.project.issueMonth,
        ).padStart(2, "0")}`,
        true,
        // skip
      )
    if (data && data.length) {
      const findPlan = data.find(
        (plan) =>
          plan.travel_plans.travel_plan_code ==
          manuscript.document.documentContent.mainPlanCode,
      )

      const noAvailableChildrenPrice = data.every(
        (d) =>
          d.travel_plans.baby_price_bedding_setting_type == 5 &&
          d.travel_plans.baby_price_dinner_bedding_setting_type == 5 &&
          d.travel_plans.baby_price_dinner_setting_type == 5 &&
          d.travel_plans.baby_price_no_dinner_bedding_setting_type == 5 &&
          d.travel_plans.child_price_underclassman_setting_type == 5 &&
          d.travel_plans.child_price_upper_grade_setting_type == 5,
      )
      // data ? "不可" : "要問合せ",
      if (findPlan) {
        setItem((state) => ({
          ...state,
          travelPlanNameOverwriteText:
            state.travelPlanNameOverwriteText ||
            findPlan.room_name.replace(/(^\d{4})*\：/, "").slice(0, 80),
          mainPlan: {
            ...state.mainPlan,
            code: findPlan.travel_plans.travel_plan_code,
            entryPlanId: findPlan.entry_plan_id,
            name: findPlan.travel_plans.travel_plan_name,
            room_code:
              findPlan.applicable_room_type?.stock_control_room_type_code,
          },
          childFare: noAvailableChildrenPrice ? "不可" : "要問合せ",
        }))
      } else {
        setItem((state) => ({
          ...state,
          childFare: noAvailableChildrenPrice ? "不可" : "要問合せ",
        }))
      }

      setMainTravelPlans(data)
    }
  }
  const getPriceTable = async (reFetch?: boolean) => {
    console.log("<< Call getPriceTable() >>")
    let data = manuscript.document.documentContent.priceTables
    if (reFetch) {
      let result =
        await apiClient.priceTableApiFactory.priceTableControllerGetByDocumentId(
          manuscript.document.id,
        )
      data = result.data
    }

    console.log("[ data ]")
    console.log(data)

    // await apiClient.priceTableApiFactory.priceTableControllerGetByDocumentId(
    //   manuscript.document.id,
    // )
    if (data) {
      setDeletedPriceList(
        (data || [])
          .filter((feeTable) => feeTable.documentId == -1)
          .map((feeTable) => feeTable.id),
      )
      setPriceList(
        (data || []).map((feeTable) => ({
          ...feeTable,
          showHtml: feeTable.htmlMerge || feeTable.html,
          saveJson: feeTable.jsonMerged || feeTable.json,
          status: feeTable.documentId == -1 ? "deleted" : "saved",
        })),
      )

      data.forEach((d) => {
        if (d.exclusion) {
          setExclusion((prev) => ({
            ...prev,
            [d.id]: {
              value: d.exclusionString
                ? JSON.parse(d.exclusionString).map((exclusion) => {
                    const plan_name =
                      exclusion.plan_name ||
                      getPlanName(exclusion.entry_plan_id)
                    return {
                      ...exclusion,
                      plan_name,
                    }
                  })
                : undefined,
              deleted: false,
            },
          }))
        }
      })
    }
    console.log("[ priceList ]")
    console.log(priceList)
  }

  const getHotelAgeCharge = async (initAgeChargeSelected: boolean) => {
    try {
      if (!saleStartDate && !saleStartDate) return
      const { data } =
        await apiClient.priceTableApiFactory.priceTableControllerGetAgeHotelCharge2(
          manuscript.document.hotelCode,
          saleStartDate,
          saleEndDate,
        )
      if (data && data.hotels) {
        const hotels = data.hotels as any
        const chargeList = hotels.hotel_charges_list
        const getAgeType = (type, list: HotelAgeChargeDto[]) => {
          return (
            list.find((l) => l.age_group_class_type == type) || {
              charge_price: 0,
            }
          )
        }
        // if(chargeList.length > 0){
        // console.log({chargeList, char: getAgeType(1, dataAgeCharge)})
        const dataAgeCharge = chargeList[0] || {
          age_hotel_charge_price_list: [],
        }
        const adult = getAgeType(
          1,
          dataAgeCharge.age_hotel_charge_price_list,
        ).charge_price
        // setAdultPrice(adult)
        setElementaryPrice((prev) => [
          {
            label: `小学生高学年:${
              getAgeType(2, dataAgeCharge.age_hotel_charge_price_list)
                .charge_price
            }円`,
            value: getAgeType(2, dataAgeCharge.age_hotel_charge_price_list)
              .charge_price,
            id: 2,
          },
          {
            value: getAgeType(3, dataAgeCharge.age_hotel_charge_price_list)
              .charge_price,
            label: `小学生低学年:${
              getAgeType(3, dataAgeCharge.age_hotel_charge_price_list)
                .charge_price
            }円`,
            id: 3,
          },
        ])

        // 引数のラジオボタンの選択状態が初期化であるか判定
        if (initAgeChargeSelected === true) {
          // 選択状態を初期化にする場合
          // 指定したIDのラジオボタンを選択状態にする
          setElementarySelected(2)
        } else {
          // それ以外の場合
          // ラジオボタンの選択状態は引き継いで表示する（SFデータ更新ボタン押下時など）
        }

        setInfantPrice((prev) => [
          {
            value: getAgeType(4, dataAgeCharge.age_hotel_charge_price_list)
              .charge_price,
            label: `幼児(寝具食事付):${
              getAgeType(4, dataAgeCharge.age_hotel_charge_price_list)
                .charge_price
            }円`,
            id: 4,
          },
          {
            value: getAgeType(5, dataAgeCharge.age_hotel_charge_price_list)
              .charge_price,
            label: `幼児(寝具付):${
              getAgeType(5, dataAgeCharge.age_hotel_charge_price_list)
                .charge_price
            }円`,
            id: 5,
          },
          {
            value: getAgeType(6, dataAgeCharge.age_hotel_charge_price_list)
              .charge_price,
            label: `幼児(食事付):${
              getAgeType(6, dataAgeCharge.age_hotel_charge_price_list)
                .charge_price
            }円`,
            id: 6,
          },
          {
            value: getAgeType(7, dataAgeCharge.age_hotel_charge_price_list)
              .charge_price,
            label: `幼児(寝具食事無し):${
              getAgeType(7, dataAgeCharge.age_hotel_charge_price_list)
                .charge_price
            }円`,
            id: 7,
          },
        ])

        // 引数のラジオボタンの選択状態が初期化であるか判定
        if (initAgeChargeSelected === true) {
          // 選択状態を初期化にする場合
          // 指定したIDのラジオボタンを選択状態にする
          setInfantSelected(4)
        } else {
          // それ以外の場合
          // ラジオボタンの選択状態は引き継いで表示する（SFデータ更新ボタン押下時など）
        }

        setItem((state) => ({
          ...state,
          bathTaxAdult: adult,
          bathTaxElementary: getAgeType(
            2,
            dataAgeCharge.age_hotel_charge_price_list,
          ).charge_price,
          bathTaxInfant: getAgeType(
            4,
            dataAgeCharge.age_hotel_charge_price_list,
          ).charge_price,
        }))

        // 引数のラジオボタンの選択状態が初期化であるか判定
        if (initAgeChargeSelected === true) {
          // 選択状態を初期化にする場合
          // 入湯税の金額が書かれたラジオボタンを選択状態にする
          setHotspringfee(true)
        } else {
          // それ以外の場合
          // ラジオボタンの選択状態は引き継いで表示する（SFデータ更新ボタン押下時など）
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleOnClickMainPlanExact = ({
    entry_plan_id,
    travel_plan_name,
    travel_plan_code,
    hotel_code,
    room_name,
    room_code,
  }: {
    entry_plan_id: string
    travel_plan_name: string
    travel_plan_code: string
    hotel_code: string
    room_name: string
    room_code: string
  }) => {
    console.log({
      entryPlanId: entry_plan_id,
      code: travel_plan_code,
      name: travel_plan_name, //+ `( ${room_name} )`,
      hotelCode: hotel_code,
    })
    setItem((state) => ({
      ...state,
      mainPlan: {
        entryPlanId: entry_plan_id,
        code: travel_plan_code,
        name: travel_plan_name, //+ `( ${room_name} )`,
        hotelCode: hotel_code,
        room_code,
      },
      travelPlanNameOverwriteText: (room_name || "").slice(0, 80),
    }))

    setShownMainPlanSelectModal(false)
  }

  const handleOnClickSelectPlan = (priceData, excludeFlag: boolean) => {
    console.log({ priceData })
    if (priceData.priceTable.needEditId) {
      setPriceList((prev) => {
        return prev.map((pr) => {
          if (pr.id == priceData.priceTable.needEditId) {
            return {
              ...priceData.priceTable,
              oldStatus: pr.oldStatus,
              status: "updated",
              showHtml:
                priceData.priceTable.htmlMerge || priceData.priceTable.html,
              saveJson:
                priceData.priceTable.jsonMerged || priceData.priceTable.json,
            }
          }
          return pr
        })
      })
    } else {
      setPriceList((prev) => [
        ...prev,
        {
          ...priceData.priceTable,
          oldStatus: "new",
          status: "new",
          showHtml: priceData.priceTable.htmlMerge || priceData.priceTable.html,
          saveJson:
            priceData.priceTable.jsonMerged || priceData.priceTable.json,
        },
      ])
    }

    if (!excludeFlag && priceData.exclusion.length > 0) {
      console.log("add exclusion ", priceData.exclusion)
      if (priceData.priceTable.needEditId) {
        const objectUpdate = {
          [priceData.priceTable.needEditId]: {
            value: priceData.exclusion,
            deleted: false,
          },
        }
        setExclusion((prev) => ({
          ...prev,
          ...objectUpdate,
        }))
      } else {
        setExclusion((prev) => ({
          ...prev,
          [priceData.priceTable.id]: {
            value: priceData.exclusion,
            deleted: false,
          },
        }))
      }
    }
    setPriceTableWillEdit(null)
    setShownPreview(false)
  }

  /**
   * 保存ボタン押下時の処理
   */
  const onSavePriceTable = async () => {
    try {
      // 画面をローディング中にする
      setLoadingState(true)

      if (deletedPriceList.length > 0) {
        console.log("Deleting Price List", deletedPriceList)
        const isDeleteAll = savingPriceList.length === 0
        await apiClient.priceTableApiFactory.priceTableControllerDelete(
          deletedPriceList,
          props.idmlEditId,
          isDeleteAll,
        )
      }
      if (newPriceList.length > 0 || updatePriceList.length > 0) {
        console.log("Creating : ", newPriceList)
        await apiClient.priceTableApiFactory.priceTableControllerUpdatePriceTable(
          {
            ids: newPriceList.map((p) => p.id),
            editIds: updatePriceList.map((p) => ({
              id: p.id,
              needEditId: p.needEditId,
            })),
            documentId: `${manuscript.document.id}`,
          },
        )
      }

      const updateDocumentContentData: UpdateDocumentContentDto = {
        bathBreakLine: item.bathBreakLine,
        bathTaxAdult: item.bathTaxAdult,
        bathTaxBreakLine: item.bathTaxBreakLine,
        bathTaxElementary: item.bathTaxElementary,
        bathTaxInfant: item.bathTaxInfant,
        bathTaxVisibility: item.bathTaxVisibility,
        bathText: item.bathText,
        bathVisibility: item.bathVisibility,
        bedStatus: item.bedStatus,
        bikingDinnerStatus: item.bikingDinnerStatus,
        checkInOutBreakLine: item.checkInOutBreakLine,
        checkInOutVisibility: item.checkInOutVisibility,
        childrenFareBreakLine: item.childrenFareBreakLine,
        childrenFareVisibility: item.childrenFareVisibility,
        // excludeHotSpringEvaluation: false,
        // hasBed: false,
        // hasBikingDinner: false,
        hasElevator: false,
        // hasRoomDinner: false,
        // hasWashlet: false ,
        hotSpringQualityText: item.hotSpringQualityText,
        hotSpringQualityVisibility: item.hotSpringQualityVisibility,
        smokingStatus: item.smokingStatus,
        petAllowedStatus: item.petAllowedStatus,
        planRoomBreakLine: item.planRoomBreakLine,
        planRoomText: item.planRoomText,
        planRoomVisibility: item.planRoomVisibility,
        roomDinnerStatus: item.roomDinnerStatus,
        salesEndDate: saleEndDate,
        salesStartDate: saleStartDate,
        sameDayReservationBreakLine: item.sameDayReservationBreakLine,
        sameDayReservationText: item.sameDayReservationText,
        sameDayReservationVisibility: item.sameDayReservationVisibility,
        travelPlanNameOverwriteText: item.travelPlanNameOverwriteText,
        travelPlanNameOverwriteVisibility:
          item.travelPlanNameOverwriteVisibility,
        washletStatus: item.washletStatus,
      }
      Object.keys(updateDocumentContentData).map((key) => {
        if (updateDocumentContentData[key] == null)
          delete updateDocumentContentData[key]
      })
      await apiClient.documentsApiFactory
        .documentControllerUpdateDocumentContent(manuscript.document.id, {
          mainPlanCode: item.mainPlan.code,
          ...updateDocumentContentData,
        })
        .then(() => {
          setManuscriptState((state) => ({
            ...state,
            document: {
              ...state.document,
              documentContent: {
                ...state.document.documentContent,
                mainPlanCode: item.mainPlan.code,
              },
            },
          }))
        })

      await apiClient.priceTableApiFactory.priceTableControllerSaveToIdml({
        mainHotelCode: item.mainPlan.hotelCode,
        mainPlanCode: item.mainPlan.code,
        saleStartDate: dayjs(saleStartDate).isValid()
          ? dayjs.tz(saleStartDate, "UTC").format("YYYY/MM/DD")
          : undefined,
        saleEndDate: dayjs(saleEndDate).isValid()
          ? dayjs.tz(saleEndDate, "UTC").format("YYYY/MM/DD")
          : undefined,

        dataJsonList: savingPriceList.map((p) => p.saveJson || p.json),
        idEdit: props.idmlEditId,
        exclusionHeader:
          exclusionObj.isAll && exclusionObj.length <= 32
            ? exclusionObj.result
            : "",
        exclusion:
          !exclusionObj.isAll || exclusionObj.length > 32
            ? exclusionObj.result
            : "",
        hotspringfee: item.bathTaxVisibility
          ? hotspringfee
            ? `【 入湯税 】${generatedText || ""}`
            : "【 入湯税 】別途あり"
          : "",
        hotspringfeeBreakLine: item.bathTaxBreakLine,
        childFare: item.childrenFareVisibility
          ? "【 子供 】" + (item.childrenFareBreakLine ? "要問合せ" : "不可")
          : "",
        childFareBreakLine: item.childrenFareBreakLine,
        methodOfPayment: item.payMethodVisibility
          ? `【 支払方法 】${showPayCreditText || ""}`
          : "",
        methodOfPaymentBreakLine: item.payMethodBreakLine,
        sameDayReservation: item.sameDayReservationVisibility
          ? "【 当日予約 】" + (item.sameDayReservationText || "")
          : "",
        sameDayReservationBreakLine: item.sameDayReservationBreakLine,
        checkInOut: item.checkInOutVisibility
          ? "【 チェックイン/アウト 】" + `${checkInOutTime}`
          : "",
        checkInOutBreakLine: item.checkInOutBreakLine,
        planRoom: item.planRoomVisibility
          ? "【 プランのお部屋 】" + (item.planRoomText || "")
          : "",
        planRoomBreakLine: item.planRoomBreakLine,
        bath: item.bathVisibility ? "【 お風呂 】" + (item.bathText || "") : "",
        bathBreakLine: item.bathBreakLine,
        hotSpringQuality: item.hotSpringQualityVisibility
          ? "【 泉質 】" + item.hotSpringQualityText
          : "",
      })

      // 共通処理で「冊子・原稿・IDML」に編集した内容を保存する
      getPriceTable(true)
      props.onSave && props.onSave()
    } catch (e) {
      // メッセージで保存が「失敗」したことがわかる内容を表示
      showAlertMessage("error", "料金表保存失敗しました")
    } finally {
      // ローディング中を解除
      setLoadingState(false)
    }
  }

  const restorePriceList = (priceId) => {
    console.log("<< Call restorePriceList() >>")
    if (savingPriceList.length >= 5)
      return alert("料金表作成の上限を超えています。")
    setDeletedPriceList((prev) => prev.filter((id) => id != priceId))
    setPriceList((prev) =>
      prev.map((price) => {
        if (price.id == priceId)
          return {
            ...price,
            status: price.oldStatus,
          }
        return price
      }),
    )
    setExclusion((prev) => {
      const data = prev
      if (data[priceId]) data[priceId].deleted = false
      return data
    })
    console.log(priceList)
  }
  const deletePriceList = (priceId) => {
    setDeletedPriceList((prev) => [...prev, priceId])
    // setPriceList((prev) => prev.filter((price) => price.id != priceId))
    setPriceList((prev) =>
      prev.map((price) => {
        if (price.id == priceId)
          return {
            ...price,
            oldStatus: price.status,
            status: "deleted",
          }
        return price
      }),
    )
    setExclusion((prev) => {
      const data = prev
      if (data.priceId) data[priceId].deleted = true
      return data
    })
  }

  const editPriceTable = (priceId) => {
    const findPriceTable = priceList.find((pri) => pri.id == priceId)
    if (findPriceTable) {
      setPriceTableWillEdit(findPriceTable)
      setShownPreview(true)
    }
  }

  const handleOnChangeFlag: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { name, checked } = event.target

    setItem((state) => ({
      ...state,
      [name]: checked,
    }))
  }
  const handleOnStatus = (e) => {
    const { name, value } = e

    setItem((state) => ({
      ...state,
      [name]: value,
    }))
  }

  const handleOnChangeSpringfee = (
    selected: number,
    key: "infant" | "elementary",
  ) => {
    switch (key) {
      case "infant":
        const findInfant = infantPrice.find((e) => e.id == selected)
        findInfant &&
          setItem((state) => ({
            ...state,
            bathTaxInfant: findInfant.value,
          }))
        break
      case "elementary":
        const findElement = elementaryPrice.find((e) => e.id == selected)
        findElement &&
          setItem((state) => ({
            ...state,
            bathTaxElementary: findElement.value,
          }))
        break
      default:
        break
    }
  }
  const onChangeStartDate = (date) => {
    validateStartSales(date)
    saleEndDate && validateEndSales(saleEndDate)
    date = new Date(date)
    // if (!isNaN(date)) {
    date.setHours(0, 0, 0, 0)
    setSaleStartDate(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0",
      )}-${String(date.getDate()).padStart(2, "0")}T00:00:00.000Z`,
    )
    // }
  }
  const onChangeEndDate = (date) => {
    validateEndSales(date)
    saleStartDate && validateStartSales(saleStartDate)
    date = new Date(date)
    // if (!isNaN(date)) {
    date.setHours(0, 0, 0, 0)
    setSaleEndDate(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0",
      )}-${String(date.getDate()).padStart(2, "0")}T00:00:00.000Z`,
    )
    // }
  }

  const showSelectPlanModal = () => {
    if (savingPriceList.length < 5) setShownPreview(true)
    else alert("料金表作成の上限を超えています。")
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='pt-6 pb-12 text-sm font-medium text-content-default-primary'>
        <div className='flex justify-end'>
          <MuiButton
            size='small'
            variant='contained'
            onClick={() => {
              // 項目の初期化
              // 入湯税のラジオボタン選択状態は引き継ぐように設定
              initItem(false)
            }}
          >
            SFデータ更新
          </MuiButton>
          <div className='ml-4'>
            <MuiButton
              disabled={emptyMainPlan}
              onClick={() => {
                setManuscriptState((state) => ({
                  ...state,
                  viewState: undefined,
                }))
                router.replace({
                  pathname: "/workspace/[id]",
                  query: { id, viewMode: "split", documentId: documentId },
                })
              }}
            >
              閉じる
            </MuiButton>
          </div>
        </div>
        <h2 className='mt-8 text-lg font-bold'>
          料金表編集　{props.hotelName}
        </h2>
        <table className='mt-12 w-full'>
          <span className='whitespace-nowrap text-red-50'>
            {salePeriodDateError &&
              "プロジェクト設定の販売期間外に設定されています。"}
          </span>
          <tbody>
            <TableRow heading='販売期間'>
              <span className='w-[85px]'>販売開始日</span>
              <div>
                <DatePicker
                  inputFormat='YYYY/MM/DD'
                  value={saleStartDate}
                  maxDate={saleEndDate}
                  onChange={onChangeStartDate}
                  disabled={savingPriceList.length > 0}
                  renderInput={(params) => (
                    <StyledCalendarTextField
                      size='small'
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                        placeholder: "20xx/1/31",
                      }}
                    />
                  )}
                />

                <div className='left-0 h-[13px] w-[40px] whitespace-nowrap'>
                  {errors?.startSalesInvalidError && (
                    <BaseErrorBody size={10}>
                      {errors.startSalesInvalidError}
                    </BaseErrorBody>
                  )}
                </div>
              </div>
              <span className='ml-8 mr-5'>～</span>
              <span className='w-[85px]'>販売終了日</span>
              <div>
                <DatePicker
                  inputFormat='YYYY/MM/DD'
                  value={saleEndDate}
                  minDate={saleStartDate}
                  onChange={onChangeEndDate}
                  disabled={savingPriceList.length > 0}
                  renderInput={(params) => (
                    <StyledCalendarTextField
                      size='small'
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                        placeholder: "20xx/1/31",
                      }}
                    />
                  )}
                />

                <div className='left-0 h-[13px]'>
                  {errors?.finishSalesInvalidError && (
                    <BaseErrorBody size={10}>
                      {errors.finishSalesInvalidError}
                    </BaseErrorBody>
                  )}
                </div>
              </div>
            </TableRow>
            <TableRow heading='メインプラン'>
              <div className='flex w-full items-center'>
                {item.mainPlan ? (
                  <div className='flex-1'>{item.mainPlan.name}</div>
                ) : (
                  <MuiButton
                    variant='contained'
                    sx={{ width: 104, height: 36 }}
                    onClick={() => setShownMainPlanSelectModal(true)}
                  >
                    選択
                  </MuiButton>
                )}
                {item.mainPlan && (
                  <MuiButton
                    variant='contained'
                    sx={{ width: 104, height: 36 }}
                    onClick={() => setShownMainPlanSelectModal(true)}
                  >
                    変更
                  </MuiButton>
                )}
              </div>
            </TableRow>
            <TableRow heading={`メインプラン\n部屋タイプ名称編集`}>
              <div className='flex w-full items-center justify-between'>
                <div className='flex-1'>
                  <MuiTextField
                    name='travelPlanNameOverwriteText'
                    value={item.travelPlanNameOverwriteText}
                    onChange={(e) => {
                      const value = e.target.value
                      if (countBytes(value) <= 160) {
                        setItem((prev) => ({
                          ...prev,
                          travelPlanNameOverwriteText: e.target.value,
                        }))
                      }
                    }}
                    size='small'
                    sx={{ maxWidth: 440, width: "100%" }}
                  />
                </div>
                <div className='ml-10'>
                  <FormControlLabel
                    name='travelPlanNameOverwriteVisibility'
                    control={
                      <MuiCheckbox
                        disableRipple
                        checked={item.travelPlanNameOverwriteVisibility}
                        onChange={(event) => handleOnChangeFlag(event)}
                      />
                    }
                    label='使用'
                  />
                </div>
              </div>
            </TableRow>
            <TableRow heading='料金表'>
              <div className='flex w-full flex-col'>
                <div className='flex w-full flex-col border-b-gray-70'>
                  {priceList.map((price, index) => (
                    <div
                      key={index}
                      className='mb-4 flex w-full items-center justify-between'
                    >
                      <div className='w-[60px]'>{index + 1} </div>
                      <div className='relative mr-3 flex flex-1 items-center'>
                        {price.status === "new" && (
                          <div className='absolute left-0 top-0 rounded-5 bg-[#23974aa9] p-[3px]  text-[#fff]'>
                            New
                          </div>
                        )}
                        {price.status === "deleted" && (
                          <div className='absolute left-0 top-0 rounded-5 bg-[#bf2a2aa9] p-[3px] text-[#fff]'>
                            Deleted
                          </div>
                        )}
                        {price.status === "updated" && (
                          <div className='absolute left-0 top-0 rounded-5 bg-[#2926bda9] p-[3px] text-[#fff]'>
                            Updated
                          </div>
                        )}
                        {price.status === "saved" && (
                          <div className='absolute left-0 top-0 rounded-5 bg-[#246f84a9] p-[3px] text-[#fff]'>
                            Saved
                          </div>
                        )}
                        {!price.json && (
                          <div className='absolute left-0 top-0 rounded-5 bg-[#ff1818d5] p-[3px] text-[#ffffff]'>
                            Invalid JSON
                          </div>
                        )}
                        <div>
                          <div
                            className='mr-[4px]'
                            dangerouslySetInnerHTML={{ __html: price.showHtml }}
                          ></div>
                          {/* {price.needMergeIndex &&
                            price.needMergeIndex != "[]" &&
                            price.htmlMerge &&
                            price.pattern != "B" && (
                              <FormControlLabel
                                sx={{ fontSize: "10px", marginRight: "4px" }}
                                control={
                                  <MuiCheckbox
                                    value={price.showHtml == price.htmlMerge}
                                    onChange={(e) =>
                                      setPriceList((prev) => {
                                        console.log("[ 料金表 ]")
                                        console.log(
                                          "FormControlLabel.MuiCheckbox.onChange",
                                        )
                                        return prev.map((feeTable) => {
                                          if (feeTable.id === price.id)
                                            return {
                                              ...feeTable,
                                              showHtml: e.target.checked
                                                ? price.htmlMerge
                                                : price.html,
                                              saveJson: e.target.checked
                                                ? price.jsonMerged
                                                : price.json,
                                            }
                                          return feeTable
                                        })
                                      })
                                    }
                                  />
                                }
                                label='表を結合'
                              />
                            )} */}
                        </div>
                        {price.status != "deleted" && (
                          <MuiButton
                            variant='contained'
                            sx={{ width: 70, height: 24 }}
                            onClick={() => editPriceTable(price.id)}
                          >
                            修正
                          </MuiButton>
                        )}
                      </div>
                      <div className='w-[80px]'>
                        {price.status === "deleted" ? (
                          <MuiButton
                            variant='outlined'
                            onClick={() => restorePriceList(price.id)}
                            sx={{ width: 80, height: 24 }}
                            className='flex whitespace-nowrap'
                          >
                            復元する
                          </MuiButton>
                        ) : (
                          <MuiButton
                            variant='outlined'
                            onClick={() => deletePriceList(price.id)}
                            sx={{ width: 70, height: 24 }}
                            className='flex whitespace-nowrap'
                          >
                            <span className='material-symbols-outlined mr-1 text-base'>
                              delete
                            </span>
                            削除
                          </MuiButton>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <br />
                <MuiButton
                  variant='contained'
                  sx={{ width: 104, height: 36 }}
                  // className='h-[36px] w-[104px] rounded-[4px] border-[1px] border-[#cccccc] bg-white-0 text-[13px] text-[#0157BD]'
                  disabled={isMainPlanDisabled || salePeriodDateError}
                  onClick={showSelectPlanModal}
                >
                  追加
                </MuiButton>
              </div>
            </TableRow>
            <tr>
              <th className='w-full pt-8 pb-3' colSpan={2}>
                <MuiDivider textAlign='left'>
                  <div className='text-sm'>補足欄</div>
                </MuiDivider>
              </th>
            </tr>
            <TableRow heading='入湯税'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex-1'>
                  {/* elementary price */}
                  <div className='border-b border-dashed border-divider-accent-primary last-of-type:border-0'>
                    <RadioGroup
                      row
                      defaultValue={""}
                      value={elementarySelected}
                      name={"bathTaxelementary"}
                      onChange={(event) => {
                        setElementarySelected(event.target.value)
                        handleOnChangeSpringfee(
                          Number(event.target.value),
                          "elementary",
                        )
                      }}
                    >
                      {elementaryPrice.map((x) => (
                        <FormControlLabel
                          key={x.id}
                          value={x.id}
                          checked={elementarySelected == x.id}
                          control={<Radio size='small' />}
                          label={x.label}
                          sx={{ fontSize: 14 }}
                        />
                      ))}
                    </RadioGroup>
                  </div>
                  {/* infant price */}
                  <div className='border-b border-dashed border-divider-accent-primary last-of-type:border-0'>
                    <RadioGroup
                      row
                      defaultValue={""}
                      name={"bathTaxInfant"}
                      onChange={(event) => {
                        setInfantSelected(event.target.value)
                        handleOnChangeSpringfee(
                          Number(event.target.value),
                          "infant",
                        )
                      }}
                    >
                      {infantPrice.map((x) => (
                        <FormControlLabel
                          key={x.id}
                          value={x.id}
                          checked={infantSelected == x.id}
                          control={<Radio size='small' />}
                          label={x.label}
                          sx={{ fontSize: 14 }}
                        />
                      ))}
                    </RadioGroup>
                  </div>

                  <div className='border-b border-dashed border-divider-accent-primary last-of-type:border-0'>
                    <RadioGroup
                      row
                      defaultValue={""}
                      value={hotspringfee}
                      name={"bathTax"}
                      onChange={(event) => {
                        setHotspringfee(event.target.value == "true")
                      }}
                    >
                      <FormControlLabel
                        key={1}
                        value={true}
                        control={<Radio size='small' />}
                        label={generatedText}
                        sx={{ fontSize: 14 }}
                      />
                      <FormControlLabel
                        key={2}
                        value={false}
                        control={<Radio size='small' />}
                        label={`別途あり`}
                        sx={{ fontSize: 14 }}
                      />
                    </RadioGroup>
                  </div>
                  {/* {bathTaxes.map((bathTax, i) => (
                    <div
                      key={i}
                      className='border-b border-dashed border-divider-accent-primary last-of-type:border-0'
                    >
                      <RadioGroup
                        row
                        defaultValue={""}
                        name={"bathTax" + i}
                        onChange={(event) => {}}
                      >
                        {bathTax.map((x) => (
                          <FormControlLabel
                            key={x.value}
                            value={x.value}
                            control={<Radio size='small' />}
                            label={x.label}
                            sx={{ fontSize: 14 }}
                          />
                        ))}
                      </RadioGroup>
                    </div>
                  ))} */}
                </div>
                <div className='ml-10'>
                  <FormControlLabel
                    name='bathTaxVisibility'
                    sx={{ fontSize: 14 }}
                    control={
                      <MuiCheckbox
                        size='small'
                        disableRipple
                        checked={item.bathTaxVisibility}
                        onChange={(event) => handleOnChangeFlag(event)}
                      />
                    }
                    label='表示'
                  />
                  <FormControlLabel
                    name='bathTaxBreakLine'
                    sx={{ fontSize: 14 }}
                    control={
                      <MuiCheckbox
                        size='small'
                        disableRipple
                        checked={item.bathTaxBreakLine}
                        onChange={(event) => handleOnChangeFlag(event)}
                      />
                    }
                    label='改行'
                  />
                </div>
              </div>
            </TableRow>
            <TableRow heading='子供料金'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex-1'>{item.childFare}</div>
                <div className='ml-10'>
                  <FormControlLabel
                    name='childrenFareVisibility'
                    sx={{ fontSize: 14 }}
                    control={
                      <MuiCheckbox
                        size='small'
                        disableRipple
                        checked={item.childrenFareVisibility}
                        onChange={(event) => handleOnChangeFlag(event)}
                      />
                    }
                    label='表示'
                  />
                  <FormControlLabel
                    name='childrenFareBreakLine'
                    sx={{ fontSize: 14 }}
                    control={
                      <MuiCheckbox
                        size='small'
                        disableRipple
                        checked={item.childrenFareBreakLine}
                        onChange={(event) => handleOnChangeFlag(event)}
                      />
                    }
                    label='改行'
                  />
                </div>
              </div>
            </TableRow>
            <TableRow heading='支払方法'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex-1'>{showPayCreditText}</div>
                <div className='ml-10'>
                  <FormControlLabel
                    name='payMethodVisibility'
                    sx={{ fontSize: 14 }}
                    control={
                      <MuiCheckbox
                        size='small'
                        disableRipple
                        checked={item.payMethodVisibility}
                        onChange={(event) => handleOnChangeFlag(event)}
                      />
                    }
                    label='表示'
                  />
                  <FormControlLabel
                    name='payMethodBreakLine'
                    sx={{ fontSize: 14 }}
                    control={
                      <MuiCheckbox
                        size='small'
                        disableRipple
                        checked={item.payMethodBreakLine}
                        onChange={(event) => handleOnChangeFlag(event)}
                      />
                    }
                    label='改行'
                  />
                </div>
              </div>
            </TableRow>
            <TableRow heading='当日予約'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex-1'>
                  <MuiTextField
                    size='small'
                    name='sameDayReservationText'
                    value={item.sameDayReservationText}
                    onChange={(e) => {
                      const value = e.target.value
                      if (countBytes(value) <= 512) {
                        setItem((prev) => ({
                          ...prev,
                          sameDayReservationText: e.target.value,
                        }))
                      }
                    }}
                    sx={{ maxWidth: 440, width: "100%" }}
                  />
                </div>
                <div className='ml-10'>
                  <FormControlLabel
                    name='sameDayReservationVisibility'
                    sx={{ fontSize: 14 }}
                    control={
                      <MuiCheckbox
                        size='small'
                        disableRipple
                        checked={item.sameDayReservationVisibility}
                        onChange={(event) => handleOnChangeFlag(event)}
                      />
                    }
                    label='表示'
                  />
                  <FormControlLabel
                    name='sameDayReservationBreakLine'
                    sx={{ fontSize: 14 }}
                    control={
                      <MuiCheckbox
                        size='small'
                        disableRipple
                        checked={item.sameDayReservationBreakLine}
                        onChange={(event) => handleOnChangeFlag(event)}
                      />
                    }
                    label='改行'
                  />
                </div>
              </div>
            </TableRow>
            <TableRow heading='チェックイン/アウト'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex-1'>{checkInOutTime}</div>
                <div className='ml-10'>
                  <FormControlLabel
                    name='checkInOutVisibility'
                    sx={{ fontSize: 14 }}
                    control={
                      <MuiCheckbox
                        size='small'
                        disableRipple
                        checked={item.checkInOutVisibility}
                        onChange={(event) => handleOnChangeFlag(event)}
                      />
                    }
                    label='表示'
                  />
                  <FormControlLabel
                    name='checkInOutBreakLine'
                    sx={{ fontSize: 14 }}
                    control={
                      <MuiCheckbox
                        size='small'
                        disableRipple
                        checked={item.checkInOutBreakLine}
                        onChange={(event) => handleOnChangeFlag(event)}
                      />
                    }
                    label='改行'
                  />
                </div>
              </div>
            </TableRow>
            <TableRow heading='プランのお部屋'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex-1'>
                  <MuiTextField
                    size='small'
                    name='planRoomText'
                    value={item.planRoomText}
                    onChange={(e) => {
                      const value = e.target.value
                      if (countBytes(value) <= 512) {
                        setItem((prev) => ({
                          ...prev,
                          planRoomText: e.target.value,
                        }))
                      }
                    }}
                    sx={{ maxWidth: 440, width: "100%" }}
                  />
                </div>
                <div className='ml-10'>
                  <FormControlLabel
                    name='planRoomVisibility'
                    sx={{ fontSize: 14 }}
                    control={
                      <MuiCheckbox
                        size='small'
                        disableRipple
                        checked={item.planRoomVisibility}
                        onChange={(event) => handleOnChangeFlag(event)}
                      />
                    }
                    label='表示'
                  />
                  <FormControlLabel
                    name='planRoomBreakLine'
                    sx={{ fontSize: 14 }}
                    control={
                      <MuiCheckbox
                        size='small'
                        disableRipple
                        checked={item.planRoomBreakLine}
                        onChange={(event) => handleOnChangeFlag(event)}
                      />
                    }
                    label='改行'
                  />
                </div>
              </div>
            </TableRow>
            <TableRow heading='お風呂'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex-1'>
                  <MuiTextField
                    size='small'
                    name='bathText'
                    value={item.bathText}
                    onChange={(e) => {
                      const value = e.target.value
                      if (countBytes(value) <= 512) {
                        setItem((prev) => ({
                          ...prev,
                          bathText: e.target.value,
                        }))
                      }
                    }}
                    sx={{ maxWidth: 440, width: "100%" }}
                  />
                </div>
                <div className='ml-10'>
                  <FormControlLabel
                    name='bathVisibility'
                    sx={{ fontSize: 14 }}
                    control={
                      <MuiCheckbox
                        size='small'
                        disableRipple
                        checked={item.bathVisibility}
                        onChange={(event) => handleOnChangeFlag(event)}
                      />
                    }
                    label='表示'
                  />
                  <FormControlLabel
                    name='bathBreakLine'
                    sx={{ fontSize: 14 }}
                    control={
                      <MuiCheckbox
                        size='small'
                        disableRipple
                        checked={item.bathBreakLine}
                        onChange={(event) => handleOnChangeFlag(event)}
                      />
                    }
                    label='改行'
                  />
                </div>
              </div>
            </TableRow>
            <TableRow heading='泉質'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex-1'>
                  <MuiTextField
                    size='small'
                    name='hotSpringQualityText'
                    value={item.hotSpringQualityText}
                    onChange={(e) => {
                      const value = e.target.value
                      if (countBytes(value) <= 512) {
                        setItem((prev) => ({
                          ...prev,
                          hotSpringQualityText: e.target.value,
                        }))
                      }
                    }}
                    sx={{ maxWidth: 440, width: "100%" }}
                  />
                </div>
                <div className='ml-10'>
                  <FormControlLabel
                    name='hotSpringQualityVisibility'
                    sx={{ fontSize: 14 }}
                    control={
                      <MuiCheckbox
                        size='small'
                        disableRipple
                        checked={item.hotSpringQualityVisibility}
                        onChange={(event) => handleOnChangeFlag(event)}
                      />
                    }
                    label='表示'
                  />
                </div>
              </div>
            </TableRow>
          </tbody>
        </table>
        <div className='mt-8'>
          <MuiDivider textAlign='left'>
            <div className='text-sm'>巻末インデックス</div>
          </MuiDivider>
          <div className='mt-8 flex flex-wrap'>
            <EndIndexSelectBox
              heading='露天風呂'
              value={item.hasOpenAirBath}
              disableChange={true}
            />
            <EndIndexSelectBox
              heading='夕食バイキング'
              value={item.bikingDinnerStatus}
              onChange={(value) => {
                handleOnStatus({
                  value,
                  name: "bikingDinnerStatus",
                })
              }}
            />
            <EndIndexSelectBox
              heading='ペット可'
              value={item.petAllowedStatus}
              onChange={(value) => {
                handleOnStatus({
                  value,
                  name: "petAllowedStatus",
                })
              }}
            />
            <EndIndexSelectBox
              heading='貸し切り風呂'
              value={item.hasReservedBath}
              disableChange={true}
            />
            <EndIndexSelectBox
              heading='エレベーター'
              value={DocumentContentResponseDtoBikingDinnerStatusEnum.Full}
              disableChange={true}
            />
            <EndIndexSelectBox
              heading='ベッド'
              value={item.bedStatus}
              onChange={(value) => {
                handleOnStatus({
                  value,
                  name: "bedStatus",
                })
              }}
            />
            <EndIndexSelectBox
              heading='当日予約'
              value={item.hasSameDayReservation}
              disableChange={true}
            />
            <EndIndexSelectBox
              heading='一人泊'
              value={item.hasSingleGuest}
              disableChange={true}
            />
            <EndIndexSelectBox
              heading='夕食部屋食'
              value={item.roomDinnerStatus}
              onChange={(value) => {
                handleOnStatus({
                  value,
                  name: "roomDinnerStatus",
                })
              }}
            />
            <EndIndexSelectBox
              heading='洗浄トイレ'
              value={item.washletStatus}
              onChange={(value) => {
                handleOnStatus({
                  value,
                  name: "washletStatus",
                })
              }}
            />
            <EndIndexSelectBox
              heading='禁煙'
              value={item.smokingStatus}
              onChange={(value) => {
                handleOnStatus({
                  value,
                  name: "smokingStatus",
                })
              }}
            />
            <EndIndexSelectBox
              heading='送迎あり'
              value={item.hasDropOffService}
              disableChange={true}
            />
          </div>
        </div>
        <div className='mt-[80px] flex justify-end'>
          <LoadingButton
            variant='contained'
            sx={{ width: 104 }}
            disabled={isMainPlanDisabled}
            onClick={onSavePriceTable}
          >
            保存
          </LoadingButton>
        </div>
      </div>
      {shownMainPlanSelectModal && (
        // メインプラン選択画面にデータを渡す
        <PriceModalSelectMainPlan
          onClose={() => setShownMainPlanSelectModal(false)}
          onPrev={() => setShownMainPlanSelectModal(false)}
          onReload={getMainTravelPlanList}
          onClick={handleOnClickMainPlanExact}
          planList={mainTravelPlans}
          currentPlan={
            item.mainPlan && item.mainPlan.code ? item.mainPlan.code : ""
          }
        />
      )}
      {shownPreview && (
        <PriceModalSelectPlan
          onPrev={() => {
            setPriceTableWillEdit(null)
            setShownPreview(false)
          }}
          onClose={() => {
            setPriceTableWillEdit(null)
            setShownPreview(false)
          }}
          onClick={handleOnClickSelectPlan}
          hotelCode={item.mainPlan.hotelCode}
          planName={item.mainPlan.name}
          planCode={item.mainPlan.code}
          roomCode={item.mainPlan.room_code}
          hotelName={props.hotelName}
          entryPlanId={item.mainPlan.entryPlanId}
          isForMain={priceList.length === 0}
          startDate={saleStartDate}
          endDate={saleEndDate}
          idEdit={props.idmlEditId}
          documentId={documentId}
          willEditPriceTable={priceTableWillEdit}
          mainEditRoomName={
            item.travelPlanNameOverwriteVisibility
              ? item.travelPlanNameOverwriteText.replace(/(^\d{4})*\：/, "")
              : `（${mainPlanData.room_name.replace(/(^\d{4})*\：/, "")}）`
          }
        />
      )}
    </LocalizationProvider>
  )
}

export default PriceStandard
