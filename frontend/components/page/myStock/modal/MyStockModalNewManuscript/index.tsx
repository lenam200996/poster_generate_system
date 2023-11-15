import { useState } from "react"
import MuiButton from "@mui/material/Button"
import MuiFormControl from "@mui/material/FormControl"
import MuiSelect from "@mui/material/Select"
import MuiMenuItem from "@mui/material/MenuItem"
import BaseModal from "@/components/base/overlay/BaseModal"
import TemplateModalSelectManuscript from "@/components/domain/template/TemplateModalSelectManuscript"
import MyStockModalSettingsManuscript from "@/components/page/myStock/modal/MyStockModalSettingsManuscript"
import { MasterDocumentSizeDtoCodeEnum } from "@/openapi"
type Props = {
  reload?: () => void
}
const MyStockModalNewManuscript = (props: Props) => {
  const [displayStatus, setDisplayStatus] = useState<
    "selectManuscriptType" | "selectDesignTemplate" | "settingsManuscript"
  >(null)

  const [documentSize, setDocumentSize] = useState("")
  const [templateName, setTemplateName] = useState("")

  const handleOnChange = (value: string) => {
    setDocumentSize(value)
  }

  const handleOnClose = () => {
    setDocumentSize("")
    setDisplayStatus(null)
  }

  return (
    <div>
      <MuiButton
        variant='contained'
        onClick={() => setDisplayStatus("selectManuscriptType")}
      >
        新規原稿作成
      </MuiButton>
      <BaseModal
        shown={
          (displayStatus === "selectManuscriptType" ||
            displayStatus !== null) === true
        }
        onClickClose={handleOnClose}
      >
        <div className='relative h-[320px] w-[600px]'>
          <div className='px-9 pt-[56px]'>
            <p className='text-center text-lg font-bold'>原稿サイズの選択</p>
            <p className='mt-4 text-center text-sm font-medium'>
              原稿サイズを選択してください
            </p>
            <div className='mt-8 flex justify-center'>
              <MuiFormControl size='small' sx={{ minWidth: 122 }}>
                <MuiSelect
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  defaultValue=''
                  onChange={(event) => handleOnChange(event.target.value)}
                >
                  <MuiMenuItem value=''>選択</MuiMenuItem>
                  <MuiMenuItem value='ONE_ONE'>1</MuiMenuItem>
                  <MuiMenuItem value='ONE_TWO'>1/2</MuiMenuItem>
                  <MuiMenuItem value='ONE_FOUR'>1/4</MuiMenuItem>
                </MuiSelect>
              </MuiFormControl>
            </div>
          </div>
          <div className='absolute left-0 bottom-0 flex w-full items-center justify-between px-9 pb-9'>
            <MuiButton
              color='inherit'
              variant='outlined'
              sx={{ width: 104 }}
              onClick={() => {
                setDisplayStatus(null)
                handleOnClose()
              }}
            >
              キャンセル
            </MuiButton>
            <MuiButton
              variant='contained'
              sx={{ width: 104 }}
              disabled={documentSize === ""}
              onClick={() => {
                if (documentSize === "ONE_ONE") {
                  setDisplayStatus("selectDesignTemplate")
                } else {
                  setDisplayStatus("settingsManuscript")
                }
              }}
            >
              確定
            </MuiButton>
          </div>
        </div>
      </BaseModal>
      {(displayStatus === "selectDesignTemplate" ||
        displayStatus === "settingsManuscript") === true && (
        <TemplateModalSelectManuscript
          manuscriptSize={documentSize as MasterDocumentSizeDtoCodeEnum}
          onPrev={() => setDisplayStatus("selectManuscriptType")}
          onClose={() => setDisplayStatus("selectManuscriptType")}
          onClick={(id: number, name: string) => {
            setTemplateName(name)
            setDisplayStatus("settingsManuscript")
          }}
        />
      )}
      {displayStatus === "settingsManuscript" && (
        <MyStockModalSettingsManuscript
          documentSize={documentSize as MasterDocumentSizeDtoCodeEnum}
          templateName={templateName}
          onPrev={() => setDisplayStatus("selectDesignTemplate")}
          onClose={() => setDisplayStatus("selectDesignTemplate")}
          onChange={() => setDisplayStatus("selectDesignTemplate")}
          onExact={(data) => {
            setDisplayStatus(null)
            setDocumentSize("")
            if (data.reload) {
              props.reload()
            }
          }}
        />
      )}
    </div>
  )
}

export default MyStockModalNewManuscript
