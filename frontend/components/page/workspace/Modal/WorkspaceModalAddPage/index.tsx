import { useState } from "react"
import BaseModal from "@/components/base/overlay/BaseModal"
import { useRecoilState } from "recoil"
import { workspaceBookletState } from "@/atoms/workspace"

import MuiButton from "@mui/material/Button"
import BaseTextField from "@/components/base/form/BaseTextField"
import { useApiClient } from "@/hooks/useApiClient"

//-------------------------------------------------------------------------
/**
 * モーダル情報
 */
//-------------------------------------------------------------------------
interface Props {
  // ページ追加モーダルを閉じる際に呼び出す処理
  onClose: () => void
}

// 1度に追加可能な数
const ADD_MAX_PAGE = 500

// 作成可能なページ総数
const MAX_PAGE = 750

//-------------------------------------------------------------------------
/**
 * ページ追加モーダルの表示
 *
 * @param props モーダル情報
 * @returns モーダル表示内容
 */
//-------------------------------------------------------------------------
const WorkspaceModalAddPage = (props: Props) => {
  const apiClient = useApiClient()
  const [complite, setComplete] = useState<boolean>(false)
  const [pageToAdded, setPageToAdded] = useState<number>(1)
  const [bookletState, setBookletState] = useRecoilState(workspaceBookletState)

  //-------------------------------------------------------------------------
  /**
   * モーダルを閉じる際に呼ばれる処理
   * (モーダルの「キャンセル、OK」ボタンで呼ばれる)
   */
  //-------------------------------------------------------------------------
  const handleOnClose = () => {
    // state変数のページ追加数を初期化
    // state変数の完了フラグを初期化
    // ワークスペースで設定した処理（画面状態を戻す）を実行
    setPageToAdded(1)
    setComplete(false)
    props.onClose()
  }

  //-------------------------------------------------------------------------
  /**
   * ページ入力をする画面表示
   * @returns 画面の表示内容
   */
  //-------------------------------------------------------------------------
  const ConfirmView = () => {
    const [pageToAdd, setPageToAdd] = useState<number>(1)

    //=======================================================================
    /**
     * ページ数テキストフィールドに入力した際の処理
     * @param e テキストフィールドの入力内容
     */
    //=======================================================================
    const handleChange = (e) => {
      // ページ数テキストフィールドへの入力内容を取得
      let value = e.target.value

      // 入力内容が0なら1にする
      // (例) テキストフィールドに0を入力したら1にする
      if (value === "0") value = 1

      // 入力数が追加可能ページ数を超えていれば追加分を最大数にする
      // (例) テキストフィールドに900を入力したら500にする
      if (value > ADD_MAX_PAGE) value = ADD_MAX_PAGE

      // state変数にページ追加数を設定
      setPageToAdd(parseInt(value))
    }

    //=======================================================================
    /**
     * ページの追加確定の処理
     */
    //=======================================================================
    const handleAddNewPage = async () => {
      // 追加後のページ総数を算出
      //  - bookletState.numberOfPages：変更前のページ総数
      //  - pageToAdd：追加入力したページ数
      let newNumberOfPage = bookletState.numberOfPages + pageToAdd

      // 追加後のページ数がページ総数を超えているか判定
      if (newNumberOfPage > MAX_PAGE) {
        // 追加後ページ数が作成可能なページ最大数を超えた場合
        // アラートメッセージを表示して処理終了する

        // アラートメッセージで表示する作成可能なページ数を作成
        // 2ページ目までは別の用途で使用するため制限としての作成可能ページ数とは異なる。
        // (例) 計算の例題
        // 750 + 2 = 752
        //  - 作成可能ページ数：750
        //  - タイトルなど別用途：2
        //  - 画面表示の作成可能ページ数：752
        let viewMaxPageCount = MAX_PAGE + 2

        // アラートメッセージを表示
        // 処理を終了
        alert(
          `作成可能なページ数を超えました。\n上限は${viewMaxPageCount}ページです。`,
        )
        return
      } else {
        // 追加後のページ数が作成可能なページ最大数を超えていない場合
        // APIでページ総数を更新
        let responseUpdateBooklet =
          await apiClient.bookletApiFactory.bookletControllerUpdate({
            id: bookletState.id,
            numberOfPages: newNumberOfPage,
          })

        // 冊子のstate変数に追加後のページ数を設定
        setBookletState((state) => {
          return {
            ...state,
            numberOfPages: newNumberOfPage,
          }
        })

        // state変数の完了フラグを有効にする（次のページ追加完了画面に進む）
        // state変数のページ追加数を設定（次のページ完了画面で表示する）
        setComplete(true)
        setPageToAdded(pageToAdd)
      }
    }

    // 表示内容
    return (
      <div className='relative h-[320px] w-[600px]'>
        <div className='px-9 pt-[56px] '>
          {/* タイトル */}
          {/* 説明文 */}
          <p className='text-center text-lg font-bold'>ページの追加</p>
          <p className='mt-4 text-center text-sm font-medium'>
            追加するページ数を入力してください
          </p>
          <div className='mt-7 flex items-center justify-center'>
            {/* ページ数の入力フィールド */}
            <span className='mr-[20px] text-sm font-medium'>ページ数</span>
            <BaseTextField
              value={pageToAdd}
              type='number'
              className='h-[40px]'
              InputProps={{
                inputProps: {
                  min: 1,
                  maxLength: ADD_MAX_PAGE,
                  placeholder: "上限500",
                },
                inputMode: "numeric",
              }}
              onChange={handleChange}
              style={{ width: "120px" }}
              size='small'
            />
          </div>
        </div>
        <div className='absolute bottom-0 left-0 flex w-full items-center justify-between px-9 pb-9'>
          {/* キャンセルボタン */}
          <MuiButton
            color='inherit'
            variant='outlined'
            sx={{ width: 104 }}
            onClick={handleOnClose}
          >
            キャンセル
          </MuiButton>
          {/* 確定ボタン */}
          <MuiButton
            variant='contained'
            sx={{ width: 104 }}
            onClick={handleAddNewPage}
            disabled={
              !pageToAdd || isNaN(pageToAdd) || pageToAdd > ADD_MAX_PAGE
            }
          >
            確定
          </MuiButton>
        </div>
      </div>
    )
  }

  //-------------------------------------------------------------------------
  /**
   * ページ追加完了の画面表示
   * @returns 画面の表示内容
   */
  //-------------------------------------------------------------------------
  const CompleteView = () => {
    return (
      <div className='relative h-[320px] w-[600px]'>
        <div className='px-9 pt-[56px]'>
          <p className='text-center text-lg font-bold'>ページの追加完了</p>
          <p className='mt-4 text-center text-sm font-medium'>
            {pageToAdded}ページ
            <br />
            を追加しました
          </p>
        </div>
        <div className='absolute bottom-0 left-0 flex w-full items-center justify-center px-9 pb-9'>
          <MuiButton
            variant='contained'
            sx={{ width: 104 }}
            onClick={handleOnClose}
          >
            OK
          </MuiButton>
        </div>
      </div>
    )
  }

  // 表示内容
  return (
    <BaseModal shown={true} onClickClose={handleOnClose}>
      {complite ? <CompleteView /> : <ConfirmView />}
    </BaseModal>
  )
}

export default WorkspaceModalAddPage
