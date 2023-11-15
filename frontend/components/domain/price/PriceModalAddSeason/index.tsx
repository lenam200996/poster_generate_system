import { useEffect, useMemo, useState } from "react"
import BaseModal from "@/components/base/overlay/BaseModal/index"
import MuiButton from "@mui/material/Button"
import MuiTextField from "@mui/material/TextField"
import { styled } from "@mui/material/styles"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import dayjs from "@/util/dayjs"
import { SafeParseError, SafeParseReturnType, z } from "zod"
import errorMessage from "@/config/errorMessage"
import BaseErrorBody from "@/components/base/typography/BaseErrorBody"
import { DocumentPartsResponseDtoDocumentPartsClassEnum } from "@/openapi"
const utc = require("dayjs/plugin/utc") // Import plugin utc
const timezone = require("dayjs/plugin/timezone") // Import plugin timezone
dayjs.extend(utc) // Extend dayjs with utc
dayjs.extend(timezone) // Extend dayjs with timezone
type PriedType = Array<{
  ranges: Array<{ startDate: dayjs.Dayjs; endDate: dayjs.Dayjs }>
}>
interface Props {
  manuscriptName: string
  onClose?: () => void
  onChange?: (value: PriedType) => void
  periods: PriedType
  startDate: dayjs.Dayjs | undefined
  endDate: dayjs.Dayjs | undefined
}

let seasonId = 1

const StyledTextField = styled(MuiTextField)((props) => ({
  "& .MuiInputBase-root": {
    backgroundColor: props.inputProps.value === "" ? "#FBFBFB" : "#FFFFFF",
    borderColor: "#C0C8CC",
    width: "140px",
    height: "32px",
  },
  "& .MuiInputBase-input": {
    fontSize: 14,
    padding: "0 0 0 8px",
  },
}))

const PriceModalAddSeason = (props: Props) => {
  const [seasons, setSeasons] = useState<Array<{ id: number; date: string }>>(
    [],
  )

  const [dates, setDates] = useState<
    Array<{ startDate: dayjs.Dayjs; endDate: dayjs.Dayjs }>
  >([{ startDate: null, endDate: null }])

  const [startDateErrors, setStartDateErrors] = useState([])
  const [endDateErrors, setEndDateErrors] = useState([])

  useEffect(() => {
    setSeasons(
      props.periods.map((period, i) => ({
        id: i,
        date: period.ranges
          .map(
            (ss) =>
              `${dayjs.tz(ss.startDate, "UTC").format("YYYY/MM/DD")}〜${dayjs
                .tz(ss.endDate, "UTC")
                .format("YYYY/MM/DD")}`,
          )
          .join(","),
      })),
    )
  }, [props.periods])

  const schema = z.object({
    updatedInvalidError: z
      .string()
      .regex(
        new RegExp("^[0-9]{4}/(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])$"),
        errorMessage.CALENDAR_DATE_ERROR,
      ),
  })

  const handleOnClickClose = () => {
    props.onClose()
  }

  const isConflictDate = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
    if (seasons.length === 0) return false
    const newRanges = getAllDates(startDate, endDate)
    return seasons.some((ss) => {
      return ss.date.split(",").some((ssDate) => {
        let dSplit = ssDate.split("〜")
        const savedRanges = getAllDates(
          dayjs.tz(dSplit[0], "UTC"),
          dayjs.tz(dSplit[1], "UTC"),
        )
        return newRanges.some((d) =>
          savedRanges.find((sd) => dayjs.tz(sd, "UTC").isSame(d, "day")),
        )
      })
    })
  }

  const inRangeAll = (d: dayjs.Dayjs) => {
    let startSale = dayjs.tz(props.startDate, "UTC")
    let endSale = dayjs.tz(props.endDate, "UTC")
    return (
      (startSale.isSame(d) || startSale.isBefore(d)) &&
      (endSale.isSame(d) || endSale.isAfter(d))
    )
  }

  const outRangeAll = (d: dayjs.Dayjs) => {
    let startSale = dayjs.tz(props.startDate, "UTC")
    let endSale = dayjs.tz(props.endDate, "UTC")
    return (
      startSale.isSame(d) ||
      startSale.isAfter(d) ||
      endSale.isSame(d) ||
      endSale.isBefore(d)
    )
  }

  const validRanges = (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
    // not set sale time
    if (!props.startDate.isValid() && !props.endDate.isValid()) return true
    if (!start.isValid() || !end.isValid()) return true
    // 1 date
    if (start.isSame(end) && inRangeAll(start)) return true

    // min day isSameOrAfter start sale day && max day isSameOrBefore end sale day
    if (inRangeAll(start) && inRangeAll(end)) return true

    // min day isSameOrBefore start sale day && max day isSameOrAfter end sale day
    if (outRangeAll(start) && outRangeAll(end)) return true

    return false
  }

  const handleOnChangeStartDate = ({
    index,
    value,
  }: {
    index: number
    value: dayjs.Dayjs
  }) => {
    const newStartDateErrors = [...startDateErrors]
    newStartDateErrors[index] = null

    const result: SafeParseReturnType<{ updatedInvalidError: string }, any> =
      schema.safeParse({
        updatedInvalidError: dayjs.tz(value, "UTC")
          ? dayjs.tz(value, "UTC").format("YYYY/MM/DD")
          : "",
      })

    if (!result.success) {
      newStartDateErrors[index] = (
        result as SafeParseError<string>
      ).error.flatten().fieldErrors
    }

    if (dayjs.tz(value, "UTC").isAfter(dates[index].endDate)) {
      newStartDateErrors[index] = {
        updatedInvalidError: errorMessage.CALENDAR_DATE_BEFORE_ERROR,
      }
    }

    let startDate = dayjs
      .tz(value, "UTC")
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
    let endDate = dayjs
      .tz(dates[index].endDate, "UTC")
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
    // if (isConflictDate(value)) {
    //   return alert("期間が選択できません。")
    // }

    const newDates = dates.map((date, dateIndex) => {
      if (dateIndex === index) {
        return {
          startDate: value,
          endDate: date.endDate,
        }
      } else {
        return date
      }
    })
    // if (validRanges(startDate, endDate)) {
    setDates(newDates)
    setStartDateErrors(newStartDateErrors)
    // } else {
    //   return alert("期間が選択できません。")
    // }
  }

  const handleOnChangeEndDate = ({
    index,
    value,
  }: {
    index: number
    value: dayjs.Dayjs
  }) => {
    const newEndDateErrors = [...endDateErrors]
    newEndDateErrors[index] = null

    const result: SafeParseReturnType<{ updatedInvalidError: string }, any> =
      schema.safeParse({
        updatedInvalidError: dayjs.tz(value, "UTC")
          ? dayjs.tz(value, "UTC").format("YYYY/MM/DD")
          : "",
      })

    if (!result.success) {
      newEndDateErrors[index] = (
        result as SafeParseError<string>
      ).error.flatten().fieldErrors
    }

    if (dayjs.tz(value, "UTC").isBefore(dates[index].startDate)) {
      newEndDateErrors[index] = {
        updatedInvalidError: errorMessage.CALENDAR_DATE_BEFORE_ERROR,
      }
    }

    let startDate = dayjs
      .tz(dates[index].startDate, "UTC")
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
    let endDate = dayjs
      .tz(value, "UTC")
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
    if (isConflictDate(startDate, endDate)) {
      return alert("期間が選択できません。")
    }
    const newDates = dates.map((date, dateIndex) => {
      if (dateIndex === index) {
        return {
          startDate: date.startDate,
          endDate: value,
        }
      } else {
        return date
      }
    })
    setDates(newDates)
    setStartDateErrors(newEndDateErrors)
  }

  const checkRegister = () => {
    return (
      dates[0].startDate === null ||
      dates[0].endDate === null ||
      Number.isNaN(dayjs(dates[0].startDate).millisecond()) ||
      Number.isNaN(dayjs(dates[0].endDate).millisecond()) ||
      dayjs.tz(dates[0].startDate, "UTC").isAfter(dates[0].endDate)
    )
  }

  const checkEnableDates = () => {
    return dates.some((date) => !date.startDate || !date.endDate)
  }

  const handleOnClickAddDateInputForm = () => {
    setDates((state) => [...state, { startDate: null, endDate: null }])
  }

  const handleOnClickRegister = () => {
    if (seasons.length >= 20) return alert("登録できるシーズンは20件です")
    const formattedDates = dates
      .map((date) => {
        // 日付として正しい値かどうかを確認
        if (
          date.startDate === null ||
          date.endDate === null ||
          Number.isNaN(dayjs(date.startDate).millisecond()) ||
          Number.isNaN(dayjs(date.endDate).millisecond()) ||
          dayjs.tz(date.startDate, "UTC").isAfter(date.endDate)
        )
          return
        else
          return `${dayjs
            .tz(date.startDate, "UTC")
            .format("YYYY/MM/DD")}〜${dayjs
            .tz(date.endDate, "UTC")
            .format("YYYY/MM/DD")}`
      })
      .filter((d) => d)
      .join(",")

    setSeasons((state) => [...state, { id: seasonId++, date: formattedDates }])
    let periodChanged = [
      ...seasons,
      { id: seasonId++, date: formattedDates },
    ].map((season) => {
      return {
        ranges: season.date.split(",").map((ss) => {
          return {
            startDate: dayjs
              .tz(ss.split("〜")[0], "UTC")
              .hour(0)
              .minute(0)
              .second(0)
              .millisecond(0),
            endDate: dayjs
              .tz(ss.split("〜")[1], "UTC")
              .hour(0)
              .minute(0)
              .second(0)
              .millisecond(0),
          }
        }),
      }
    })
    props.onChange(periodChanged)
    setDates([{ startDate: null, endDate: null }])
  }

  const handleOnClickDeleteSeason = ({ seasonId }: { seasonId: number }) => {
    setSeasons((state) => state.filter((item) => item.id !== seasonId))
  }

  const getAllDates = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
    if (!startDate.isValid() || !endDate.isValid()) return []
    let dates = []
    var d = startDate.clone()
    while (d.isBefore(endDate)) {
      dates.push(d)
      d = d.add(1, "day").clone()
    }
    return dates
  }

  const allPeriodDays = useMemo(() => {
    let dates = []
    props.periods.forEach((period) => {
      if (period.ranges.length > 0) {
        period.ranges.forEach((range) => {
          dates = dates.concat(getAllDates(range.startDate, range.endDate))
        })
      }
    })
    return dates
  }, [props.periods])

  const disableDates = (date) => {
    const input = dayjs.tz(date, "UTC")
    return allPeriodDays.some((d) => input.isSame(d, "day"))
  }
  return (
    <div>
      <BaseModal shown={true} onClickClose={handleOnClickClose}>
        <div className='relative h-[640px] w-[1200px] pt-[56px]'>
          <p className='text-center text-lg font-bold'>シーズン登録/更新</p>
          <p className='mt-8 text-center text-sm font-bold'>
            {props.manuscriptName}
          </p>

          {/* in content */}
          <div className='mt-12 max-h-[368px] overflow-y-scroll'>
            <div className='ml-[140px] flex items-start'>
              <p className='relative top-2 text-sm font-medium'>シーズン期間</p>
              <div className='ml-[58px]'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  {dates.map((date, index) => (
                    <div className='mb-4 flex items-center' key={index}>
                      <div className='flex flex-col'>
                        <div className='flex items-center'>
                          <span className='text-sm font-medium text-content-default-primary'>
                            開始日
                          </span>
                          <div className='ml-9'>
                            <DatePicker
                              minDate={props.startDate}
                              defaultCalendarMonth={dayjs.tz(
                                props.startDate,
                                "UTC",
                              )}
                              inputFormat='YYYY/MM/DD'
                              value={date.startDate || null}
                              maxDate={date.endDate || props.endDate}
                              shouldDisableDate={disableDates}
                              onChange={(value) =>
                                handleOnChangeStartDate({ index, value })
                              }
                              renderInput={(params) => (
                                <StyledTextField
                                  size='small'
                                  {...params}
                                  inputProps={{
                                    ...params.inputProps,
                                    placeholder: "20xx/1/31",
                                  }}
                                  error={!!startDateErrors[index]}
                                />
                              )}
                            />
                          </div>
                        </div>
                        {startDateErrors[index] && (
                          <div className='w-[225px] pt-1'>
                            <BaseErrorBody>
                              {startDateErrors[index].updatedInvalidError}
                            </BaseErrorBody>
                          </div>
                        )}
                      </div>
                      <span className='mx-5 text-sm font-medium text-content-default-primary'>
                        ～
                      </span>
                      <div className='flex flex-col'>
                        <div className='flex items-center'>
                          <span className='text-sm font-medium text-content-default-primary'>
                            終了日
                          </span>
                          <div className='ml-9'>
                            <DatePicker
                              minDate={
                                dayjs(date.startDate).isValid()
                                  ? dayjs.tz(date.startDate, "UTC")
                                  : props.startDate
                              }
                              maxDate={props.endDate}
                              defaultCalendarMonth={dayjs.tz(
                                props.startDate,
                                "UTC",
                              )}
                              inputFormat='YYYY/MM/DD'
                              value={date.endDate || null}
                              shouldDisableDate={disableDates}
                              onChange={(value) =>
                                handleOnChangeEndDate({ index, value })
                              }
                              renderInput={(params) => (
                                <StyledTextField
                                  size='small'
                                  {...params}
                                  inputProps={{
                                    ...params.inputProps,
                                    placeholder: "20xx/1/31",
                                  }}
                                  error={!!endDateErrors[index]}
                                />
                              )}
                            />
                          </div>
                        </div>
                        {endDateErrors[index] && (
                          <div className='w-[225px] pt-1'>
                            <BaseErrorBody>
                              {endDateErrors[index].updatedInvalidError}
                            </BaseErrorBody>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className='mt-6'>
                    <MuiButton
                      size='small'
                      variant='contained'
                      sx={{ width: 104 }}
                      disabled={checkEnableDates()}
                      onClick={handleOnClickAddDateInputForm}
                    >
                      期間追加
                    </MuiButton>
                  </div>
                </LocalizationProvider>
              </div>
              <div className='ml-[208px]'>
                <MuiButton
                  size='small'
                  variant='contained'
                  sx={{ width: 104 }}
                  disabled={checkRegister()}
                  onClick={handleOnClickRegister}
                >
                  登録
                </MuiButton>
              </div>
            </div>

            {seasons.length > 0 && (
              <div className='mx-auto mt-11 w-[940px] pt-8 pb-[56px]'>
                <p className='text-sm font-medium'>設定済みシーズン</p>
                {seasons.map((season, i) => (
                  <div
                    key={season.id}
                    className='mt-10 flex items-center first-of-type:mt-6'
                  >
                    <p className='text-sm font-medium'>{i + 1}</p>
                    <div className='ml-9 flex-1'>
                      {season.date.split(",").map((item, i) => (
                        <p key={i} className='text-sm'>
                          {item}
                        </p>
                      ))}
                    </div>
                    <MuiButton
                      variant='contained'
                      size='small'
                      sx={{ width: 104 }}
                      onClick={() =>
                        handleOnClickDeleteSeason({ seasonId: season.id })
                      }
                    >
                      削除
                    </MuiButton>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* end content */}

          <div className='absolute left-0 bottom-0 flex w-full justify-center px-9 pb-9'>
            <MuiButton
              color='inherit'
              variant='outlined'
              sx={{ width: 104 }}
              onClick={handleOnClickClose}
            >
              閉じる
            </MuiButton>
          </div>
        </div>
      </BaseModal>
    </div>
  )
}

export default PriceModalAddSeason
