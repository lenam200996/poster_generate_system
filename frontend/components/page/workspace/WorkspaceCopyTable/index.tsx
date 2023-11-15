import { useState } from "react"
import Link from "next/link"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import WorkspaceModalCreateLink from "@/components/page/workspace/Modal/WorkspaceModalCreateLink"
import { DocumentResponseDto, PageForBookletDto } from "@/openapi"
import { DocumentSizeEnum, StatusEnum } from "@/config/enum"

//-------------------------------------------------------------------------
/**
 * 原稿情報
 */
//-------------------------------------------------------------------------
interface Props {
  copies: PageForBookletDto["documents"]
}

// 画面状態（none：通常 | link：リンクURL発行モーダル表示）
type DisplayStatus = "none" | "link"

//-------------------------------------------------------------------------
/**
 * ワークスペースの一覧の表示
 * @param props 原稿情報
 * @returns 表示内容
 */
//-------------------------------------------------------------------------
const WorkspaceCopyTable = (props: Props) => {
  const [displayStatus, setDisplayStatus] = useState<DisplayStatus>("none")
  const [selectedManuscript, setSelectedManuscript] =
    useState<DocumentResponseDto>(null)

  //-------------------------------------------------------------------------
  /**
   * リンクURLモーダルが閉じた際の処理
   *  - 画面の状態をリンク発行モーダルが表示していない状態に戻す。
   */
  //-------------------------------------------------------------------------
  const handleOnClose = () => setDisplayStatus("none")

  //-------------------------------------------------------------------------
  /**
   * 発行ボタン押下時の処理
   *  - 原稿情報
   *  - 画面の状態をリンクURL発行モーダルが表示した状態にする。
   * @param copy
   */
  //-------------------------------------------------------------------------
  const handleOnClickLink = (copy: DocumentResponseDto) => {
    setSelectedManuscript(copy)
    setDisplayStatus("link")
  }

  //=========================================================================
  /**
   * 表示内容
   */
  //=========================================================================
  return (
    <>
      {/*----------------------
              テーブル
      ----------------------*/}
      <table className='w-full min-w-max bg-container-main-secondary'>
        {/*----------------------
              一覧のヘッダー
        -----------------------*/}
        <thead>
          <tr className='bg-theme-yk-30 text-content-primary-dark90 h-10 border-y-[1px] border-divider-accent-secondary bg-[#CCE5FF] text-sm'>
            <th colSpan={3} className='text-content-default-quaternary'>
              原稿情報
            </th>
            <th colSpan={1} className='text-content-default-quaternary'>
              掲載宿情報
            </th>
            <th colSpan={3} className='text-content-default-quaternary'>
              進行情報
            </th>
            <th colSpan={4} className='text-content-default-quaternary'>
              操作
            </th>
          </tr>
          <tr className='bg-theme-yk-20 text-content-primary-dark90 h-10 border-b-[1px] border-divider-accent-secondary bg-[#F2F5FF] text-sm font-medium'>
            <th className='w-[80px] text-content-default-quaternary'>原稿ID</th>
            <th className='w-[80px] text-content-default-quaternary'>
              原稿サイズ
            </th>
            <th className='w-[80px] text-content-default-quaternary'>
              宿コード
            </th>
            <th className='min-w-[400px] text-content-default-quaternary'>
              宿名
            </th>
            <th className='w-[140px] text-content-default-quaternary'>
              ステータス
            </th>
            <th className='w-[140px] text-content-default-quaternary'>
              更新者
            </th>
            <th className='w-[140px] text-content-default-quaternary'>
              営業担当
            </th>
            <th className='w-[240px] text-content-default-quaternary'>
              リンク
            </th>
          </tr>
        </thead>
        {/*----------------------
                一覧の本体
        -----------------------*/}
        <tbody>
          {/* 一覧に表示する原稿の数だけ繰り返す */}
          {props.copies.map((copy, i) => (
            <tr
              className='bg-container-neutral-light20 h-12 border-b-[1px] border-divider-accent-secondary text-center text-sm text-content-default-primary odd:bg-container-main-tertiary last-of-type:border-b-0'
              key={i}
            >
              {/*--- 原稿ID ---*/}
              <td className='break-all px-2 text-xs'>{copy.documentCode}</td>

              {/*--- 原稿サイズ ---*/}
              <td>{DocumentSizeEnum[copy.documentSizeCode] ?? ""}</td>

              {/*--- 宿コード ---*/}
              <td>{copy.hotelCode}</td>

              {/*--- 宿名 ---*/}
              <td>{copy.documentContent.hotelNameLarge}</td>

              {/*--- ステータス ---*/}
              <td>{StatusEnum[copy.statusCode] ?? ""}</td>

              {/*--- 更新者 ---*/}
              <td>{copy.modifierPerson?.personName ?? ""}</td>

              {/*--- 営業担当 ---*/}
              <td>{copy.salesPerson?.personName ?? ""}</td>

              {/*--- リンク ---*/}
              <td>
                <BaseButtonIconText
                  icon='link'
                  text='発行'
                  onClick={() => handleOnClickLink(copy)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/*----------------------
         リンクURL発行モーダル
      ----------------------*/}
      {/**
       * リンクURL発行モーダルの表示
       *  - 発行ボタン押下したらモーダル表示
       *  - onClose：モーダルが閉じた際に画面の状態を戻す
       */}
      {displayStatus === "link" && (
        <WorkspaceModalCreateLink
          manuscript={selectedManuscript}
          onClose={handleOnClose}
        />
      )}
    </>
  )
}

export default WorkspaceCopyTable
