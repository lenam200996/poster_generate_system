import BaseModal from "@/components/base/overlay/BaseModal"
import MuiButton from "@mui/material/Button"
import BaseButtonCopyLink from "@/components/base/button/BaseButtonCopyLink/"
import { DocumentResponseDto } from "@/openapi"
import MuiCircularProgress from "@mui/material/CircularProgress"
import React, { useEffect, useState } from "react"
import { useApiClient } from "@/hooks/useApiClient"
import { imageMockBase64 } from "@/config/mocks"

interface Props {
  manuscript: DocumentResponseDto
  onClose: () => void
}

function generateRandomDigits(length) {
  let result = ""
  const characters = "0123456789"
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

function getCurrentTimestamp() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")
  const seconds = String(now.getSeconds()).padStart(2, "0")
  return `${year}${month}${day}${hours}${minutes}${seconds}`
}

const WorkspaceModalCreateLink: React.FC<Props> = (props: Props) => {
  const [uploading, setUploading] = useState(true)
  const [linkShare, setLinkShare] = useState("")
  const apiClient = useApiClient()
  const handleOnClose = () => {
    props.onClose()
  }
  useEffect(() => {
    const randomDigits = generateRandomDigits(6)
    apiClient.idmlReplaceApiFactory
      .idmlReplaceControllerCreateShareLink({
        filebase64: imageMockBase64,
        filepath: `share-img/${getCurrentTimestamp()}${randomDigits}.jpg`,
      })
      .then((res) => {
        setLinkShare(res.data)
        setUploading(false)
      })
  }, [apiClient.idmlReplaceApiFactory])

  return (
    <BaseModal shown={true} onClickClose={handleOnClose}>
      {uploading ? (
        <div className='flex h-[320px] w-[600px] items-center justify-center'>
          <MuiCircularProgress />
        </div>
      ) : (
        <div className='relative h-[320px] w-[600px]'>
          <div className='px-9 pt-[56px]'>
            <p className='text-center text-lg font-bold'>リンクURLを取得</p>
            <p className='mt-4 text-center text-sm font-medium'>
              {props.manuscript.documentCode}　
              {props.manuscript.documentContent.hotelNameLarge}
            </p>
            <div className='mt-8 flex justify-center'>
              <BaseButtonCopyLink link={linkShare} />
            </div>
          </div>
          <div className='absolute bottom-0 left-0 flex w-full justify-center px-9 pb-9'>
            <MuiButton
              variant='contained'
              sx={{ width: 104 }}
              onClick={handleOnClose}
            >
              Ok
            </MuiButton>
          </div>
        </div>
      )}
    </BaseModal>
  )
}

export default WorkspaceModalCreateLink
