import { useState } from "react"
import { useRouter } from "next/router"
import { useRecoilState } from "recoil"
import { myStockProjects } from "@/atoms/myStock"
import MuiButton from "@mui/material/Button"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import BaseModal from "@/components/base/overlay/BaseModal"
import { Manuscript, userCognitoMock } from "@/config/api/mock/myStock"
import { DocumentMyStockPublicDto } from "@/openapi"
import { useMyStock } from "@/hooks/useMyStock"

type Props = {
  myStock: DocumentMyStockPublicDto
}

const MyStockModalUnSave = (props: Props) => {
  const router = useRouter()
  const [shown, setShown] = useState(false)
  const [complete, setComplete] = useState(false)
  const { toggleMyStock } = useMyStock()
  const handleOnClickExact = () => {
    toggleMyStock(false, props.myStock.document.id, userCognitoMock)
    setComplete(true)
  }

  return (
    <div>
      <BaseButtonIconText
        icon='share'
        text='保存解除'
        disabled={
          props.myStock.document.sharingAliasTo &&
          props.myStock.document.sharingAliasTo.length > 0
        }
        onClick={() => setShown(true)}
      />
      <BaseModal shown={shown} onClickClose={() => setShown(false)}>
        <div className='relative h-[320px] w-[600px]'>
          <div className='px-9 pt-[56px]'>
            <p className='text-center text-lg font-bold'>
              マイストックから保存解除
            </p>
            <div className='mt-8 flex justify-center'>
              <p className='text-center text-sm leading-6'>
                {props.myStock.booklet.masterEditionCode.name}版
                <br />
                {props.myStock.document.documentContent.hotelNameLarge}&emsp;
                {props.myStock.document.documentSize.name}
                サイズを
                <br />
                {!complete
                  ? "マイストックから保存解除しますか？"
                  : "マイストックから保存解除しました"}
              </p>
            </div>
          </div>
          {!complete ? (
            <div className='absolute left-0 bottom-0 flex w-full justify-between px-9 pb-9'>
              <MuiButton
                color='inherit'
                variant='outlined'
                sx={{ width: 104 }}
                onClick={() => setShown(false)}
              >
                キャンセル
              </MuiButton>
              <MuiButton
                variant='contained'
                sx={{ width: 104 }}
                onClick={handleOnClickExact}
              >
                確定
              </MuiButton>
            </div>
          ) : (
            <div className='absolute left-0 bottom-0 flex w-full justify-center px-9 pb-9'>
              <MuiButton
                variant='contained'
                sx={{ width: 104 }}
                onClick={() => {
                  setShown(false)
                  setComplete(false)
                  router.push("/myStock")
                }}
              >
                OK
              </MuiButton>
            </div>
          )}
        </div>
      </BaseModal>
    </div>
  )
}

export default MyStockModalUnSave
