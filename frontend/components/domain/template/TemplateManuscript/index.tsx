import { createWorkspaceImageURL } from "@/api/idmlReplace"
import MuiButton from "@mui/material/Button"
import { DocumentTemplateWithDocumentSizeDto } from "openapi"

interface Props {
  template: DocumentTemplateWithDocumentSizeDto
  onClick: (id: number, name: string) => void
  onClose: Function
}

const TemplateManuscript = (props: Props) => {
  const handleOnClick = () => {
    const templateName = props.template.comment
      ? `${props.template.name} ${props.template.comment}`
      : props.template.name
    props.onClick(props.template.id, templateName)
  }

  return (
    <div>
      <div className='w-[256px] rounded border border-divider-accent-primary py-3'>
        <div className='mx-auto w-[215px]'>
          <img
            src={createWorkspaceImageURL(
              encodeURIComponent(props.template.imageThumbnail),
            )}
            className='max-h-[265px] w-full'
            alt={props.template.name}
          />
        </div>
        <div className='mt-4 px-7'>
          <p className='mt-7 text-sm font-bold'>
            {props.template.name}
            <br />
            {props.template.comment}
          </p>
          <div className='mt-4 flex justify-center'>
            <MuiButton
              variant='contained'
              size='small'
              sx={{ width: 47 }}
              onClick={handleOnClick}
            >
              選択
            </MuiButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemplateManuscript
