import { useState, useEffect } from "react"
import BaseFilterSelect from "@/components/base/form/BaseFilterSelect"
import MuiTextField from "@mui/material/TextField"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { styled } from "@mui/material/styles"
import { Dayjs } from "dayjs"
import dayjs from "@/util/dayjs"
import { SafeParseError, SafeParseReturnType, z } from "zod"
import errorMessage from "@/config/errorMessage"
import BaseErrorBody from "@/components/base/typography/BaseErrorBody"
const utc = require("dayjs/plugin/utc") // Import plugin utc
const timezone = require("dayjs/plugin/timezone") // Import plugin timezone
dayjs.extend(utc) // Extend dayjs with utc
dayjs.extend(timezone) // Extend dayjs with timezone
interface Props {
  start?: string
  end?: string
  placeholder: string
  onExact: Function
}

const StyledTextField = styled(MuiTextField)((props) => ({
  "& .MuiInputBase-root": {
    borderColor: "#C0C8CC",
    width: "140px",
    height: "32px",
  },
  "& .MuiInputBase-input": {
    fontSize: 14,
    padding: "0 8px",
  },
}))

const schema = z.object({
  updatedInvalidError: z
    .string()
    .regex(
      new RegExp("^[0-9]{4}/(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])$"),
      errorMessage.CALENDAR_DATE_ERROR,
    ),
})

const BaseFilterCalender = (props: Props) => {
  const [startDate, setStartDate] = useState<Dayjs>(
    props.start ? dayjs(props.start) : null,
  )
  const [endDate, setEndDate] = useState<Dayjs>(
    props.end ? dayjs(props.end) : null,
  )
  const [startDateError, setStartDateError] = useState(null)
  const [endDateError, setEndDateError] = useState(null)

  const handleOnChangeStartDate = (value: Dayjs | null) => setStartDate(value)
  const handleOnChangeEndDate = (value: Dayjs | null) => setEndDate(value)
  const handleExact = () => {
    const resultStart: SafeParseReturnType<
      { updatedInvalidError: string },
      any
    > = schema.safeParse({
      updatedInvalidError: startDate
        ? dayjs.tz(startDate, "UTC").format("YYYY/MM/DD")
        : null,
    })
    const resultEnd: SafeParseReturnType<{ updatedInvalidError: string }, any> =
      schema.safeParse({
        updatedInvalidError: endDate
          ? dayjs.tz(endDate, "UTC").format("YYYY/MM/DD")
          : null,
      })
    if (startDate !== null && !resultStart.success) {
      setStartDateError(
        (resultStart as SafeParseError<string>).error.flatten().fieldErrors,
      )
    } else {
      setStartDateError(null)
    }
    if (endDate !== null && !resultEnd.success) {
      setEndDateError(
        (resultEnd as SafeParseError<string>).error.flatten().fieldErrors,
      )
    } else {
      setEndDateError(null)
    }
    if (
      (startDate !== null && !resultStart.success) ||
      (endDate !== null && !resultEnd.success)
    )
      return
    props.onExact(
      startDate ? dayjs.tz(startDate, "UTC").format("YYYY/MM/DD") : "",
      endDate ? dayjs.tz(endDate, "UTC").format("YYYY/MM/DD") : "",
    )
  }

  useEffect(() => {
    setStartDate(props.start ? dayjs(props.start) : null)
    setEndDate(props.end ? dayjs(props.end) : null)

    if (props.start === undefined) {
      setStartDateError(null)
    }
    if (props.end === undefined) {
      setEndDateError(null)
    }
  }, [props.start, props.end])

  return (
    <BaseFilterSelect
      placeholder={props.placeholder}
      onExact={handleExact}
      validationError={
        startDateError?.updatedInvalidError || endDateError?.updatedInvalidError
      }
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className='flex items-center space-x-3 pt-3'>
          <DatePicker
            inputFormat='YYYY/MM/DD'
            value={startDate}
            maxDate={endDate}
            onChange={handleOnChangeStartDate}
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
          <span className=''>〜</span>
          <DatePicker
            inputFormat='YYYY/MM/DD'
            value={endDate}
            onChange={handleOnChangeEndDate}
            minDate={startDate}
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
        </div>
        {startDateError?.updatedInvalidError && (
          <div className='pt-1'>
            <BaseErrorBody>
              開始{startDateError.updatedInvalidError}
            </BaseErrorBody>
          </div>
        )}
        {endDateError?.updatedInvalidError && (
          <div className='pt-1'>
            <BaseErrorBody>
              終了{endDateError.updatedInvalidError}
            </BaseErrorBody>
          </div>
        )}
      </LocalizationProvider>
    </BaseFilterSelect>
  )
}
export default BaseFilterCalender
