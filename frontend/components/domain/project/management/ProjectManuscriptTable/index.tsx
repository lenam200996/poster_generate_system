import { useEffect, useState } from "react"
import MuiCheckbox from "@mui/material/Checkbox"
import MuiFormControlLabel from "@mui/material/FormControlLabel"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import dayjs from "@/util/dayjs"
import { useRecoilState } from "recoil"
import {
  projectManagementDocuments,
  DocumentSearchDtoEx,
} from "@/atoms/projectManagement"
import { useApiClient } from "@/hooks/useApiClient"
import { UpdateManyDocumentStatusDtoStatusCodeEnum } from "@/openapi/api"
import Link from "next/link"
import { useRouter } from "next/router"

//-------------------------------------------------------------------------
/**
 *
 */
//-------------------------------------------------------------------------
interface Props {
  documents: DocumentSearchDtoEx[]
  searchStatus:
    | UpdateManyDocumentStatusDtoStatusCodeEnum
    | "UNUSED"
    | "MYSTOCK"
    | "MATCHED"
  searchPlate: string
}

//-------------------------------------------------------------------------
/**
 * プロジェクト詳細の進捗状況タブを表示
 *
 * @param props
 * @returns 表示内容
 */
//-------------------------------------------------------------------------
const ProjectManuscriptTable = (props: Props) => {
  const router = useRouter()
  const apiClient = useApiClient()
  const [selectedValues, setSelectedValues] = useState<number[]>([])
  const [documents, setDocuments] = useRecoilState(projectManagementDocuments)
  const [filterdDocuments, setFilterdDocuments] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  //-------------------------------------------------------------------------
  /**
   *
   * @param id
   */
  //-------------------------------------------------------------------------
  const handleOnChangeChecked = (id: number) => {
    if (selectedValues.includes(id)) {
      setSelectedValues((state) => state.filter((value) => value !== id))
    } else {
      setSelectedValues([...selectedValues, id])
    }
  }

  //-------------------------------------------------------------------------
  /**
   *
   */
  //-------------------------------------------------------------------------
  const handleOnDeleteSelected = () => {
    setShowDeleteModal(true)
  }

  //-------------------------------------------------------------------------
  /**
   *
   */
  //-------------------------------------------------------------------------
  const handleOnChangeAllChecked = () => {
    if (filterdDocuments.length === selectedValues.length) {
      setSelectedValues([])
    } else {
      setSelectedValues(filterdDocuments.map((document) => document.id))
    }
  }

  //-------------------------------------------------------------------------
  /**
   *
   * @param statusCode
   */
  //-------------------------------------------------------------------------
  const handleOnClickUpdateStatuses = async (
    statusCode: UpdateManyDocumentStatusDtoStatusCodeEnum,
  ) => {
    try {
      await apiClient.documentsApiFactory.documentControllerManyUpdateDocumentStatus(
        {
          statusCode,
          ids: selectedValues,
        },
      )
      const updatedDocuments = [...documents].map((document) => {
        if (selectedValues.includes(document.id)) {
          return {
            ...document,
            isDisabled: true,
          }
        } else {
          return document
        }
      })
      setDocuments(updatedDocuments)
      setSelectedValues([])
    } catch (error) {
      console.error(error)
    }
  }

  //-------------------------------------------------------------------------
  /**
   *
   * @param ids
   * @param status
   */
  //-------------------------------------------------------------------------
  const updateManuscriptsStatus = async (
    ids: number[],
    status: UpdateManyDocumentStatusDtoStatusCodeEnum,
  ) => {
    try {
      await apiClient.documentsApiFactory.documentControllerUpdateDocumentStatus(
        { id: ids[0], statusCode: status },
      )
      const updatedDocuments = [...documents].map((document) => {
        if (document.id === ids[0]) {
          return {
            ...document,
            isDisabled:
              status === "SEND_BACK" ||
              status === "MAKING" ||
              status === "PROOFREADING",
          }
        } else {
          return document
        }
      })
      setDocuments(updatedDocuments)
    } catch (error) {
      console.error(error)
    }
  }

  //-------------------------------------------------------------------------
  /**
   *
   */
  //-------------------------------------------------------------------------
  useEffect(() => {
    setFilterdDocuments(() =>
      documents.filter((document) => !document.isDisabled),
    )
  }, [documents])

  //=========================================================================
  /**
   * 表示内容
   */
  //=========================================================================
  return (
    <div>
      <div className='mt-[14px] flex h-[38px] items-center justify-between pl-[7px]'>
        {props.searchStatus === "CHECKING" && (
          <>
            <MuiFormControlLabel
              control={
                <MuiCheckbox
                  size='small'
                  checked={
                    props.documents.length > 0 &&
                    filterdDocuments.length === selectedValues.length
                  }
                  onChange={handleOnChangeAllChecked}
                />
              }
              label={
                <div className='text-sm text-content-default-primary'>
                  全てチェック
                </div>
              }
            />
            <div className='space-x-3'>
              <BaseButtonIconText
                icon='do_not_disturb_on'
                text='入稿キャンセル'
                disabled={!filterdDocuments.length}
                onClick={() => handleOnClickUpdateStatuses("MAKING")}
              />
              <BaseButtonIconText
                icon='reply'
                text='差し戻し'
                disabled={!filterdDocuments.length}
                onClick={() => handleOnClickUpdateStatuses("SEND_BACK")}
              />
              <BaseButtonIconText
                icon='check_circle'
                text='校了'
                disabled={!filterdDocuments.length}
                onClick={() => handleOnClickUpdateStatuses("PROOFREADING")}
              />
            </div>
          </>
        )}
      </div>
      {/*
      -------------------------
                一覧
      -------------------------
      */}
      <div className='mt-3 w-full overflow-x-auto bg-white-0'>
        <table className='w-full min-w-max border border-divider-accent-secondary'>
          {/*
          -------------------------
                一覧のヘッダー
          -------------------------
          */}
          <thead>
            <tr className='border-y border-b border-divider-accent-secondary bg-container-main-octnary text-xs text-content-default-quaternary '>
              {props.searchStatus === "CHECKING" ||
                (props.searchStatus === "UNUSED" && (
                  <th className='w-[50px] p-0'></th>
                ))}
              <th className='min-w-[80px] px-4 py-0'>
                <div className='flex min-h-[52px] items-center justify-center'>
                  原稿ID
                </div>
              </th>
              <th className='min-w-[80px] px-4 py-0'>宿コード</th>
              <th className='min-w-[236px] px-4 py-0'>宿名</th>
              <th className='min-w-[80px] px-4 py-0'>原稿サイズ</th>
              <th className='min-w-[140px] px-4 py-0'>営業担当</th>
              <th className='min-w-[140px] px-4 py-0'>原稿担当</th>
              <th className='min-w-[140px] px-4 py-0'>最終更新日</th>
              {props.searchStatus === "CHECKING" && (
                <th className='min-w-[140px] px-4 py-0'>操作</th>
              )}
            </tr>
          </thead>
          {/*
          -------------------------
                一覧の本体
          -------------------------
          */}
          <tbody>
            {props.documents.map((document) => (
              <tr
                key={document.id}
                className='border-b border-divider-accent-secondary text-xs font-medium even:bg-container-main-quaternary'
              >
                {props.searchStatus === "CHECKING" ||
                  (props.searchStatus === "UNUSED" && (
                    <td className='w-[50px] p-0'>
                      <div className='flex items-center justify-center'>
                        <MuiCheckbox
                          value={document.id}
                          size='small'
                          checked={
                            document.isDisabled ||
                            selectedValues.includes(document.id)
                          }
                          disabled={document.isDisabled}
                          onChange={(event) =>
                            handleOnChangeChecked(Number(event.target.value))
                          }
                        />
                      </div>
                    </td>
                  ))}
                {/* 原稿ID */}
                <td
                  className={`px-2 py-0 text-center ${
                    document.isDisabled && "opacity-50"
                  }`}
                >
                  <div className='flex min-h-[47px] items-center justify-center'>
                    {document.isDisabled ? (
                      <a className='cursor-default break-all text-gray-60'>
                        {document.documentCode}
                      </a>
                    ) : (
                      <Link
                        href={{
                          pathname: `/workspace/${document.booklet.id}`,
                          query: { viewMode: "split", documentId: document.id },
                        }}
                      >
                        <a className='break-all text-content-active-primary underline'>
                          {document.documentCode}
                        </a>
                      </Link>
                    )}
                  </div>
                </td>
                {/* 宿コード */}
                <td
                  className={`py-0 px-4 text-center text-sm ${
                    document.isDisabled && "opacity-50"
                  }`}
                >
                  {String(document.hotelCode).padStart(4, "0")}
                </td>
                {/* 宿名 */}
                <td
                  className={`py-0 px-4 text-center ${
                    document.isDisabled && "opacity-50"
                  }`}
                >
                  {document.documentContent.hotelNameLarge}
                </td>
                {/* 原稿サイズ */}
                <td
                  className={`py-0 px-4 text-center ${
                    document.isDisabled && "opacity-50"
                  }`}
                >
                  {document.documentSize.name}
                </td>
                {/* 営業担当 */}
                <td
                  className={`py-0 px-4 text-center ${
                    document.isDisabled && "opacity-50"
                  }`}
                >
                  {document.salesPerson && document.salesPerson.personName}
                </td>
                {/* 原稿担当 */}
                <td
                  className={`py-0 px-4 text-center ${
                    document.isDisabled && "opacity-50"
                  }`}
                >
                  {document.manuscriptPerson &&
                    document.manuscriptPerson.personName}
                </td>
                {/* 最終更新日 */}
                <td
                  className={`py-0 px-4 text-center ${
                    document.isDisabled && "opacity-50"
                  }`}
                >
                  {dayjs(document.modifiedAt).format("YYYY/M/D")}
                </td>
                {props.searchStatus === "CHECKING" && (
                  <td className='space-x-5 py-0 px-4 text-center'>
                    {/* 入稿キャンセルボタン */}
                    <BaseButtonIconText
                      icon='do_not_disturb_on'
                      text='入稿キャンセル'
                      disabled={document.isDisabled}
                      onClick={() =>
                        updateManuscriptsStatus([document.id], "MAKING")
                      }
                    />
                    {/* 差し戻しボタン */}
                    <BaseButtonIconText
                      icon='reply'
                      text='差し戻し'
                      disabled={document.isDisabled}
                      onClick={() =>
                        updateManuscriptsStatus([document.id], "SEND_BACK")
                      }
                    />
                    {/* 校了ボタン */}
                    <BaseButtonIconText
                      icon='check_circle'
                      text='校了'
                      disabled={document.isDisabled}
                      onClick={() =>
                        updateManuscriptsStatus([document.id], "PROOFREADING")
                      }
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProjectManuscriptTable
