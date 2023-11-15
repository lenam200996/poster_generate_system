import BaseModal from "@/components/base/overlay/BaseModal"
import MuiButton from "@mui/material/Button"

interface Props {
  id: string
  onClose: () => void
  onExact: () => void
}

const WorkspaceModalCancelAlias = (props: Props) => {
  const handleOnClose = () => {
    props.onClose()
  }

  const handleOnExact = () => {
    props.onExact()
  }

  return (
    <BaseModal shown={true} onClickClose={handleOnClose}>
      <div className='relative h-[320px] w-[600px]'>
        <div className='px-9 pt-[56px]'>
          <p className='text-center text-lg font-bold'>相乗り解除確認</p>
          <p className='mt-4 text-center text-sm font-medium'>
            相乗り解除しますか
          </p>
        </div>
        <div className='absolute bottom-0 left-0 flex w-full items-center justify-between px-9 pb-9'>
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
            onClick={handleOnExact}
          >
            確定
          </MuiButton>
        </div>
      </div>
    </BaseModal>
  )
}

export default WorkspaceModalCancelAlias
