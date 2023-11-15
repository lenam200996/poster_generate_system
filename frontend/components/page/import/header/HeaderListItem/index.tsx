import { useState } from "react"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import ImportPreviewModal from "@/components/page/import/ImportPreviewModal"
import MuiTExtField from "@mui/material/TextField"
import { SafeParseError, z } from "zod"
import errorMessage from "@/config/errorMessage"
import BaseErrorBody from "@/components/base/typography/BaseErrorBody"

interface Props {
  id: number
  name: string
  thumbImageUrl: string
  onDelete?: Function
  onChange?: Function
}

const HeaderListItem = (props: Props) => {
  const [shown, setShown] = useState<boolean>(false)
  const [errors, setErrors] = useState(null)

  const schema = z.object({
    codeFormatError: z
      .string()
      .regex(
        new RegExp("^[a-zA-Z0-9_-]{2,}$"),
        errorMessage.TWO_DIGIT_ALPHANUMERIC_MORE_ERROR,
      ),
  })

  const handleOnChange = (value: string) => {
    if (!props.onChange) return
    props.onChange({ id: props.id, value })

    const result = schema.safeParse({
      codeFormatError: value,
    }) as SafeParseError<string>
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors)
    } else {
      setErrors(null)
    }
  }
  return (
    <div className='flex w-[215px] flex-col rounded bg-container-main-secondary'>
      <button
        className='mx-3 mt-4 mb-[10px] h-[138px] bg-transparent'
        onClick={() => setShown(true)}
      >
        <img
          className='h-full w-full object-contain'
          src={props.thumbImageUrl}
          alt={props.name}
        />
      </button>
      <div className='mx-3 mb-4 pb-2'>
        {!props.onChange && (
          <p className='mt-4 text-center text-sm text-content-default-primary'>
            {props.name}
          </p>
        )}
        {props.onChange && (
          <>
            <div className='mt-2 mb-4 flex justify-center'>
              <MuiTExtField
                value={props.name}
                size='small'
                sx={{ width: 100 }}
                onChange={(event) => handleOnChange(event.target.value)}
                error={!!errors?.codeFormatError}
              />
            </div>
            {errors?.codeFormatError && (
              <BaseErrorBody>{errors.codeFormatError}</BaseErrorBody>
            )}
          </>
        )}
        {props.onDelete && (
          <div className='flex justify-center'>
            <BaseButtonIconText
              icon='delete'
              text='削除'
              onClick={props.onDelete}
            />
          </div>
        )}
      </div>
      {shown && (
        <ImportPreviewModal
          name={props.name}
          url={props.thumbImageUrl}
          onClose={() => setShown(false)}
        />
      )}
    </div>
  )
}

export default HeaderListItem
