import { useState } from "react"
import { useRouter } from "next/router"
import { useRecoilState } from "recoil"
import { myStockProjects } from "@/atoms/myStock"
import MuiButton from "@mui/material/Button"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import BaseModal from "@/components/base/overlay/BaseModal"
import { Manuscript, userCognitoMock } from "@/config/api/mock/myStock"
import { DocumentMyStockPublicDto, DocumentResponseDto } from "@/openapi"
import { useMyStock } from "@/hooks/useMyStock"
import { useApiClient } from "@/hooks/useApiClient"

type Props = {
  document: DocumentResponseDto
  onExact?: () => void
  onClose?: () => void
}

const WorkspaceModalRemoveAlias = (props: Props) => {
  const [complete, setComplete] = useState<boolean>(false)
  const apiClient = useApiClient()
  const handleOnClose = () => {
    props.onClose && props.onClose()
  }
  const handleOnExact = async () => {
    await apiClient.documentsApiFactory.documentControllerRemoveAlias(
      props.document.id,
    )
    setComplete(true)
  }

  const handleOnExactClose = () => {
    props.onExact && props.onExact()
  }
  return (
    <div>
      <BaseModal shown={true} onClickClose={handleOnClose}>
        <div className='relative h-[320px] w-[600px]'>
          <div className='px-9 pt-[56px]'>
            <p className='text-center text-lg font-bold'>相乗り解除確認</p>
            <div className='mt-8 flex justify-center'>
              <p className='text-center text-sm leading-6'>
                相乗りを解除
                {complete ? "しました" : "しますか？"}
              </p>
            </div>
          </div>
          <div className='absolute left-0 bottom-0 flex w-full justify-between px-9 pb-9'>
            <MuiButton
              color='inherit'
              variant='outlined'
              sx={{ width: 104 }}
              onClick={handleOnClose}
              disabled={complete}
            >
              キャンセル
            </MuiButton>
            <MuiButton
              variant='contained'
              sx={{ width: 104 }}
              onClick={complete ? handleOnExactClose : handleOnExact}
            >
              確定
            </MuiButton>
          </div>
        </div>
      </BaseModal>
    </div>
  )
}

export default WorkspaceModalRemoveAlias
