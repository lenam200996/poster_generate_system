import { useState, useEffect } from "react"
import BaseModal from "@/components/base/overlay/BaseModal/index"
import MuiButton from "@mui/material/Button"
import MuiMenuItem from "@mui/material/MenuItem"
import MuiSelect from "@mui/material/Select"
import BaseTextField from "@/components/base/form/BaseTextField"
import { SafeParseError, ZodNullable, z } from "zod"
import errorMessage from "@/config/errorMessage"
import BaseErrorBody from "@/components/base/typography/BaseErrorBody"
import MuiLoadingButton from "@mui/lab/LoadingButton"
import { useApiClient } from "@/hooks/useApiClient"
import { PageForBookletDto } from "@/openapi"
import { DocumentSizeType } from "@/config/api/mock/workspace/booklet"
import { CircularProgress } from "@mui/material"
//import { CollectionsBookmarkRounded } from "@mui/icons-material"
import { HotelInfoResponse } from "@/openapi"

//-------------------------------------------------------------------------
/**
 * ワークスペースの原稿情報
 */
//-------------------------------------------------------------------------
interface Props {
  page: PageForBookletDto
  documentSize: DocumentSizeType
  type: "new" | "edit"
  templateName?: string
  hotelCode?: string
  hotelName?: string
  salesManager?: string
  salesManagers: Array<{
    label: string
    value: string
  }>
  onPrev?: () => void
  onClose?: () => void
  onChange?: () => void
  onExact: ({
    hotelInfo,
    salesManager,
  }: {
    hotelInfo: HotelInfoResponse
    salesManager: string
  }) => void
  loading?: boolean
}

//-------------------------------------------------------------------------
/**
 * 営業担当のメニュー情報
 */
//-------------------------------------------------------------------------
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 180,
    },
  },
}

//-------------------------------------------------------------------------
/**
 * ワークスペースの原稿編集モーダルの表示
 *
 * @param props ワークスペースの原稿情報
 * @returns モーダル表示内容
 */
//-------------------------------------------------------------------------
const WorkspaceModalSettingsManuscript = (props: Props) => {
  const apiClient = useApiClient()
  const [hotelCode, setHotelCode] = useState<string | null>(null)
  const [hotelName, setHotelName] = useState("")
  const [salesManager, setSalesManager] = useState<string>("")
  const [hotelInfo, setHotelInfo] = useState<HotelInfoResponse>(null)
  const [disable, setDisable] = useState(false)
  const [fetchingData, setFetchingData] = useState(false)
  const [changeTemplateShow, setChangeTemplateShow] = useState(false)
  const [hotelCodeError, setHotelCodeError] = useState<Record<
    string,
    any
  > | null>(null)

  //-----------------------------------------------------------------------
  /**
   * フック処理
   */
  //-----------------------------------------------------------------------
  useEffect(() => {
    if (props.hotelCode) {
      setHotelCode(props.hotelCode)
    }
    if (props.hotelName) {
      setHotelName(props.hotelName)
    }
    if (props.salesManager) {
      setSalesManager(props.salesManager)
    }
  }, [props.hotelCode, props.hotelName, props.salesManager])

  //-----------------------------------------------------------------------
  /**
   * DBに宿コードと原稿サイズが存在するかのチェック処理
   *  1. APIで原稿IDを渡して原稿情報を取得。
   *  2. 取得内容から宿コードと原稿サイズを比較して一致すれば既にDBに存在すると判断。
   *  3. 既にDBに原稿データが存在すればエラーメッセージを表示する。
   *
   * @param code 宿コード
   * @returns DBに既に指定した宿コードと原稿サイズのデータが存在するかの状態
   *          [true：存在する、false：存在しない]
   */
  //-----------------------------------------------------------------------
  const checkDuplicatedDocument = async (code: string) => {
    if (fetchingData) return
    setFetchingData(true)
    try {
      const res = await apiClient.bookletApiFactory.bookletControllerGet(
        props.page.bookletId,
      )
      await res.data.pages.some((page) => {
        return page.documents.some((document) => {
          if (
            document.hotelCode === code &&
            document.documentSizeCode === props.documentSize
          ) {
            setHotelCodeError({
              hotelCodeInvalidError:
                "既に該当の宿コードと原稿サイズの原稿が存在します。",
            })
            return true
          }
          return false
        })
      })
      setFetchingData(false)
    } catch (error) {
      setFetchingData(false)
      console.log(error)
      setHotelCodeError({
        hotelCodeInvalidError: "接続にエラーが発生しました。",
      })
    }
  }

  //-----------------------------------------------------------------------
  /**
   * 戻るボタン押下時の処理
   */
  //-----------------------------------------------------------------------
  const handleOnClickPrev = () => {
    if (!props.onPrev) return
    props.onPrev()
  }

  //-----------------------------------------------------------------------
  /**
   * 閉じるボタン押下時の処理
   */
  //-----------------------------------------------------------------------
  const handleOnClickClose = () => {
    if (!props.onClose) return
    props.onClose()
  }

  //-----------------------------------------------------------------------
  /**
   * 変更ボタン押下時の処理
   */
  //-----------------------------------------------------------------------
  const handleOnClickChange = () => {
    setChangeTemplateShow(true)
    // props.onChange()
  }

  //-----------------------------------------------------------------------
  /**
   * 確定ボタン押下時の処理
   */
  //-----------------------------------------------------------------------
  const handleOnExact = () => {
    props.onExact({ hotelInfo: hotelInfo, salesManager })
  }

  //-----------------------------------------------------------------------
  /**
   * 指定された宿コードが数値として使用可能か返却
   *  - 使用不可の場合はエラーメッセージも返却する。
   */
  //-----------------------------------------------------------------------
  const hotelCodeSchema = z.object({
    hotelCodeInvalidError: z
      .string()
      .refine((value) => /^[0-9]{4}$/.test(value), {
        message: errorMessage.FOUR_DIGIT_NUMBER_LIMIT_ERROR,
      }),
  })

  //-----------------------------------------------------------------------
  /**
   * 宿コードテキストフィールドを変更した際の処理
   *  - 原稿編集が新規の場合にテキストフィールドとなる場合に作業する。
   *  - 宿コードをチェックして問題あればエラーメッセージを表示する。
   *
   * @param event 宿コードのテキストフィールド情報
   */
  //-----------------------------------------------------------------------
  const handleOnChangeHotelCode = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const code = event.target.value
    if (code !== "") {
      setHotelCode(code)
    } else if (code === "") {
      // 空文字が0に変換されてしまうためnullにする
      setHotelCode(null)
    }
    if (code !== "") {
      const result = hotelCodeSchema.safeParse({ hotelCodeInvalidError: code })
      if (!result.success) {
        setHotelName(null)
        setHotelCodeError(
          (result as SafeParseError<string>).error.flatten().fieldErrors,
        )
      } else {
        checkDuplicatedDocument(code)
        setHotelCodeError(null)
        const response =
          await apiClient.hotelApiFactory.hotelInfoControllerGetHotelInfo(code)
        if (response.data && response.data.result) {
          setHotelInfo(response.data)
          setHotelName(response.data.hotelName)
        } else {
          setHotelInfo(null)
          setHotelName(null)
          setHotelCodeError({
            hotelCodeInvalidError: errorMessage.HOTEL_CODE_NOT_EXIST,
          })
        }
      }
    } else {
      setHotelCodeError(null)
    }
  }

  //-----------------------------------------------------------------------
  /**
   * フック処理
   */
  //-----------------------------------------------------------------------
  useEffect(() => {
    setDisable(
      hotelCode === null ||
        hotelName === "" ||
        hotelCodeError !== null ||
        salesManager === "" ||
        fetchingData,
    )
  }, [hotelCode, hotelName, salesManager, hotelCodeError, fetchingData])

  //-----------------------------------------------------------------------
  /**
   * 営業担当ドロップダウンの選択項目作成
   */
  //-----------------------------------------------------------------------
  const ManagerOptions = props.salesManagers.map((option) => (
    <MuiMenuItem key={option.value} value={option.value}>
      {option.label}
    </MuiMenuItem>
  ))

  // 表示内容
  return (
    <div>
      <BaseModal shown={true} onClickClose={handleOnClickClose}>
        <div className='relative h-[640px] w-[1200px] px-[50px] pt-[56px]'>
          <div className='mx-auto w-[700px]'>
            <p className='text-content-primary-dark90 text-center text-lg font-bold'>
              原稿情報設定
            </p>
            <div className='mt-[105px]'>
              {props.documentSize === "ONE_ONE" && (
                <div className='flex items-center'>
                  <p className='w-[200px] text-sm font-medium'>
                    原稿レイアウト
                  </p>
                  <div className='flex items-center'>
                    <p className='mr-5 text-sm font-medium'>
                      {props.templateName}
                    </p>
                    <MuiButton
                      size='small'
                      variant='contained'
                      onClick={handleOnClickChange}
                    >
                      変更
                    </MuiButton>
                  </div>
                </div>
              )}
              <div className='mt-7'>
                <div className='flex items-center'>
                  <p className='w-[200px] text-sm font-medium'>宿コード</p>
                  {/* 原稿ページ新規の場合：宿コードをテキストフィールドで表示 */}
                  {props.type === "new" && (
                    <div className='flex flex-col'>
                      <div className='flex items-center'>
                        <BaseTextField
                          size='small'
                          sx={{ width: 60 }}
                          value={hotelCode ?? ""}
                          error={!!hotelCodeError?.hotelCodeInvalidError}
                          onChange={handleOnChangeHotelCode}
                        />
                        {fetchingData && (
                          <div className='ml-2 h-[20px]'>
                            <CircularProgress size={20} />
                          </div>
                        )}
                      </div>
                      {hotelCodeError?.hotelCodeInvalidError && (
                        <div className='mt-1'>
                          <BaseErrorBody>
                            {hotelCodeError.hotelCodeInvalidError}
                          </BaseErrorBody>
                        </div>
                      )}
                    </div>
                  )}
                  {/* 原稿ページ既存の場合：宿コードをテキストラベルで表示 */}
                  {props.type === "edit" && (
                    <p className='text-sm'>{hotelCode ?? ""}</p>
                  )}
                </div>
              </div>
              <div className='mt-7 flex items-center'>
                <p className='w-[200px] text-sm font-medium'>宿名</p>
                <p className='text-sm'>{hotelName ?? ""}</p>
              </div>
              <div className='mt-7 flex items-center'>
                <p className='w-[200px] text-sm font-medium'>営業担当</p>
                <MuiSelect
                  name='yukoyuko'
                  size='small'
                  value={salesManager}
                  sx={{ minWidth: 122 }}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  defaultValue=''
                  MenuProps={MenuProps}
                  onChange={(event) => setSalesManager(event.target.value)}
                >
                  <MuiMenuItem value=''>選択</MuiMenuItem>
                  {ManagerOptions}
                </MuiSelect>
              </div>
            </div>
          </div>
          <div className='absolute bottom-0 left-0 flex w-full items-center justify-between px-9 pb-9'>
            {props.type === "new" && (
              <MuiButton
                color='inherit'
                variant='outlined'
                sx={{ width: 104 }}
                onClick={handleOnClickPrev}
              >
                戻る
              </MuiButton>
            )}
            {props.type === "edit" && (
              <MuiButton
                color='inherit'
                variant='outlined'
                sx={{ width: 104 }}
                onClick={handleOnClickClose}
              >
                キャンセル
              </MuiButton>
            )}
            <MuiLoadingButton
              variant='contained'
              sx={{ width: 104 }}
              disabled={disable}
              onClick={handleOnExact}
              loading={props.loading}
            >
              確定
            </MuiLoadingButton>
          </div>
        </div>
      </BaseModal>
      <BaseModal shown={changeTemplateShow} onClickClose={() => {}}>
        <div className='relative min-h-[300px] min-w-[500px] px-9 pt-[56px]'>
          <p className='text-center text-lg font-bold'>
            原稿レイアウト変更確認
          </p>
          <div className='mt-5 text-center'>
            原稿の訴求エリアが初期化されますが
            <br />
            レイアウトを変更しますか？
          </div>
          <div className='absolute bottom-0 left-0 flex w-full items-center justify-between px-9 pb-9'>
            <MuiButton
              color='inherit'
              variant='outlined'
              sx={{ width: 104 }}
              onClick={() => setChangeTemplateShow(false)}
            >
              キャンセル
            </MuiButton>
            <MuiButton
              variant='contained'
              sx={{ width: 104 }}
              onClick={() => {
                setChangeTemplateShow(false)
                props.onChange()
              }}
            >
              確定
            </MuiButton>
          </div>
        </div>
      </BaseModal>
    </div>
  )
}

export default WorkspaceModalSettingsManuscript
