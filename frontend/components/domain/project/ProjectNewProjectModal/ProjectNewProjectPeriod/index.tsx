import { useState, useEffect } from "react"
import MuiTextField from "@mui/material/TextField"
import MuiButton from "@mui/material/Button"
import { Dayjs } from "dayjs"
import dayjs from "@/util/dayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { styled } from "@mui/material/styles"
import { SafeParseError, SafeParseReturnType, z } from "zod"
import errorMessage from "@/config/errorMessage"
import BaseErrorBody from "@/components/base/typography/BaseErrorBody"
import { Input, OutlinedInput, Radio, RadioGroup } from "@mui/material"
import { CreateProjectWithEditionCodeDtoConsumptionTaxEnum } from "@/openapi"
const utc = require("dayjs/plugin/utc") // Import plugin utc
const timezone = require("dayjs/plugin/timezone") // Import plugin timezone
dayjs.extend(utc) // Extend dayjs with utc
dayjs.extend(timezone) // Extend dayjs with timezone
interface Props {
  onExact: Function
  onClose: Function
}

const StyledTextField = styled(MuiTextField)((props) => ({
  "& .MuiInputBase-root": {
    backgroundColor: props.inputProps.value === "" ? "#FBFBFB" : "#FFFFFF",
    borderColor: "#C0C8CC",
    width: "140px",
    height: "32px",
  },
  "& .MuiInputBase-input": {
    fontSize: 14,
    padding: "0 8px",
  },
}))

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
const startReviewSchema = z.object({
  startReviewInvalidError: z
    .string()
    .regex(
      new RegExp("^[0-9]{4}/(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])$"),
      errorMessage.CALENDAR_DATE_ERROR,
    ),
})
const finishReviewSchema = z.object({
  finishReviewInvalidError: z
    .string()
    .regex(
      new RegExp("^[0-9]{4}/(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])$"),
      errorMessage.CALENDAR_DATE_ERROR,
    ),
})

const ProjectNewSettingPeriodModal = (props: Props) => {
  const [startSales, setStartSales] = useState<Dayjs>(null)
  const [finishSales, setFinishSales] = useState<Dayjs>(null)
  const [startReview, setStartReview] = useState<Dayjs>(null)
  const [finishReview, setFinishReview] = useState<Dayjs>(null)
  const [complete, setComplete] = useState<boolean>(false)
  const [errors, setErrors] = useState(null)
  const [taxIncluded, setTaxIncluded] =
    useState<CreateProjectWithEditionCodeDtoConsumptionTaxEnum>(
      CreateProjectWithEditionCodeDtoConsumptionTaxEnum.Included,
    )
  const [tax, setTax] = useState(10)
  useEffect(() => {
    console.log({ errors })
  }, [errors])
  useEffect(() => {
    if (
      startSales !== null &&
      finishSales !== null &&
      startReview !== null &&
      finishReview !== null &&
      dayjs.tz(startReview, "UTC").isBefore(dayjs.tz(finishReview, "UTC")) &&
      dayjs.tz(startSales, "UTC").isBefore(dayjs.tz(finishSales, "UTC"))
    ) {
      setComplete(true)
    } else {
      setComplete(false)
    }
  }, [startSales, finishSales, startReview, finishReview])

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
        dayjs(finishSales).isValid() &&
        dayjs.tz(value, "UTC").isAfter(dayjs.tz(finishSales, "UTC"))
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

  const validateFinishSales = (value: Dayjs | null) => {
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
        dayjs(startSales).isValid() &&
        dayjs.tz(value, "UTC").isBefore(dayjs.tz(startSales, "UTC"))
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

  const validateStartReview = (value: Dayjs | null) => {
    if (!dayjs(value).isValid()) {
      setErrors((prev) => {
        if (prev)
          return {
            ...prev,
            startReviewInvalidError: errorMessage.CALENDAR_DATE_ERROR,
          }
        else {
          return {
            startReviewInvalidError: errorMessage.CALENDAR_DATE_ERROR,
          }
        }
      })
    } else {
      if (
        dayjs(finishReview).isValid() &&
        dayjs.tz(value, "UTC").isAfter(dayjs.tz(finishReview, "UTC"))
      ) {
        setErrors((prev) => {
          if (prev)
            return {
              ...prev,
              startReviewInvalidError:
                errorMessage.CALENDAR_DATE_BEFORE_CM_ERROR,
            }
          else
            return {
              startReviewInvalidError:
                errorMessage.CALENDAR_DATE_BEFORE_CM_ERROR,
            }
        })
      } else {
        setErrors((prev) => {
          if (prev)
            return {
              ...prev,
              startReviewInvalidError: null,
            }
          else return null
        })
      }
    }
  }
  const validateFinishReview = (value: Dayjs | null) => {
    if (!dayjs(value).isValid()) {
      setErrors((prev) => {
        if (prev) {
          return {
            ...prev,
            finishReviewInvalidError: errorMessage.CALENDAR_DATE_ERROR,
          }
        } else
          return {
            finishReviewInvalidError: errorMessage.CALENDAR_DATE_ERROR,
          }
      })
    } else {
      if (
        dayjs(startReview).isValid() &&
        dayjs.tz(value, "UTC").isBefore(dayjs.tz(startReview, "UTC"))
      ) {
        setErrors((prev) => {
          if (prev) {
            return {
              ...prev,
              finishReviewInvalidError:
                errorMessage.CALENDAR_DATE_AFTER_CM_ERROR,
            }
          } else
            return {
              finishReviewInvalidError:
                errorMessage.CALENDAR_DATE_AFTER_CM_ERROR,
            }
        })
      } else {
        setErrors((prev) => {
          if (prev) {
            return {
              ...prev,
              finishReviewInvalidError: null,
            }
          } else
            return {
              finishReviewInvalidError: null,
            }
        })
      }
    }
  }

  const handleOnChangeStartSales = (value: Dayjs | null) => {
    validateStartSales(value)
    finishSales && validateFinishSales(finishSales)
    setStartSales(value)
  }
  const handleOnChangeFinishSales = (value: Dayjs | null) => {
    validateFinishSales(value)
    startSales && validateStartSales(startSales)
    setFinishSales(value)
  }

  const handleOnChangeStartReview = (value: Dayjs | null) => {
    validateStartReview(value)
    finishReview && validateFinishReview(finishReview)
    setStartReview(value)
  }

  const handleOnChangeFinishReview = (value: Dayjs | null) => {
    validateFinishReview(value)
    startReview && validateStartReview(startReview)
    setFinishReview(value)
  }

  const handleOnClick = () => {
    setErrors(null)
    const resultStartSales: SafeParseReturnType<
      { startSalesInvalidError: string },
      any
    > = startSalesSchema.safeParse({
      startSalesInvalidError: startSales
        ? dayjs.tz(startSales, "UTC").format("YYYY/MM/DD")
        : "",
    })
    const resultFinishSales: SafeParseReturnType<
      { finishSalesInvalidError: string },
      any
    > = finishSalesSchema.safeParse({
      finishSalesInvalidError: finishSales
        ? dayjs.tz(finishSales, "UTC").format("YYYY/MM/DD")
        : "",
    })
    const resultStartReview: SafeParseReturnType<
      { startReviewInvalidError: string },
      any
    > = startReviewSchema.safeParse({
      startReviewInvalidError: startReview
        ? dayjs.tz(startReview, "UTC").format("YYYY/MM/DD")
        : "",
    })
    const resultFinishReview: SafeParseReturnType<
      { finishReviewInvalidError: string },
      any
    > = finishReviewSchema.safeParse({
      finishReviewInvalidError: finishReview
        ? dayjs.tz(finishReview, "UTC").format("YYYY/MM/DD")
        : "",
    })
    if (
      !resultStartSales.success ||
      !resultFinishSales.success ||
      !resultStartReview.success ||
      !resultFinishReview.success
    ) {
      if (!resultStartSales.success) {
        setErrors(
          (resultStartSales as SafeParseError<string>).error.flatten()
            .fieldErrors,
        )
      } else if (!resultFinishSales.success) {
        setErrors(
          (resultFinishSales as SafeParseError<string>).error.flatten()
            .fieldErrors,
        )
      } else if (!resultStartReview.success) {
        setErrors(
          (resultStartReview as SafeParseError<string>).error.flatten()
            .fieldErrors,
        )
      } else if (!resultFinishReview.success) {
        setErrors(
          (resultFinishReview as SafeParseError<string>).error.flatten()
            .fieldErrors,
        )
      }
      return
    }
    let taxValue = 0
    if (tax) taxValue = 1 + tax / 100
    props.onExact({
      startSales,
      finishSales,
      startReview,
      finishReview,
      taxIncluded,
      tax: taxValue,
    })
  }
  const handleOnClose = () => props.onClose()

  return (
    <div className='relative min-h-[500px] w-[900px]'>
      <div className='pt-[56px]'>
        <p className='text-center text-lg font-bold text-content-default-primary'>
          新規プロジェクト設定
        </p>
        <p className='mt-11 text-center text-sm font-medium text-content-default-primary'>
          期間の設定をしてください
        </p>
      </div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className='mt-[69px] flex flex-col items-center'>
          <div className='flex items-center'>
            <p className='w-40 text-sm font-medium text-content-default-primary'>
              販売期間
            </p>
            <div className='flex items-center space-x-5'>
              <div className='relative flex items-center'>
                <span className='w-[82px] text-sm font-medium text-content-default-primary'>
                  販売開始日
                </span>
                <DatePicker
                  inputFormat='YYYY/MM/DD'
                  value={startSales}
                  onChange={handleOnChangeStartSales}
                  maxDate={finishSales}
                  renderInput={(params) => (
                    <StyledTextField
                      size='small'
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                        placeholder: "20xx/01/31",
                      }}
                    />
                  )}
                />
                {errors?.startSalesInvalidError && (
                  <div className='absolute bottom-[-34px] left-0'>
                    <BaseErrorBody>
                      {errors.startSalesInvalidError}
                    </BaseErrorBody>
                  </div>
                )}
              </div>
              <span className='text-sm font-medium text-content-default-primary'>
                ～
              </span>
              <div className='relative flex items-center'>
                <span className='w-[82px] text-sm font-medium text-content-default-primary'>
                  販売終了日
                </span>
                <DatePicker
                  inputFormat='YYYY/MM/DD'
                  value={finishSales}
                  onChange={handleOnChangeFinishSales}
                  minDate={startSales}
                  renderInput={(params) => (
                    <StyledTextField
                      size='small'
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                        placeholder: "20xx/01/31",
                      }}
                    />
                  )}
                />
                {errors?.finishSalesInvalidError && (
                  <div className='absolute bottom-[-34px] left-0'>
                    <BaseErrorBody>
                      {errors.finishSalesInvalidError}
                    </BaseErrorBody>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='mt-10 flex items-center'>
            <p className='w-40 text-sm font-medium text-content-default-primary'>
              口コミ評価対象期間
            </p>
            <div className='flex items-center space-x-5'>
              <div className='relative flex items-center'>
                <span className='w-[82px] text-sm font-medium text-content-default-primary'>
                  開始日
                </span>
                <DatePicker
                  inputFormat='YYYY/MM/DD'
                  value={startReview}
                  onChange={handleOnChangeStartReview}
                  maxDate={finishReview}
                  renderInput={(params) => (
                    <StyledTextField
                      size='small'
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                        placeholder: "20xx/01/31",
                      }}
                    />
                  )}
                />
                {errors?.startReviewInvalidError && (
                  <div className='absolute bottom-[-34px] left-0'>
                    <BaseErrorBody>
                      {errors.startReviewInvalidError}
                    </BaseErrorBody>
                  </div>
                )}
              </div>
              <span className='text-sm font-medium text-content-default-primary'>
                ～
              </span>
              <div className='relative flex items-center'>
                <span className='w-[82px] text-sm font-medium text-content-default-primary'>
                  終了日
                </span>
                <DatePicker
                  inputFormat='YYYY/MM/DD'
                  value={finishReview}
                  onChange={handleOnChangeFinishReview}
                  minDate={startReview}
                  renderInput={(params) => (
                    <StyledTextField
                      size='small'
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                        placeholder: "20xx/01/31",
                      }}
                    />
                  )}
                />
                {errors?.finishReviewInvalidError && (
                  <div className='absolute bottom-[-34px] left-0'>
                    <BaseErrorBody>
                      {errors.finishReviewInvalidError}
                    </BaseErrorBody>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='mt-10 flex items-center'>
            <p className='w-40 text-sm font-medium text-content-default-primary'>
              消費税
            </p>
            <div className='flex w-[492px] items-center space-x-5'>
              <div className='relative flex w-full items-center'>
                <RadioGroup
                  className='flex flex-row items-center'
                  defaultValue={
                    CreateProjectWithEditionCodeDtoConsumptionTaxEnum.Included
                  }
                  name='tax'
                  onChange={(event) => {
                    setTaxIncluded(
                      event.target
                        .value as CreateProjectWithEditionCodeDtoConsumptionTaxEnum,
                    )
                  }}
                >
                  <Radio
                    size='small'
                    value={
                      CreateProjectWithEditionCodeDtoConsumptionTaxEnum.Included
                    }
                  />
                  <span className='mr-[32px]'>税込</span>
                  <Radio
                    size='small'
                    value={
                      CreateProjectWithEditionCodeDtoConsumptionTaxEnum.Excluded
                    }
                  />
                  <span>税抜</span>
                </RadioGroup>
                {taxIncluded ==
                  CreateProjectWithEditionCodeDtoConsumptionTaxEnum.Excluded && (
                  <div className='relative flex'>
                    <input
                      value={tax}
                      onChange={(e) => {
                        const newValue = parseFloat(e.target.value)
                        if (
                          !isNaN(newValue) &&
                          newValue <= 100 &&
                          newValue >= 0
                        )
                          setTax(newValue)
                      }}
                      type='number'
                      min={0}
                      max={100}
                      className='ml-[26px] h-[32px] w-[80px] rounded-[4px] border-[1px] border-solid pl-[4px] pr-[14px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                    />
                    <span className='absolute right-[5px] top-[50%] translate-y-[-50%]'>
                      %
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </LocalizationProvider>
      <div className='absolute left-0 bottom-0 flex w-full items-center justify-between px-9 pb-9'>
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
          disabled={
            !complete || Object.values(errors).filter((e) => !!e).length > 0
          }
          onClick={handleOnClick}
        >
          次へ
        </MuiButton>
      </div>
    </div>
  )
}

export default ProjectNewSettingPeriodModal
