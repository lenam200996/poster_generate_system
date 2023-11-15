import { useMemo, useState } from "react"
import MuiTextField from "@mui/material/TextField"
import MuiButton from "@mui/material/Button"
import { Dayjs } from "dayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { styled } from "@mui/material/styles"
import { SafeParseError, SafeParseReturnType, z } from "zod"
import errorMessage from "@/config/errorMessage"
import BaseErrorBody from "@/components/base/typography/BaseErrorBody"
import MuiLoadingButton from "@mui/lab/LoadingButton"

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

const schema = z.object({
  updatedInvalidError: z
    .string()
    .regex(
      new RegExp("^[0-9]{4}/(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])$"),
      errorMessage.CALENDAR_DATE_ERROR,
    ),
})

interface Props {
  onClose: Function
  onClickNext: (startSales: Dayjs, finishSales: Dayjs) => void
  apiLoading?: boolean
}

const ProjectDuplicateSalesPeriod = (props: Props) => {
  const [startSales, setStartSales] = useState<Dayjs>(null)
  const [finishSales, setFinishSales] = useState<Dayjs>(null)
  const [errors, setErrors] = useState(null)

  const handleOnChangeStartSales = (value: Dayjs | null) => {
    setErrors(null)
    setStartSales(value)
  }
  const handleOnChangeFinishSales = (value: Dayjs | null) => {
    setErrors(null)
    setFinishSales(value)
  }
  const handleOnClickNext = () => {
    if (startSales && finishSales && finishSales.isBefore(startSales, "day")) {
      setErrors({
        updatedInvalidError: errorMessage.CALENDAR_DATE_BEFORE_ERROR,
      })
      return
    }

    const resultStart: SafeParseReturnType<
      { updatedInvalidError: string },
      any
    > = schema.safeParse({
      updatedInvalidError: startSales ? startSales.format("YYYY/MM/DD") : "",
    })
    const resultEnd: SafeParseReturnType<{ updatedInvalidError: string }, any> =
      schema.safeParse({
        updatedInvalidError: finishSales
          ? finishSales.format("YYYY/MM/DD")
          : "",
      })
    if (!resultStart.success || !resultEnd.success) {
      if (!resultStart.success) {
        setErrors(
          (resultStart as SafeParseError<string>).error.flatten().fieldErrors,
        )
      } else if (!resultEnd.success) {
        setErrors(
          (resultEnd as SafeParseError<string>).error.flatten().fieldErrors,
        )
      }
      return
    }
    props.onClickNext(startSales, finishSales)
  }

  const isNextDisabled = useMemo(() => {
    return startSales === null || finishSales === null
  }, [startSales, finishSales])

  return (
    <div className='relative h-[320px] w-[600px]'>
      <div className='pt-[56px]'>
        <p className='text-center text-lg font-bold text-content-default-primary'>
          プロジェクト複製確認
        </p>
        <p className='mt-4 text-center text-sm font-medium text-content-default-primary'>
          販売期間を設定してください
        </p>
      </div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className='flex flex-col items-center justify-center'>
          <div className='relative flex w-full flex-col items-center'>
            <div className='flex flex-col items-center'>
              <div className='mt-9 flex items-center space-x-3'>
                <DatePicker
                  inputFormat='YYYY/MM/DD'
                  value={startSales}
                  maxDate={finishSales}
                  onChange={handleOnChangeStartSales}
                  renderInput={(params) => (
                    <StyledTextField
                      size='small'
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                        placeholder: "20xx/1/31",
                      }}
                    />
                  )}
                />
                <span className='text-sm font-medium text-content-default-primary'>
                  ～
                </span>
                <DatePicker
                  inputFormat='YYYY/MM/DD'
                  value={finishSales}
                  minDate={startSales}
                  onChange={handleOnChangeFinishSales}
                  renderInput={(params) => (
                    <StyledTextField
                      size='small'
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                        placeholder: "20xx/1/31",
                      }}
                    />
                  )}
                />
              </div>
              {errors?.updatedInvalidError && (
                <div className='w-full pt-1'>
                  <BaseErrorBody>{errors.updatedInvalidError}</BaseErrorBody>
                </div>
              )}
            </div>
          </div>
        </div>
      </LocalizationProvider>
      <div className='absolute left-0 bottom-0 flex w-full items-center justify-between px-9 pb-9'>
        <MuiButton
          color='inherit'
          variant='outlined'
          sx={{ width: 104 }}
          onClick={() => props.onClose()}
        >
          キャンセル
        </MuiButton>
        <MuiLoadingButton
          variant='contained'
          sx={{ width: 104 }}
          disabled={isNextDisabled}
          onClick={handleOnClickNext}
          loading={props.apiLoading}
        >
          確定
        </MuiLoadingButton>
      </div>
    </div>
  )
}

export default ProjectDuplicateSalesPeriod
