import { useState } from "react"
import { useSetRecoilState } from "recoil"
import BaseModal from "@/components/base/overlay/BaseModal"
import MuiButton from "@mui/material/Button"
import { useApiClient } from "@/hooks/useApiClient"
import { DocumentResponseDto } from "@/openapi"
import {
  workspaceBookletState,
  workspaceManuscriptState,
} from "@/atoms/workspace"

interface Props {
  document: DocumentResponseDto
  onClose: () => void
  onComplete: () => void
}

const WorkspaceModalProofreadingRequest = (props: Props) => {
  const apiClient = useApiClient()
  const [complete, setComplete] = useState<boolean>(false)

  const setBookletState = useSetRecoilState(workspaceBookletState)
  const setManuscriptState = useSetRecoilState(workspaceManuscriptState)

  const handleOnClickUpdateDocumentStatus = async () => {
    try {
      const response =
        await apiClient.documentsApiFactory.documentControllerUpdateDocumentStatus(
          {
            id: props.document.id,
            statusCode: "CHECKING",
          },
        )
      setBookletState((state) => ({
        ...state,
        pages: state.pages.map((page) => {
          if (page.documents.find(({ id }) => id === props.document.id)) {
            return {
              ...page,
              documents: page.documents.map((document) =>
                document.id === props.document.id ? response.data : document,
              ),
            }
          }
          return page
        }),
      }))

      setManuscriptState((state) => ({
        ...state,
        document: response.data,
      }))

      setComplete(true)
    } catch (error) {
      console.error(error)
    }
  }

  const handleOnClickClose = () => {
    if (complete) {
      props.onComplete()
    } else {
      props.onClose()
    }
  }

  const ConfirmView = () => {
    return (
      <div className='relative h-[320px] w-[600px]'>
        <div className='px-9 pt-[56px]'>
          <p className='text-center text-lg font-bold'>校正依頼</p>
          <p className='mt-4 text-center text-sm font-medium'>
            {`${props.document.documentCode}　${props.document.documentContent.hotelNameLarge}`}
            <br />
            校正依頼を行う
          </p>
        </div>
        <div className='absolute bottom-0 left-0 flex w-full items-center justify-between px-9 pb-9'>
          <MuiButton
            color='inherit'
            variant='outlined'
            sx={{ width: 104 }}
            onClick={handleOnClickClose}
          >
            キャンセル
          </MuiButton>
          <MuiButton
            variant='contained'
            sx={{ width: 104 }}
            onClick={handleOnClickUpdateDocumentStatus}
          >
            確定
          </MuiButton>
        </div>
      </div>
    )
  }

  const CompleteView = () => {
    return (
      <div className='relative h-[320px] w-[600px]'>
        <div className='px-9 pt-[56px]'>
          <p className='text-center text-lg font-bold'>校正依頼完了</p>
          <p className='mt-4 text-center text-sm font-medium'>
            {`${props.document.documentCode}　${props.document.documentContent.hotelNameLarge}`}
            <br />
            校正依頼を行いました
          </p>
        </div>
        <div className='absolute bottom-0 left-0 flex w-full items-center justify-center px-9 pb-9'>
          <MuiButton
            variant='contained'
            sx={{ width: 104 }}
            onClick={handleOnClickClose}
          >
            OK
          </MuiButton>
        </div>
      </div>
    )
  }
  return (
    <BaseModal shown={true} onClickClose={handleOnClickClose}>
      {complete ? <CompleteView /> : <ConfirmView />}
    </BaseModal>
  )
}

export default WorkspaceModalProofreadingRequest
