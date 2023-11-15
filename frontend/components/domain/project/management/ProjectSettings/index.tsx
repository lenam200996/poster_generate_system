import { ChangeEventHandler, useState, useEffect, useMemo } from "react"
import { styled } from "@mui/material/styles"
import { Dayjs } from "dayjs"
import dayjs from "@/util/dayjs"
import MuiTextField from "@mui/material/TextField"
import MuiButton from "@mui/material/Button"
import MuiLink from "@mui/material/Link"
import MuiCheckbox from "@mui/material/Checkbox"
import MuiFormControlLabel from "@mui/material/FormControlLabel"
import MuiFormGroup from "@mui/material/FormGroup"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { copiesMock } from "@/config/api/mock/projects"
import { ProjectsWithImagesResponseDto } from "@/openapi/api"
import {
  Radio,
  FormControlLabel,
  MenuItem as MuiMenuItem,
  Select as MuiSelect,
} from "@mui/material"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import RadioGroup from "@mui/material/RadioGroup"
import { taxOptions } from "@/config/options"
import { ProjectSettings as ProjectSettingsType } from "@/types/page/projectlist/projectSettings"
import generateFileNameFromPath from "@/util/generateFileNameFromPath"
import { SafeParseError, SafeParseReturnType, z } from "zod"
import errorMessage from "@/config/errorMessage"
import BaseErrorBody from "@/components/base/typography/BaseErrorBody"
import MuiLoadingButton from "@mui/lab/LoadingButton"
const utc = require("dayjs/plugin/utc") // Import plugin utc
const timezone = require("dayjs/plugin/timezone") // Import plugin timezone
dayjs.extend(utc) // Extend dayjs with utc
dayjs.extend(timezone) // Extend dayjs with timezone
const StyledCalendarTextField = styled(MuiTextField)((props) => ({
  "& .MuiInputBase-root": {
    backgroundColor: props.inputProps.value === "" ? "#FBFBFB" : "#FFFFFF",
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

const TableRow = (props: {
  children?: any
  heading: string
  subHeading?: string
}) => (
  <tr className='border-b border-container-sleep-secondary'>
    <th className='min-w-[200px] p-0'>
      <div className='flex min-h-[55px] flex-col items-start py-3 px-0 font-medium'>
        {props.heading}
        {props.subHeading ? <span>{props.subHeading}</span> : null}
      </div>
    </th>
    <td className='flex items-center p-0'>
      <div className='flex items-center py-3'>{props.children}</div>
    </td>
  </tr>
)

const FileSelectButton = (props: {
  name: string
  value?: string
  path: string
  accept?: string
  onChange: ChangeEventHandler<HTMLInputElement>
  onClickDeleteFile: (key: string) => void
}) => (
  <div className='flex items-center space-x-3'>
    {props.value ? (
      <>
        <MuiLink underline='none' href={props.path} download={props.value}>
          <div className='text-sm font-bold text-container-active-primary underline'>
            {props.value}
          </div>
        </MuiLink>
        <BaseButtonIconText
          icon='delete'
          text='削除'
          onClick={() => props.onClickDeleteFile(props.name)}
        />
      </>
    ) : (
      <>
        <span className='font-normal'>未選択</span>
        <MuiButton
          variant='contained'
          size='small'
          component='label'
          sx={{ minWidth: 47, minHeight: 30, padding: "4px 10px" }}
        >
          選択
          <input
            type='file'
            className='hidden'
            name={props.name}
            onChange={props.onChange}
            accept={props.accept}
          />
        </MuiButton>
      </>
    )}
  </div>
)

interface Settings {
  [key: string]: { name: any; file: any } | any
}

interface Props {
  project: ProjectsWithImagesResponseDto
  headings: { label: string; value: number }[]
  footers: { label: string; value: number }[]
  thumbIndexes: { label: string; value: number }[]
  onSave: (settings: Settings, selectedPlates: string[]) => void
}

const requiredSettingItems = [
  "salesStartDate", // 販売開始日
  "salesEndDate", // 販売終了日
  "reviewRatingStartDate", // 口コミ評価対象開始日
  "reviewRatingEndDate", // 口コミ評価対象終了日
  "consumptionTax", // 消費税
  "thumbIndexId", // ツメ見出し
  "headLineId", // 見出し
  "pageMountId", // 欄外下画像
  "issueDataImage", // 月号データ
]

const ProjectSettings = (props: Props) => {
  const [settings, setSettings] = useState<ProjectSettingsType>(undefined)
  const [selectedPlates, setSelectedPlates] = useState(
    props.project.booklets.map((booklet) => booklet.masterEditionCode.name),
  )

  const [salesStartDate, setSalesStartDate] = useState<Dayjs>(
    props.project.salesStartDate
      ? dayjs(props.project.salesStartDate)
      : undefined,
  )
  const [salesEndDate, setSalesEndDate] = useState<Dayjs>(
    props.project.salesEndDate ? dayjs(props.project.salesEndDate) : undefined,
  )

  const [reviewStartDate, setReviewStartDate] = useState<Dayjs>(
    props.project.reviewRatingStartDate
      ? dayjs(props.project.reviewRatingStartDate)
      : undefined,
  )
  const [reviewEndDate, setReviewEndDate] = useState<Dayjs>(
    props.project.reviewRatingEndDate
      ? dayjs(props.project.reviewRatingEndDate)
      : undefined,
  )

  const handleOnChangeRadio: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSettings((state) => ({
      ...state,
      [event.target.name]: event.target.value,
    }))
  }

  const IMPORT_DATA_FORMAT = ["eps"]
  const fileSchema = z.object({
    fileFormatError: z
      .string()
      .refine(
        (file) =>
          IMPORT_DATA_FORMAT.includes(file.split(".").pop().toLowerCase()),
        errorMessage.EPS_FORMAT_ERROR,
      ),
  })
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({})

  const handleOnChangeFileSelect: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    if (event.currentTarget.files.length > 0) {
      const file = event.currentTarget.files[0]
      const targetName = event.target.name
      const result = fileSchema.safeParse({ fileFormatError: file.name })

      if (!result.success) {
        const errorResult = result as SafeParseError<{
          fileFormatError: string
        }>
        const fieldErrors = errorResult.error.flatten().fieldErrors
        if (fieldErrors.fileFormatError) {
          setFileErrors((prev) => ({
            ...prev,
            [targetName]: fieldErrors.fileFormatError[0],
          }))
        }
        return
      } else {
        setFileErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[targetName]
          return newErrors
        })
      }

      let fileData: { fileName: string; base64: any } = null
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        fileData = {
          fileName: file.name,
          base64: event.target.result,
        }
        setSettings((state) => ({
          ...state,
          [targetName]: {
            file,
            name: fileData.fileName,
            path: fileData.base64,
          },
        }))
      }
    }
  }

  const handleOnChangePlateCheckbox: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const { value, checked } = event.target
    if (checked) {
      setSelectedPlates((state) => [...state, value])
    } else {
      setSelectedPlates((state) => state.filter((plate) => plate !== value))
    }
  }

  const handleOnChangeSelect: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setSettings((state) => ({
      ...state,
      [event.target.name]: event.target.value,
    }))
  }

  const handleOnClickDeleteFile = (key: string) => {
    setSettings((state) => ({
      ...state,
      [key]: undefined,
    }))
  }

  useEffect(() => {
    setSettings((state) => ({
      ...state,
      salesStartDate:
        salesStartDate === null
          ? ""
          : dayjs.tz(salesStartDate, "UTC").format("YYYY-MM-DD"),
      salesEndDate:
        salesEndDate === null
          ? ""
          : dayjs.tz(salesEndDate, "UTC").format("YYYY-MM-DD"),
      reviewRatingStartDate:
        reviewStartDate === null
          ? ""
          : dayjs.tz(reviewStartDate, "UTC").format("YYYY-MM-DD"),
      reviewRatingEndDate:
        reviewEndDate === null
          ? ""
          : dayjs.tz(reviewEndDate, "UTC").format("YYYY-MM-DD"),
    }))
  }, [salesStartDate, salesEndDate, reviewStartDate, reviewEndDate])

  useEffect(() => {
    setSelectedPlates(
      props.project.booklets.map((booklet) => booklet.masterEditionCode.code),
    )
    const formattedSettings: ProjectSettingsType = {
      salesStartDate: props.project.salesStartDate,
      salesEndDate: props.project.salesEndDate,
      reviewRatingStartDate: props.project.reviewRatingStartDate,
      reviewRatingEndDate: props.project.reviewRatingEndDate,
      thumbIndexId: props.project.thumbIndexId,
      headLineId: props.project.headLineId,
      pageMountId: props.project.pageMount && props.project.pageMount.id,
      consumptionTax: props.project.consumptionTax ?? "TAX_INCLUDED",
      openAirIconOn: props.project.openAirIconOn
        ? {
            file: undefined,
            name: generateFileNameFromPath(props.project.openAirIconOn),
            path: props.project.openAirIconOn,
          }
        : undefined,
      openAirIconOff: props.project.openAirIconOff
        ? {
            file: undefined,
            name: generateFileNameFromPath(props.project.openAirIconOff),
            path: props.project.openAirIconOff,
          }
        : undefined,
      freeFlowingIconOn: props.project.freeFlowingIconOn
        ? {
            file: undefined,
            name: generateFileNameFromPath(props.project.freeFlowingIconOn),
            path: props.project.freeFlowingIconOn,
          }
        : undefined,
      freeFlowingIconOff: props.project.freeFlowingIconOff
        ? {
            file: undefined,
            name: generateFileNameFromPath(props.project.freeFlowingIconOff),
            path: props.project.freeFlowingIconOff,
          }
        : undefined,
      elevatorIconOn: props.project.elevatorIconOn
        ? {
            file: undefined,
            name: generateFileNameFromPath(props.project.elevatorIconOn),
            path: props.project.elevatorIconOn,
          }
        : undefined,
      elevatorIconOff: props.project.elevatorIconOff
        ? {
            file: undefined,
            name: generateFileNameFromPath(props.project.elevatorIconOff),
            path: props.project.elevatorIconOff,
          }
        : undefined,
      sameDayReservationIconOn: props.project.sameDayReservationIconOn
        ? {
            file: undefined,
            name: generateFileNameFromPath(
              props.project.sameDayReservationIconOn,
            ),
            path: props.project.sameDayReservationIconOn,
          }
        : undefined,
      sameDayReservationIconOff: props.project.sameDayReservationIconOff
        ? {
            file: undefined,
            name: generateFileNameFromPath(
              props.project.sameDayReservationIconOff,
            ),
            path: props.project.sameDayReservationIconOff,
          }
        : undefined,
      pickUpAvailableIconOn: props.project.pickUpAvailableIconOn
        ? {
            file: undefined,
            name: generateFileNameFromPath(props.project.pickUpAvailableIconOn),
            path: props.project.pickUpAvailableIconOn,
          }
        : undefined,
      pickUpAvailableIconOff: props.project.pickUpAvailableIconOff
        ? {
            file: undefined,
            name: generateFileNameFromPath(
              props.project.pickUpAvailableIconOff,
            ),
            path: props.project.pickUpAvailableIconOff,
          }
        : undefined,
      noSmokingIconOn: props.project.noSmokingIconOn
        ? {
            file: undefined,
            name: generateFileNameFromPath(props.project.noSmokingIconOn),
            path: props.project.noSmokingIconOn,
          }
        : undefined,
      noSmokingIconOff: props.project.noSmokingIconOff
        ? {
            file: undefined,
            name: generateFileNameFromPath(props.project.noSmokingIconOff),
            path: props.project.noSmokingIconOff,
          }
        : undefined,
      dinnerVenueMeal: props.project.dinnerVenueMeal
        ? {
            file: undefined,
            name: generateFileNameFromPath(props.project.dinnerVenueMeal),
            path: props.project.dinnerVenueMeal,
          }
        : undefined,
      dinnerPrivateRoomDining: props.project.dinnerPrivateRoomDining
        ? {
            file: undefined,
            name: generateFileNameFromPath(
              props.project.dinnerPrivateRoomDining,
            ),
            path: props.project.dinnerPrivateRoomDining,
          }
        : undefined,
      dinnerRoomMeal: props.project.dinnerRoomMeal
        ? {
            file: undefined,
            name: generateFileNameFromPath(props.project.dinnerRoomMeal),
            path: props.project.dinnerRoomMeal,
          }
        : undefined,
      dinnerVenueMealOorPrivateDiningRoom: props.project
        .dinnerVenueMealOorPrivateDiningRoom
        ? {
            file: undefined,
            name: generateFileNameFromPath(
              props.project.dinnerVenueMealOorPrivateDiningRoom,
            ),
            path: props.project.dinnerVenueMealOorPrivateDiningRoom,
          }
        : undefined,
      dinnerVenueMealOrRoomService: props.project.dinnerVenueMealOrRoomService
        ? {
            file: undefined,
            name: generateFileNameFromPath(
              props.project.dinnerVenueMealOrRoomService,
            ),
            path: props.project.dinnerVenueMealOrRoomService,
          }
        : undefined,
      dinnerRoomOrPrivateDiningRoom: props.project.dinnerRoomOrPrivateDiningRoom
        ? {
            file: undefined,
            name: generateFileNameFromPath(
              props.project.dinnerRoomOrPrivateDiningRoom,
            ),
            path: props.project.dinnerRoomOrPrivateDiningRoom,
          }
        : undefined,
      dinnerNone: props.project.dinnerNone
        ? {
            file: undefined,
            name: generateFileNameFromPath(props.project.dinnerNone),
            path: props.project.dinnerNone,
          }
        : undefined,
      breakfastVenueMeal: props.project.breakfastVenueMeal
        ? {
            file: undefined,
            name: generateFileNameFromPath(props.project.breakfastVenueMeal),
            path: props.project.breakfastVenueMeal,
          }
        : undefined,
      breakfastPrivateRoomDining: props.project.breakfastPrivateRoomDining
        ? {
            file: undefined,
            name: generateFileNameFromPath(
              props.project.breakfastPrivateRoomDining,
            ),
            path: props.project.breakfastPrivateRoomDining,
          }
        : undefined,
      breakfastRoomMeal: props.project.breakfastRoomMeal
        ? {
            file: undefined,
            name: generateFileNameFromPath(props.project.breakfastRoomMeal),
            path: props.project.breakfastRoomMeal,
          }
        : undefined,
      breakfastVenueMealOorPrivateDiningRoom: props.project
        .breakfastVenueMealOorPrivateDiningRoom
        ? {
            file: undefined,
            name: generateFileNameFromPath(
              props.project.breakfastVenueMealOorPrivateDiningRoom,
            ),
            path: props.project.breakfastVenueMealOorPrivateDiningRoom,
          }
        : undefined,
      breakfastVenueMealOrRoomService: props.project
        .breakfastVenueMealOrRoomService
        ? {
            file: undefined,
            name: generateFileNameFromPath(
              props.project.breakfastVenueMealOrRoomService,
            ),
            path: props.project.breakfastVenueMealOrRoomService,
          }
        : undefined,
      breakfastRoomOrPrivateDiningRoom: props.project
        .breakfastRoomOrPrivateDiningRoom
        ? {
            file: undefined,
            name: generateFileNameFromPath(
              props.project.breakfastRoomOrPrivateDiningRoom,
            ),
            path: props.project.breakfastRoomOrPrivateDiningRoom,
          }
        : undefined,
      breakfastNone: props.project.breakfastNone
        ? {
            file: undefined,
            name: generateFileNameFromPath(props.project.breakfastNone),
            path: props.project.breakfastNone,
          }
        : undefined,
      issueDataImage: props.project.issueDataImage
        ? {
            file: undefined,
            name: generateFileNameFromPath(props.project.issueDataImage),
            path: props.project.issueDataImage,
          }
        : undefined,
    }
    setSettings(() => ({
      ...formattedSettings,
    }))
  }, [props.project])

  const schema = z.object({
    updatedInvalidError: z
      .string()
      .regex(
        new RegExp("^[0-9]{4}/(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])$"),
        errorMessage.CALENDAR_DATE_ERROR,
      ),
  })

  const [salesStartDateError, setSalesStartDateError] = useState(null)
  const [salesEndDateError, setSalesEndDateError] = useState(null)
  const [reviewStartDateError, setReviewStartDateError] = useState(null)
  const [reviewEndDateError, setReviewEndDateError] = useState(null)
  const acceptExtension = ".eps"

  const handleOnChangeSalesStartDate = (value: Dayjs | null) => {
    setSalesStartDateError(null)
    setSalesStartDate(value)
    const result: SafeParseReturnType<{ updatedInvalidError: string }, any> =
      schema.safeParse({
        updatedInvalidError: value ? value.format("YYYY/MM/DD") : "",
      })
    if (!result.success) {
      setSalesStartDateError(
        (result as SafeParseError<string>).error.flatten().fieldErrors,
      )
    }
  }

  const handleOnChangeSalesEndDate = (value: Dayjs | null) => {
    setSalesEndDateError(null)
    setSalesEndDate(value)

    if (salesStartDate && value && value.isBefore(salesStartDate, "day")) {
      setSalesEndDateError({
        updatedInvalidError: errorMessage.CALENDAR_DATE_BEFORE_ERROR,
      })
      return
    }

    const result: SafeParseReturnType<{ updatedInvalidError: string }, any> =
      schema.safeParse({
        updatedInvalidError: value
          ? dayjs.tz(value, "UTC").format("YYYY/MM/DD")
          : "",
      })

    if (!result.success) {
      setSalesEndDateError(
        (result as SafeParseError<string>).error.flatten().fieldErrors,
      )
    }
  }

  const handleOnChangeReviewStartDate = (value: Dayjs | null) => {
    setReviewStartDateError(null)
    setReviewStartDate(value)
    const result: SafeParseReturnType<{ updatedInvalidError: string }, any> =
      schema.safeParse({
        updatedInvalidError: value ? value.format("YYYY/MM/DD") : "",
      })
    if (!result.success) {
      setReviewStartDateError(
        (result as SafeParseError<string>).error.flatten().fieldErrors,
      )
    }
  }

  const handleOnChangeReviewEndDate = (value: Dayjs | null) => {
    setReviewEndDateError(null)
    setReviewEndDate(value)

    if (reviewStartDate && value && value.isBefore(reviewStartDate, "day")) {
      setReviewEndDateError({
        updatedInvalidError: errorMessage.CALENDAR_DATE_BEFORE_ERROR,
      })
      return
    }

    const result: SafeParseReturnType<{ updatedInvalidError: string }, any> =
      schema.safeParse({
        updatedInvalidError: value
          ? dayjs.tz(value, "UTC").format("YYYY/MM/DD")
          : "",
      })

    if (!result.success) {
      setReviewEndDateError(
        (result as SafeParseError<string>).error.flatten().fieldErrors,
      )
    }
  }

  const isSaveDisabled = useMemo(() => {
    if (!settings) return

    if (requiredSettingItems.some((key) => (settings[key] ?? "") === "")) {
      return true
    }
    return (
      selectedPlates.length === props.project.booklets.length &&
      Object.keys(settings).find(
        (key) => (props.project.booklets[key] ?? "") !== (settings[key] ?? ""),
      ) === undefined
    )
  }, [settings, props.project, selectedPlates])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {settings && (
        <div className='mt-[54px] pb-[120px] text-sm font-medium text-content-default-primary'>
          <table className='w-full'>
            <tbody>
              <TableRow heading='販売期間'>
                <div className='flex flex-col'>
                  <div className='flex items-center'>
                    <span className='w-[85px]'>販売開始日</span>
                    <DatePicker
                      inputFormat='YYYY/MM/DD'
                      value={salesStartDate}
                      maxDate={salesEndDate}
                      onChange={(value) => handleOnChangeSalesStartDate(value)}
                      renderInput={(params) => (
                        <StyledCalendarTextField
                          size='small'
                          {...params}
                          inputProps={{
                            ...params.inputProps,
                            placeholder: "20xx/1/31",
                          }}
                          error={salesStartDateError?.updatedInvalidError}
                        />
                      )}
                    />
                  </div>
                  <div className='flex items-center'>
                    {salesStartDateError?.updatedInvalidError && (
                      <div className='w-[225px] pt-1'>
                        <BaseErrorBody>
                          {salesStartDateError.updatedInvalidError}
                        </BaseErrorBody>
                      </div>
                    )}
                  </div>
                </div>
                <span className='ml-8 mr-5'>～</span>
                <div className='flex flex-col'>
                  <div className='flex items-center'>
                    <span className='w-[85px]'>販売終了日</span>
                    <DatePicker
                      inputFormat='YYYY/MM/DD'
                      value={salesEndDate}
                      onChange={(value) => handleOnChangeSalesEndDate(value)}
                      minDate={salesStartDate}
                      renderInput={(params) => (
                        <StyledCalendarTextField
                          size='small'
                          {...params}
                          inputProps={{
                            ...params.inputProps,
                            placeholder: "20xx/1/31",
                          }}
                          error={salesEndDateError?.updatedInvalidError}
                        />
                      )}
                    />
                  </div>
                  <div className='flex items-center'>
                    {salesEndDateError?.updatedInvalidError && (
                      <div className='w-[225px] pt-1'>
                        <BaseErrorBody>
                          {salesEndDateError.updatedInvalidError}
                        </BaseErrorBody>
                      </div>
                    )}
                  </div>
                </div>
              </TableRow>
              <TableRow heading='口コミ評価対象期間'>
                <div className='flex flex-col'>
                  <div className='flex items-center'>
                    <span className='w-[85px]'>開始日</span>
                    <DatePicker
                      inputFormat='YYYY/MM/DD'
                      value={reviewStartDate}
                      maxDate={reviewEndDate}
                      onChange={(value) => handleOnChangeReviewStartDate(value)}
                      renderInput={(params) => (
                        <StyledCalendarTextField
                          size='small'
                          {...params}
                          inputProps={{
                            ...params.inputProps,
                            placeholder: "20xx/1/31",
                          }}
                          error={reviewStartDateError?.updatedInvalidError}
                        />
                      )}
                    />
                  </div>
                  {reviewStartDateError?.updatedInvalidError && (
                    <div className='mt-1 block w-[225px]'>
                      <BaseErrorBody>
                        {reviewStartDateError.updatedInvalidError}
                      </BaseErrorBody>
                    </div>
                  )}
                </div>
                <span className='ml-8 mr-5'>～</span>
                <div className='flex flex-col'>
                  <div className='flex items-center'>
                    <span className='w-[85px]'>終了日</span>
                    <DatePicker
                      inputFormat='YYYY/MM/DD'
                      value={reviewEndDate}
                      minDate={reviewStartDate}
                      onChange={(value) => handleOnChangeReviewEndDate(value)}
                      renderInput={(params) => (
                        <StyledCalendarTextField
                          size='small'
                          {...params}
                          inputProps={{
                            ...params.inputProps,
                            placeholder: "20xx/1/31",
                          }}
                          error={reviewEndDateError?.updatedInvalidError}
                        />
                      )}
                    />
                  </div>
                  {reviewEndDateError?.updatedInvalidError && (
                    <div className='mt-1 block w-[225px]'>
                      <BaseErrorBody>
                        {reviewEndDateError.updatedInvalidError}
                      </BaseErrorBody>
                    </div>
                  )}
                </div>
              </TableRow>
              <TableRow heading='版'>
                <MuiFormGroup>
                  <div className='flex flex-wrap items-center'>
                    {copiesMock.map((copies) => (
                      <MuiFormControlLabel
                        key={copies.value}
                        name='plates'
                        control={
                          <MuiCheckbox
                            disableRipple
                            value={copies.value}
                            size='small'
                            checked={selectedPlates.includes(copies.value)}
                            disabled={
                              props.project.booklets.find(
                                (booklet) =>
                                  booklet.masterEditionCode.code ===
                                  copies.value,
                              ) !== undefined
                            }
                            onChange={handleOnChangePlateCheckbox}
                          />
                        }
                        label={
                          <div className='text-sm text-content-default-primary'>
                            {copies.label}
                          </div>
                        }
                      />
                    ))}
                  </div>
                </MuiFormGroup>
              </TableRow>
              <TableRow heading='消費税'>
                <RadioGroup
                  defaultValue='TAX_INCLUDED'
                  name='consumptionTax'
                  value={settings.consumptionTax}
                  onChange={(event) => handleOnChangeRadio(event)}
                >
                  <div className='flex items-center'>
                    {taxOptions.map((tax) => (
                      <FormControlLabel
                        key={tax.value}
                        value={tax.value}
                        control={<Radio disabled />}
                        label={tax.label}
                      />
                    ))}
                  </div>
                </RadioGroup>
              </TableRow>
              <TableRow heading='ツメ見出し'>
                <MuiSelect
                  size='small'
                  sx={{ minWidth: 250, height: 32 }}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  MenuProps={MenuProps}
                  name='thumbIndexId'
                  value={settings.thumbIndexId ?? ""}
                  onChange={handleOnChangeSelect}
                >
                  <MuiMenuItem value=''>
                    <div className='text-xs leading-6 text-content-default-primary'>
                      選択
                    </div>
                  </MuiMenuItem>
                  {props.thumbIndexes.map((item) => (
                    <MuiMenuItem key={item.value} value={item.value}>
                      <div className='text-xs leading-6 text-content-default-primary'>
                        {item.label}
                      </div>
                    </MuiMenuItem>
                  ))}
                </MuiSelect>
              </TableRow>
              <TableRow heading='見出し'>
                <MuiSelect
                  size='small'
                  sx={{ minWidth: 250, height: 32 }}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  MenuProps={MenuProps}
                  name='headLineId'
                  value={settings.headLineId ?? ""}
                  onChange={handleOnChangeSelect}
                >
                  <MuiMenuItem value=''>
                    <div className='text-xs leading-6 text-content-default-primary'>
                      選択
                    </div>
                  </MuiMenuItem>
                  {props.headings.map((item) => (
                    <MuiMenuItem key={item.value} value={item.value}>
                      <div className='text-xs leading-6 text-content-default-primary'>
                        {item.label}
                      </div>
                    </MuiMenuItem>
                  ))}
                </MuiSelect>
              </TableRow>
              <TableRow heading='欄外下画像'>
                <MuiSelect
                  size='small'
                  sx={{ minWidth: 250, height: 32 }}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  MenuProps={MenuProps}
                  name='pageMountId'
                  value={settings.pageMountId ?? ""}
                  onChange={handleOnChangeSelect}
                >
                  <MuiMenuItem value=''>
                    <div className='text-xs leading-6 text-content-default-primary'>
                      選択
                    </div>
                  </MuiMenuItem>
                  {props.footers.map((item) => (
                    <MuiMenuItem key={item.value} value={item.value}>
                      <div className='text-xs leading-6 text-content-default-primary'>
                        {item.label}
                      </div>
                    </MuiMenuItem>
                  ))}
                </MuiSelect>
              </TableRow>
              <TableRow heading='露天アイコン（任意）'>
                <div className='flex flex-col'>
                  <div className='flex items-center px-10'>
                    <span className='mr-3'>あり (EPS)：</span>
                    <FileSelectButton
                      name='openAirIconOn'
                      value={
                        settings.openAirIconOn && settings.openAirIconOn.name
                      }
                      path={
                        settings.openAirIconOn && settings.openAirIconOn.path
                      }
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                    <span className='mr-3 ml-20'>なし (EPS)：</span>
                    <FileSelectButton
                      name='openAirIconOff'
                      value={
                        settings.openAirIconOff && settings.openAirIconOff.name
                      }
                      path={
                        settings.openAirIconOff && settings.openAirIconOff.path
                      }
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                  </div>
                  {fileErrors.openAirIconOn && (
                    <div className='mt-1 w-full pl-10'>
                      <BaseErrorBody>
                        あり：{fileErrors.openAirIconOn}
                      </BaseErrorBody>
                    </div>
                  )}
                  {fileErrors.openAirIconOff && (
                    <div className='mt-1 w-full pl-10'>
                      <BaseErrorBody>
                        なし：{fileErrors.openAirIconOff}
                      </BaseErrorBody>
                    </div>
                  )}
                </div>
              </TableRow>
              <TableRow heading='かけ流しアイコン（任意）'>
                <div className='flex flex-col'>
                  <div className='flex items-center px-10'>
                    <span className='mr-3'>あり (EPS)：</span>
                    <FileSelectButton
                      name='freeFlowingIconOn'
                      value={
                        settings.freeFlowingIconOn &&
                        settings.freeFlowingIconOn.name
                      }
                      path={
                        settings.freeFlowingIconOn &&
                        settings.freeFlowingIconOn.path
                      }
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                    <span className='mr-3 ml-20'>なし (EPS)：</span>
                    <FileSelectButton
                      name='freeFlowingIconOff'
                      value={
                        settings.freeFlowingIconOff &&
                        settings.freeFlowingIconOff.name
                      }
                      path={
                        settings.freeFlowingIconOff &&
                        settings.freeFlowingIconOff.path
                      }
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                  </div>
                  {fileErrors.freeFlowingIconOn && (
                    <div className='mt-1 w-full pl-10'>
                      <BaseErrorBody>
                        あり：{fileErrors.freeFlowingIconOn}
                      </BaseErrorBody>
                    </div>
                  )}
                  {fileErrors.freeFlowingIconOff && (
                    <div className='mt-1 w-full pl-10'>
                      <BaseErrorBody>
                        なし：{fileErrors.freeFlowingIconOff}
                      </BaseErrorBody>
                    </div>
                  )}
                </div>
              </TableRow>
              <TableRow heading='エレベーターアイコン（任意）'>
                <div className='flex flex-col'>
                  <div className='flex items-center px-10'>
                    <span className='mr-3'>あり (EPS)：</span>
                    <FileSelectButton
                      name='elevatorIconOn'
                      value={
                        settings.elevatorIconOn && settings.elevatorIconOn.name
                      }
                      path={
                        settings.elevatorIconOn && settings.elevatorIconOn.path
                      }
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                    <span className='mr-3 ml-20'>なし (EPS)：</span>
                    <FileSelectButton
                      name='elevatorIconOff'
                      value={
                        settings.elevatorIconOff &&
                        settings.elevatorIconOff.name
                      }
                      path={
                        settings.elevatorIconOff &&
                        settings.elevatorIconOff.path
                      }
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                  </div>
                  {fileErrors.elevatorIconOn && (
                    <div className='mt-1 w-full pl-10'>
                      <BaseErrorBody>
                        あり：{fileErrors.elevatorIconOn}
                      </BaseErrorBody>
                    </div>
                  )}
                  {fileErrors.elevatorIconOff && (
                    <div className='mt-1 w-full pl-10'>
                      <BaseErrorBody>
                        なし：{fileErrors.elevatorIconOff}
                      </BaseErrorBody>
                    </div>
                  )}
                </div>
              </TableRow>
              <TableRow heading='当日予約アイコン（任意）'>
                <div className='flex flex-col'>
                  <div className='flex items-center px-10'>
                    <span className='mr-3'>あり (EPS)：</span>
                    <FileSelectButton
                      name='sameDayReservationIconOn'
                      value={
                        settings.sameDayReservationIconOn &&
                        settings.sameDayReservationIconOn.name
                      }
                      path={
                        settings.sameDayReservationIconOn &&
                        settings.sameDayReservationIconOn.path
                      }
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                    <span className='mr-3 ml-20'>なし (EPS)：</span>
                    <FileSelectButton
                      name='sameDayReservationIconOff'
                      value={
                        settings.sameDayReservationIconOff &&
                        settings.sameDayReservationIconOff.name
                      }
                      path={
                        settings.sameDayReservationIconOff &&
                        settings.sameDayReservationIconOff.path
                      }
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                  </div>
                  {fileErrors.sameDayReservationIconOn && (
                    <div className='mt-1 w-full pl-10'>
                      <BaseErrorBody>
                        あり：{fileErrors.sameDayReservationIconOn}
                      </BaseErrorBody>
                    </div>
                  )}
                  {fileErrors.sameDayReservationIconOff && (
                    <div className='mt-1 w-full pl-10'>
                      <BaseErrorBody>
                        なし：{fileErrors.sameDayReservationIconOff}
                      </BaseErrorBody>
                    </div>
                  )}
                </div>
              </TableRow>
              <TableRow heading='送迎有アイコン（任意）'>
                <div className='flex flex-col'>
                  <div className='flex items-center px-10'>
                    <span className='mr-3'>あり (EPS)：</span>
                    <FileSelectButton
                      name='pickUpAvailableIconOn'
                      value={
                        settings.pickUpAvailableIconOn &&
                        settings.pickUpAvailableIconOn.name
                      }
                      path={
                        settings.pickUpAvailableIconOn &&
                        settings.pickUpAvailableIconOn.path
                      }
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                    <span className='mr-3 ml-20'>なし (EPS)：</span>
                    <FileSelectButton
                      name='pickUpAvailableIconOff'
                      value={
                        settings.pickUpAvailableIconOff &&
                        settings.pickUpAvailableIconOff.name
                      }
                      path={
                        settings.pickUpAvailableIconOff &&
                        settings.pickUpAvailableIconOff.path
                      }
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                  </div>
                  {fileErrors.pickUpAvailableIconOn && (
                    <div className='mt-1 w-full pl-10'>
                      <BaseErrorBody>
                        あり：{fileErrors.pickUpAvailableIconOn}
                      </BaseErrorBody>
                    </div>
                  )}
                  {fileErrors.pickUpAvailableIconOff && (
                    <div className='mt-1 w-full pl-10'>
                      <BaseErrorBody>
                        なし：{fileErrors.pickUpAvailableIconOff}
                      </BaseErrorBody>
                    </div>
                  )}
                </div>
              </TableRow>
              <TableRow heading='禁煙有アイコン（任意）'>
                <div className='flex flex-col'>
                  <div className='flex items-center px-10'>
                    <span className='mr-3'>あり (EPS)：</span>
                    <FileSelectButton
                      name='noSmokingIconOn'
                      value={
                        settings.noSmokingIconOn &&
                        settings.noSmokingIconOn.name
                      }
                      path={
                        settings.noSmokingIconOn &&
                        settings.noSmokingIconOn.path
                      }
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                    <span className='mr-3 ml-20'>なし (EPS)：</span>
                    <FileSelectButton
                      name='noSmokingIconOff'
                      value={
                        settings.noSmokingIconOff &&
                        settings.noSmokingIconOff.name
                      }
                      path={
                        settings.noSmokingIconOff &&
                        settings.noSmokingIconOff.path
                      }
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                  </div>
                  {fileErrors.noSmokingIconOn && (
                    <div className='mt-1 w-full pl-10'>
                      <BaseErrorBody>
                        あり：{fileErrors.noSmokingIconOn}
                      </BaseErrorBody>
                    </div>
                  )}
                  {fileErrors.noSmokingIconOff && (
                    <div className='mt-1 w-full pl-10'>
                      <BaseErrorBody>
                        なし：{fileErrors.noSmokingIconOff}
                      </BaseErrorBody>
                    </div>
                  )}
                </div>
              </TableRow>
              <TableRow heading='夕食　会場食（任意）'>
                <div className='flex flex-col'>
                  <div className='flex items-center px-10'>
                    <span className='mr-3'>EPS：</span>
                    <FileSelectButton
                      name='dinnerVenueMeal'
                      value={
                        settings.dinnerVenueMeal &&
                        settings.dinnerVenueMeal.name
                      }
                      path={
                        settings.dinnerVenueMeal &&
                        settings.dinnerVenueMeal.path
                      }
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                  </div>
                  {fileErrors.dinnerVenueMeal && (
                    <div className='mt-1 w-full pl-10'>
                      <BaseErrorBody>
                        {fileErrors.dinnerVenueMeal}
                      </BaseErrorBody>
                    </div>
                  )}
                </div>
              </TableRow>
              <TableRow heading='夕食　個室会場食（任意）'>
                <div className='flex flex-col'>
                  <div className='flex items-center px-10'>
                    <span className='mr-3'>EPS：</span>
                    <FileSelectButton
                      name='dinnerPrivateRoomDining'
                      value={
                        settings.dinnerPrivateRoomDining &&
                        settings.dinnerPrivateRoomDining.name
                      }
                      path={
                        settings.dinnerPrivateRoomDining &&
                        settings.dinnerPrivateRoomDining.path
                      }
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                  </div>
                  {fileErrors.dinnerPrivateRoomDining && (
                    <div className='mt-1 w-full pl-10'>
                      <BaseErrorBody>
                        {fileErrors.dinnerPrivateRoomDining}
                      </BaseErrorBody>
                    </div>
                  )}
                </div>
              </TableRow>
              <TableRow heading='夕食　部屋食（任意）'>
                <div className='flex flex-col'>
                  <div className='flex items-center px-10'>
                    <span className='mr-3'>EPS：</span>
                    <FileSelectButton
                      name='dinnerRoomMeal'
                      value={
                        settings.dinnerRoomMeal && settings.dinnerRoomMeal.name
                      }
                      path={
                        settings.dinnerRoomMeal && settings.dinnerRoomMeal.path
                      }
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                  </div>
                  {fileErrors.dinnerRoomMeal && (
                    <div className='mt-1 w-full pl-10'>
                      <BaseErrorBody>{fileErrors.dinnerRoomMeal}</BaseErrorBody>
                    </div>
                  )}
                </div>
              </TableRow>
              <TableRow
                heading='夕食　会場食または個室会場食'
                subHeading='（任意）'
              >
                <div className='flex flex-col'>
                  <div className='flex items-center px-10'>
                    <span className='mr-3'>EPS：</span>
                    <FileSelectButton
                      name='dinnerVenueMealOorPrivateDiningRoom'
                      value={
                        settings.dinnerVenueMealOorPrivateDiningRoom &&
                        settings.dinnerVenueMealOorPrivateDiningRoom.name
                      }
                      path={
                        settings.dinnerVenueMealOorPrivateDiningRoom &&
                        settings.dinnerVenueMealOorPrivateDiningRoom.path
                      }
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                  </div>
                  {fileErrors.dinnerVenueMealOorPrivateDiningRoom && (
                    <div className='mt-1 w-full pl-10'>
                      <BaseErrorBody>
                        {fileErrors.dinnerVenueMealOorPrivateDiningRoom}
                      </BaseErrorBody>
                    </div>
                  )}
                </div>
              </TableRow>
              <TableRow
                heading='夕食　会場食または部屋食'
                subHeading='（任意）'
              >
                <div className='flex flex-col'>
                  <div className='flex items-center px-10'>
                    <span className='mr-3'>EPS：</span>
                    <FileSelectButton
                      name='dinnerVenueMealOrRoomService'
                      value={
                        settings.dinnerVenueMealOrRoomService &&
                        settings.dinnerVenueMealOrRoomService.name
                      }
                      path={
                        settings.dinnerVenueMealOrRoomService &&
                        settings.dinnerVenueMealOrRoomService.path
                      }
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                  </div>
                  {fileErrors.dinnerVenueMealOrRoomService && (
                    <div className='mt-1 w-full pl-10'>
                      <BaseErrorBody>
                        {fileErrors.dinnerVenueMealOrRoomService}
                      </BaseErrorBody>
                    </div>
                  )}
                </div>
              </TableRow>
              <TableRow
                heading='夕食　部屋食または個室会場食'
                subHeading='（任意）'
              >
                <div className='flex flex-col'>
                  <div className='flex items-center px-10'>
                    <span className='mr-3'>EPS：</span>
                    <FileSelectButton
                      name='dinnerRoomOrPrivateDiningRoom'
                      value={
                        settings.dinnerRoomOrPrivateDiningRoom &&
                        settings.dinnerRoomOrPrivateDiningRoom.name
                      }
                      path={
                        settings.dinnerRoomOrPrivateDiningRoom &&
                        settings.dinnerRoomOrPrivateDiningRoom.path
                      }
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                  </div>
                  {fileErrors.dinnerRoomOrPrivateDiningRoom && (
                    <div className='mt-1 w-full pl-10'>
                      <BaseErrorBody>
                        {fileErrors.dinnerRoomOrPrivateDiningRoom}
                      </BaseErrorBody>
                    </div>
                  )}
                </div>
              </TableRow>
              <TableRow heading='夕食　なし（任意）'>
                <div className='flex flex-col'>
                  <div className='flex items-center px-10'>
                    <span className='mr-3'>EPS：</span>
                    <FileSelectButton
                      name='dinnerNone'
                      value={settings.dinnerNone && settings.dinnerNone.name}
                      path={settings.dinnerNone && settings.dinnerNone.path}
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                  </div>
                  {fileErrors.dinnerNone && (
                    <div className='mt-1 w-full pl-10'>
                      <BaseErrorBody>{fileErrors.dinnerNone}</BaseErrorBody>
                    </div>
                  )}
                </div>
              </TableRow>
              <TableRow heading='朝食　会場食（任意）'>
                <div className='flex flex-col'>
                  <div className='flex items-center px-10'>
                    <span className='mr-3'>EPS：</span>
                    <FileSelectButton
                      name='breakfastVenueMeal'
                      value={
                        settings.breakfastVenueMeal &&
                        settings.breakfastVenueMeal.name
                      }
                      path={
                        settings.breakfastVenueMeal &&
                        settings.breakfastVenueMeal.path
                      }
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                  </div>
                  {fileErrors.breakfastVenueMeal && (
                    <div className='mt-1 w-full pl-10'>
                      <BaseErrorBody>
                        {fileErrors.breakfastVenueMeal}
                      </BaseErrorBody>
                    </div>
                  )}
                </div>
              </TableRow>
              <TableRow heading='朝食　個室会場食（任意）'>
                <div className='flex flex-col'>
                  <div className='flex items-center px-10'>
                    <span className='mr-3'>EPS：</span>
                    <FileSelectButton
                      name='breakfastPrivateRoomDining'
                      value={
                        settings.breakfastPrivateRoomDining &&
                        settings.breakfastPrivateRoomDining.name
                      }
                      path={
                        settings.breakfastPrivateRoomDining &&
                        settings.breakfastPrivateRoomDining.path
                      }
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                  </div>
                  {fileErrors.breakfastPrivateRoomDining && (
                    <div className='mt-1 w-full pl-10'>
                      <BaseErrorBody>
                        {fileErrors.breakfastPrivateRoomDining}
                      </BaseErrorBody>
                    </div>
                  )}
                </div>
              </TableRow>
              <TableRow heading='朝食　部屋食（任意）'>
                <div className='flex flex-col'>
                  <div className='flex items-center px-10'>
                    <span className='mr-3'>EPS：</span>
                    <FileSelectButton
                      name='breakfastRoomMeal'
                      value={
                        settings.breakfastRoomMeal &&
                        settings.breakfastRoomMeal.name
                      }
                      path={
                        settings.breakfastRoomMeal &&
                        settings.breakfastRoomMeal.path
                      }
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                  </div>
                  {fileErrors.breakfastRoomMeal && (
                    <div className='mt-1 w-full pl-10'>
                      <BaseErrorBody>
                        {fileErrors.breakfastRoomMeal}
                      </BaseErrorBody>
                    </div>
                  )}
                </div>
              </TableRow>
              <TableRow
                heading='朝食　会場食または個室会場食'
                subHeading='（任意）'
              >
                <div className='flex flex-col'>
                  <div className='flex items-center px-10'>
                    <span className='mr-3'>EPS：</span>
                    <FileSelectButton
                      name='breakfastVenueMealOorPrivateDiningRoom'
                      value={
                        settings.breakfastVenueMealOorPrivateDiningRoom &&
                        settings.breakfastVenueMealOorPrivateDiningRoom.name
                      }
                      path={
                        settings.breakfastVenueMealOorPrivateDiningRoom &&
                        settings.breakfastVenueMealOorPrivateDiningRoom.path
                      }
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                  </div>
                  {fileErrors.breakfastVenueMealOorPrivateDiningRoom && (
                    <div className='mt-1 w-full pl-10'>
                      <BaseErrorBody>
                        {fileErrors.breakfastVenueMealOorPrivateDiningRoom}
                      </BaseErrorBody>
                    </div>
                  )}
                </div>
              </TableRow>
              <TableRow
                heading='朝食　会場食または部屋食'
                subHeading='（任意）'
              >
                <div className='flex flex-col'>
                  <div className='flex items-center px-10'>
                    <span className='mr-3'>EPS：</span>
                    <FileSelectButton
                      name='breakfastVenueMealOrRoomService'
                      value={
                        settings.breakfastVenueMealOrRoomService &&
                        settings.breakfastVenueMealOrRoomService.name
                      }
                      path={
                        settings.breakfastVenueMealOrRoomService &&
                        settings.breakfastVenueMealOrRoomService.path
                      }
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                  </div>
                  {fileErrors.breakfastVenueMealOrRoomService && (
                    <div className='mt-1 w-full pl-10'>
                      <BaseErrorBody>
                        {fileErrors.breakfastVenueMealOrRoomService}
                      </BaseErrorBody>
                    </div>
                  )}
                </div>
              </TableRow>
              <TableRow
                heading='朝食　部屋食または個室会場食'
                subHeading='（任意）'
              >
                <div className='flex flex-col'>
                  <div className='flex items-center px-10'>
                    <span className='mr-3'>EPS：</span>
                    <FileSelectButton
                      name='breakfastRoomOrPrivateDiningRoom'
                      value={
                        settings.breakfastRoomOrPrivateDiningRoom &&
                        settings.breakfastRoomOrPrivateDiningRoom.name
                      }
                      path={
                        settings.breakfastRoomOrPrivateDiningRoom &&
                        settings.breakfastRoomOrPrivateDiningRoom.path
                      }
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                  </div>
                  {fileErrors.breakfastRoomOrPrivateDiningRoom && (
                    <div className='mt-1 w-full pl-10'>
                      <BaseErrorBody>
                        {fileErrors.breakfastRoomOrPrivateDiningRoom}
                      </BaseErrorBody>
                    </div>
                  )}
                </div>
              </TableRow>
              <TableRow heading='朝食　なし（任意）'>
                <div className='flex flex-col'>
                  <div className='flex items-center px-10'>
                    <span className='mr-3'>EPS：</span>
                    <FileSelectButton
                      name='breakfastNone'
                      value={
                        settings.breakfastNone && settings.breakfastNone.name
                      }
                      path={
                        settings.breakfastNone && settings.breakfastNone.path
                      }
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                  </div>
                  {fileErrors.breakfastNone && (
                    <div className='mt-1 w-full pl-10 text-xs'>
                      <BaseErrorBody>{fileErrors.breakfastNone}</BaseErrorBody>
                    </div>
                  )}
                </div>
              </TableRow>
              <TableRow heading='月号データ'>
                <div className='flex flex-col'>
                  <div className='flex items-center px-10'>
                    <span className='mr-3'>EPS：</span>
                    <FileSelectButton
                      name='issueDataImage'
                      value={
                        settings.issueDataImage && settings.issueDataImage.name
                      }
                      path={
                        settings.issueDataImage && settings.issueDataImage.path
                      }
                      onChange={handleOnChangeFileSelect}
                      onClickDeleteFile={handleOnClickDeleteFile}
                      accept={acceptExtension}
                    />
                  </div>
                  {fileErrors.issueDataImage && (
                    <div className='mt-1 w-full pl-10'>
                      <BaseErrorBody>{fileErrors.issueDataImage}</BaseErrorBody>
                    </div>
                  )}
                </div>
              </TableRow>
            </tbody>
          </table>
          <div className='absolute left-0 bottom-0 flex w-full items-center justify-end bg-white-0 bg-opacity-80 py-10 pl-[100px] pr-10'>
            <MuiLoadingButton
              variant='contained'
              sx={{ width: 104 }}
              disabled={isSaveDisabled}
              onClick={() => props.onSave(settings, selectedPlates)}
            >
              保存
            </MuiLoadingButton>
          </div>
        </div>
      )}
    </LocalizationProvider>
  )
}

export default ProjectSettings
