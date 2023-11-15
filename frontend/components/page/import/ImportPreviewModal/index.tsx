import BaseModal from "@/components/base/overlay/BaseModal"

interface Props {
  name?: string
  url: string
  width: string
  height: string
  onClose: Function
}

const ImportPreviewModal = (props: Props) => {
  return (
    <BaseModal shown={true} onClickClose={props.onClose}>
      <div
        className='relative px-12 py-10'
        style={{ width: props.width, height: props.height }}
      >
        <img
          className='h-full w-full object-contain'
          src={props.url}
          alt={props.name}
        />
      </div>
    </BaseModal>
  )
}

ImportPreviewModal.defaultProps = {
  width: "600px",
  height: "555px",
}

export default ImportPreviewModal
