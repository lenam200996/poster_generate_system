import { useState, useEffect } from "react"
import BaseModal from "@/components/base/overlay/BaseModal/index"
import MuiButton from "@mui/material/Button"
import TemplateManuscript from "@/components/domain/template/TemplateManuscript"
import { useApiClient } from "@/hooks/useApiClient"
import {
  DocumentTemplateWithDocumentSizeDto,
  MasterDocumentSizeDtoCodeEnum,
} from "openapi"

interface Props {
  manuscriptSize: MasterDocumentSizeDtoCodeEnum
  onPrev: () => void
  onClose: () => void
  onClick: (id: number, name: string) => void
}

const TemplateModalSelectManuscript = (props: Props) => {
  const apiClient = useApiClient()
  const [templates, setTemplates] = useState<
    DocumentTemplateWithDocumentSizeDto[]
  >([])
  const [loading, setLoading] = useState(false)

  const handleClickClose = () => {
    props.onClose()
  }
  const handleOnClickPrev = () => {
    props.onPrev()
  }
  const handleOnClick = (id: number, name: string) => {
    props.onClick(id, name)
  }

  useEffect(() => {
    loadData()
  }, []) // eslint-disable-line

  const loadData = async () => {
    setLoading(true)
    try {
      const params = {
        take: undefined,
        skip: undefined,
        name: undefined,
        documentSizeCode: props.manuscriptSize,
      }
      const { data } =
        await apiClient.documentTemplatesApiFactory.documentTemplateControllerList(
          params.take,
          params.skip,
          params.name,
          params.documentSizeCode,
        )
      setTemplates(data.data)
      setLoading(false)
    } catch (error) {
      console.error("error: ", error)
      setLoading(false)
    }
  }

  return (
    <div>
      <BaseModal shown={true} onClickClose={handleClickClose}>
        <div className='relative h-[640px] w-[1200px] px-[50px] pt-[56px]'>
          <div className='flex items-center'>
            <p className=' text-content-primary-dark90 mr-[24px] text-lg font-bold'>
              原稿レイアウトの選択
            </p>
          </div>
          <div className='scrollbar-hide mt-8 grid max-h-[410px] grid-cols-4 gap-3 overflow-y-auto'>
            {templates.map((template) => (
              <TemplateManuscript
                key={template.id}
                template={template}
                onClick={handleOnClick}
                onClose={handleClickClose}
              />
            ))}
          </div>
          <div className='absolute left-0 bottom-0 flex w-full items-center justify-center px-9 pb-9'>
            <MuiButton
              color='inherit'
              variant='outlined'
              sx={{ width: 104 }}
              onClick={handleOnClickPrev}
            >
              戻る
            </MuiButton>
          </div>
        </div>
      </BaseModal>
    </div>
  )
}

export default TemplateModalSelectManuscript
