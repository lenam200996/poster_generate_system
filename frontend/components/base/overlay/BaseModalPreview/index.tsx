import BaseModal from "@/components/base/overlay/BaseModal"
import MuiButton from "@mui/material/Button"
import downloadFileFromUrl from "@/util/downloadFileFromUrl"

interface Props {
  shown?: boolean
  imageUrl: string
  imageName?: string
  download?: boolean
  onClose: () => void
  PreviewComponent?: JSX.Element
}

const BaseModalPreview = (props: Props) => {
  const handleOnClose = () => {
    props.onClose()
  }
  return (
    <BaseModal shown={props.shown} onClickClose={handleOnClose}>
      <div className='flex h-[90vh] min-h-[700px] w-[1280px] flex-col p-[56px]'>
        <div
          className={`flex w-full items-center justify-center ${
            props.download ? "h-[calc(100%_-_110px)]" : "h-full"
          }`}
        >
          {props.PreviewComponent ? (
            props.PreviewComponent
          ) : (
            <img
              src={props.imageUrl}
              alt=''
              className='max-h-full max-w-full'
            />
          )}
        </div>
        {props.download && (
          <div className='flex min-h-[110px] items-end justify-center'>
            <MuiButton
              color='primary'
              variant='contained'
              size='large'
              onClick={() => {
                downloadFileFromUrl(props.imageUrl, props.imageName ?? "")
              }}
            >
              ダウンロード
            </MuiButton>
          </div>
        )}
      </div>
    </BaseModal>
  )
}

export default BaseModalPreview
