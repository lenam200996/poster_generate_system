import { useState, useMemo } from "react"
import MuiButton from "@mui/material/Button"
import FormControlLabel from "@mui/material/FormControlLabel"
import MuiCheckbox from "@mui/material/Checkbox"
import { copiesMock } from "@/config/api/mock/projects"

interface Props {
  onExact: Function
  onClose: Function
}

const ProjectNewSettingPlateModal = (props: Props) => {
  const [plates, setPlates] = useState<string[]>([])

  const handleOnChangeCheckbox = (event) => {
    if (event.target.checked) {
      setPlates((state) => [...state, event.target.value])
    } else {
      setPlates((state) =>
        state.filter((value) => value !== event.target.value),
      )
    }
  }
  const handleOnClick = () => props.onExact(plates)
  const handleOnClose = () => props.onClose()

  const isNextDisabled = useMemo(() => plates.length === 0, [plates])

  return (
    <div className='relative min-h-[500px] w-[900px]'>
      <div className='pt-[56px]'>
        <p className='text-center text-lg font-bold text-content-default-primary'>
          新規プロジェクト設定
        </p>
        <p className='mt-11 text-center text-sm font-medium text-content-default-primary'>
          版の設定をしてください
        </p>
        <div className='mx-20 mt-16 flex flex-wrap'>
          {copiesMock.map((copies) => (
            <FormControlLabel
              key={copies.value}
              control={
                <MuiCheckbox
                  disableRipple
                  name='media'
                  value={copies.value}
                  checked={plates.includes(copies.value)}
                  onChange={handleOnChangeCheckbox}
                />
              }
              label={copies.label}
            />
          ))}
        </div>
      </div>
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
          disabled={isNextDisabled}
          onClick={handleOnClick}
        >
          確定
        </MuiButton>
      </div>
    </div>
  )
}

export default ProjectNewSettingPlateModal
