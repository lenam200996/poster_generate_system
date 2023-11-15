import { useEffect, useState } from "react"
import {
  Button as MuiButton,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material"
import BaseModal from "@/components/base/overlay/BaseModal"

const LayoutPatternBlock = (props: {
  columnType?: "3column" | "2column"
  children?: any
}) => (
  <div
    className={`flex h-full flex-col space-y-[5px] ${
      props.columnType === "3column"
        ? "w-1/3"
        : props.columnType === "2column"
        ? "w-1/2"
        : "w-full"
    }`}
    style={{
      backgroundColor: props.children ? "inherit" : "rgba(25, 118, 210, 0.2)",
    }}
  >
    {props.children}
  </div>
)

interface Props {
  shown?: boolean
  selected?: string
  onSelect: (id: string) => void
  onClose: Function
}

const WorkspaceModalLayoutPatternSelect = (props: Props) => {
  const [selected, setSelected] = useState<string | undefined>(props.selected)

  useEffect(() => {
    setSelected(props.selected)
  }, [props.selected])

  const handleOnClick = () => {
    props.onSelect(selected)
  }

  const handleOnClickClose = () => {
    props.onClose()
  }

  return (
    <>
      <BaseModal shown={props.shown ?? true} onClickClose={handleOnClickClose}>
        <div className='relative flex h-[640px] w-[1200px] flex-col'>
          <div className='mb-5 mt-10'>
            <p className='text-center text-lg font-bold text-content-default-primary'>
              パターン選択
            </p>
          </div>
          <div className='mb-24 flex-1 overflow-y-auto py-5'>
            <RadioGroup
              value={selected}
              onChange={(event) => setSelected(event.currentTarget.value)}
            >
              <div className='grid w-full grid-cols-3 gap-y-10 px-[132px]'>
                <div className='text-center'>
                  <FormControlLabel
                    control={<Radio size='small' />}
                    value={"2column"}
                    label={
                      <span className='text-sm font-medium text-content-default-primary'>
                        2カラム
                      </span>
                    }
                  />
                  <div className='flex h-[105px] w-[286px] space-x-[5px]'>
                    <LayoutPatternBlock columnType='2column' />
                    <LayoutPatternBlock columnType='2column' />
                  </div>
                </div>
                <div className='text-center'>
                  <FormControlLabel
                    control={<Radio size='small' />}
                    value={"2column_right"}
                    label={
                      <span className='text-sm font-medium text-content-default-primary'>
                        2カラム（右上下分割）
                      </span>
                    }
                  />
                  <div className='flex h-[105px] w-[286px] space-x-[5px]'>
                    <LayoutPatternBlock columnType='2column' />
                    <LayoutPatternBlock columnType='2column'>
                      <LayoutPatternBlock />
                      <LayoutPatternBlock />
                    </LayoutPatternBlock>
                  </div>
                </div>
                <div className='text-center'>
                  <FormControlLabel
                    control={<Radio size='small' />}
                    value={"2column_left"}
                    label={
                      <span className='text-sm font-medium text-content-default-primary'>
                        2カラム（左上下分割）
                      </span>
                    }
                  />
                  <div className='flex h-[105px] w-[286px] space-x-[5px]'>
                    <LayoutPatternBlock columnType='2column'>
                      <LayoutPatternBlock />
                      <LayoutPatternBlock />
                    </LayoutPatternBlock>
                    <LayoutPatternBlock columnType='2column' />
                  </div>
                </div>
                <div className='text-center'>
                  <FormControlLabel
                    control={<Radio size='small' />}
                    value={"3column"}
                    label={
                      <span className='text-sm font-medium text-content-default-primary'>
                        3カラム
                      </span>
                    }
                  />
                  <div className='flex h-[105px] w-[286px] space-x-[5px]'>
                    <LayoutPatternBlock columnType='3column' />
                    <LayoutPatternBlock columnType='3column' />
                    <LayoutPatternBlock columnType='3column' />
                  </div>
                </div>
                <div className='text-center'>
                  <FormControlLabel
                    control={<Radio size='small' />}
                    value={"3column_right"}
                    label={
                      <span className='text-sm font-medium text-content-default-primary'>
                        3カラム（右上下分割）
                      </span>
                    }
                  />
                  <div className='flex h-[105px] w-[286px] space-x-[5px]'>
                    <LayoutPatternBlock columnType='3column' />
                    <LayoutPatternBlock columnType='3column' />
                    <LayoutPatternBlock columnType='3column'>
                      <LayoutPatternBlock />
                      <LayoutPatternBlock />
                    </LayoutPatternBlock>
                  </div>
                </div>
                <div className='text-center'>
                  <FormControlLabel
                    control={<Radio size='small' />}
                    value={"3column_center"}
                    label={
                      <span className='text-sm font-medium text-content-default-primary'>
                        3カラム（中央上下分割）
                      </span>
                    }
                  />
                  <div className='flex h-[105px] w-[286px] space-x-[5px]'>
                    <LayoutPatternBlock columnType='3column' />
                    <LayoutPatternBlock columnType='3column'>
                      <LayoutPatternBlock />
                      <LayoutPatternBlock />
                    </LayoutPatternBlock>
                    <LayoutPatternBlock columnType='3column' />
                  </div>
                </div>
                <div className='text-center'>
                  <FormControlLabel
                    control={<Radio size='small' />}
                    value={"3column_left"}
                    label={
                      <span className='text-sm font-medium text-content-default-primary'>
                        3カラム（左上下分割）
                      </span>
                    }
                  />
                  <div className='flex h-[105px] w-[286px] space-x-[5px]'>
                    <LayoutPatternBlock columnType='3column'>
                      <LayoutPatternBlock />
                      <LayoutPatternBlock />
                    </LayoutPatternBlock>
                    <LayoutPatternBlock columnType='3column' />
                    <LayoutPatternBlock columnType='3column' />
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>
          <div className='absolute bottom-0 left-0 flex h-24 w-full items-end justify-between px-9 pb-9'>
            <MuiButton
              color='inherit'
              variant='outlined'
              sx={{ width: 104 }}
              size='small'
              onClick={handleOnClickClose}
            >
              キャンセル
            </MuiButton>
            <MuiButton
              variant='contained'
              sx={{ width: 104 }}
              size='small'
              disabled={selected === undefined}
              onClick={handleOnClick}
            >
              確定
            </MuiButton>
          </div>
        </div>
      </BaseModal>
    </>
  )
}

export default WorkspaceModalLayoutPatternSelect
