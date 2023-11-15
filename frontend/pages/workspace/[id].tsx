import { useRouter } from "next/router"
import type { NextPage } from "next"
import Link from "next/link"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import {
  workspaceBookletState,
  workspaceManuscriptState,
} from "@/atoms/workspace"
import AuthLayout from "@/components/layout/Auth"
import WorkspaceSplitView from "@/components/page/workspace/WorkspaceSplitView"
import WorkspaceSplitTwo from "@/components/page/workspace/WorkspaceSplitTwo"
import WorkspaceListView from "@/components/page/workspace/WorkspaceBookletListView"
import WorkspaceBookletViewFullScreen from "@/components/page/workspace/WorkspaceBookletViewFullScreen"
import WorkspaceFormFullScreen from "@/components/page/workspace/WorkspaceFormFullScreen"
import WorkspacePreviewFullScreen from "@/components/page/workspace/WorkspacePreviewFullScreen"
import { useCallback, useEffect, useState } from "react"
import { useApiClient } from "@/hooks/useApiClient"
import { useShowAlertMessage } from "@/components/domain/global/AlertMessageProvider"
import { MediaTypeEnum } from "@/config/enum"
import { GlobalLoadingState } from "@/atoms/global"

const Workspace: NextPage = () => {
  const apiClient = useApiClient()
  const router = useRouter()
  const { viewMode, viewTarget, documentId, refresh } = router.query
  const { showAlertMessage } = useShowAlertMessage()
  const [bookletState, setBookletState] = useRecoilState(workspaceBookletState)
  const setManuscriptState = useSetRecoilState(workspaceManuscriptState)
  const manuscriptState = useRecoilValue(workspaceManuscriptState)
  const [idmlEditId, setIdmlEditId] = useState("")
  const setLoadingState = useSetRecoilState(GlobalLoadingState)

  /**
   * データ取得（メニュー移動あり）
   */
  const getData = useCallback(async () => {
    if (router.isReady) {
      try {
        const response = await apiClient.bookletApiFactory.bookletControllerGet(
          Number(router.query.id),
        )
        if (
          response.data.project.deletedAt !== null &&
          response.data.deletedAt !== null
        ) {
          router.push("/")
        }

        setBookletState(response.data)

        // 原稿IDが設定される場合は、原稿情報を取得する
        if (documentId) {
          const documentResponse =
            await apiClient.documentsApiFactory.documentControllerGetDocument(
              Number(documentId),
            )
          const document = documentResponse.data
          const editId =
            document.aliasId === null
              ? `${document.projectId}_${document.bookletId}_${document.id}`
              : `${document.alias.projectId}_${document.alias.bookletId}_${document.alias.id}`
          if (!document.projectId || !document.bookletId || !document.id) return

          if (
            document.aliasId &&
            (!document.projectId || !document.bookletId || !document.id)
          )
            return
          setIdmlEditId(editId)

          let result =
            await apiClient.idmlReplaceApiFactory.idmlReplaceControllerGetWorkspaceItems(
              editId,
            )
          const idmlResponse = result
          const items = idmlResponse.data.items

          setManuscriptState((state) => ({
            ...state,
            id: document.id,
            editId: editId,
            // hotelCode: document.hotelCode,
            original: idmlResponse.data,
            items: items,
            // sizeCode: document.documentSizeCode,
            document: document,
          }))
        }
        if (refresh) {
          delete router.query.refresh
          router.push({
            query: { ...router.query },
          })
        }
      } catch (error) {
        console.error(error)
        router.push("/")
      }
    }
  }, [
    apiClient.bookletApiFactory,
    apiClient.documentsApiFactory,
    apiClient.idmlReplaceApiFactory,
    documentId,
    router.isReady,
    router.query.id,
    router.query.refresh,
    setBookletState,
    setManuscriptState,
  ])

  useEffect(() => {
    if (router.query.viewState == "Price") {
      getDataNoChangeMenu()
    }
  }, [router.query.viewState])

  /**
   * データ取得（メニュー移動なし）
   */
  const getDataNoChangeMenu = useCallback(async () => {
    if (router.isReady) {
      try {
        // 冊子情報の取得
        const response = await apiClient.bookletApiFactory.bookletControllerGet(
          Number(router.query.id),
        )
        // 冊子情報の取得判定
        if (
          response.data.project.deletedAt !== null &&
          response.data.deletedAt !== null
        ) {
          // 取得出来なかった場合
          // 処理が全て終わったら画面ローディング中（画面全体が薄暗くなっている状態）を解除する
          // プロジェクトリスト画面に遷移
          setLoadingState(false)
          router.push("/")
        }

        // 取得した冊子情報をstate変数に格納
        // 他の画面でも取得内容が参照可能とする
        setBookletState(response.data)

        // 原稿IDが設定される場合は、原稿情報を取得する
        if (documentId) {
          // 原稿の取得
          const documentResponse =
            await apiClient.documentsApiFactory.documentControllerGetDocument(
              Number(documentId),
            )

          // 原稿から編集IDを作成
          const document = documentResponse.data
          const editId = `${document.projectId}_${document.bookletId}_${document.id}`

          // ID（原稿ID・冊子ID・ID）が１つでも無ければ個々の処理終了
          if (!document.projectId || !document.bookletId || !document.id) return

          // 編集するIDMLのIDをstate変数に設定
          setIdmlEditId(editId)

          // Workspaceアイテム一覧の取得
          let result =
            await apiClient.idmlReplaceApiFactory.idmlReplaceControllerGetWorkspaceItems(
              editId,
            )

          // アイテム一覧の取得
          const idmlResponse = result
          const items = idmlResponse.data.items

          // 画面stateを変更
          setManuscriptState({
            id: document.id,
            editId: editId,
            original: idmlResponse.data,
            items: items,
            viewState: "Price",
            document: document,
          })

          // 正常にメッセージで保存が「成功」したことがわかる内容を表示
          if (router.query.viewState !== "Price")
            showAlertMessage("success", "料金表保存に成功しました")
          // 処理が全て終わったら画面ローディング中（画面全体が薄暗くなっている状態）を解除する
          setLoadingState(false)
        }
      } catch (error) {
        // エラーになった場合
        // エラーメッセージをログに書き込む
        // メッセージで保存が「失敗」したことがわかる内容を表示
        // 処理が全て終わったら画面ローディング中（画面全体が薄暗くなっている状態）を解除する
        // プロジェクトリスト画面に遷移
        console.error(error)
        if (router.query.viewState !== "Price")
          showAlertMessage("error", "料金表保存失敗しました")
        setLoadingState(false)
        router.push("/")
      }
    }
  }, [
    apiClient.bookletApiFactory,
    apiClient.documentsApiFactory,
    apiClient.idmlReplaceApiFactory,
    documentId,
    router.isReady,
    router.query.id,
    setBookletState,
    setManuscriptState,
  ])

  /**
   * 初期化
   */
  useEffect(() => {
    setManuscriptState(null)
    setBookletState(null)
    getData()
  }, [
    apiClient.bookletApiFactory,
    apiClient.documentsApiFactory,
    apiClient.idmlReplaceApiFactory,
    documentId,
    router.isReady,
    router.query.id,
    router.query.refresh,
    setBookletState,
    setManuscriptState,
    getData,
  ])

  /**
   * リフレッシュ
   */
  const onRefresh = () => {
    getData()
  }

  /**
   * セーブ
   */
  const onSave = () => {
    getDataNoChangeMenu()
  }

  return (
    <AuthLayout>
      <div id='screenshot-div' className='-z-10'></div>
      <div className='relative z-10 h-full min-w-[1280px] bg-white-0'>
        <div className='relative flex h-8 items-center justify-center bg-container-main-primary'>
          <div className='absolute left-3'>
            <Link href='/'>
              <button className='flex cursor-pointer items-center bg-transparent'>
                <span className='material-symbols-outlined mr-1 text-xl leading-none text-content-default-secondary'>
                  arrow_back
                </span>
                <span className='text-sm text-content-default-secondary'>
                  プロジェクトリストに戻る
                </span>
              </button>
            </Link>
          </div>
          <p className='font-sm font-bold text-content-default-primary'>
            {bookletState &&
              `${MediaTypeEnum[bookletState.project.mediaTypeCode]} ${
                bookletState.project.issueYear
              }年 ${bookletState.project.issueMonth}月号 ${
                bookletState.masterEditionCode
                  ? `${bookletState.masterEditionCode.name}版`
                  : ""
              }`}
          </p>
        </div>
        <div className='h-[calc(100%_-_32px)]'>
          {viewMode === "split" && (
            <WorkspaceSplitView
              booklet={bookletState}
              idmlEditId={idmlEditId}
            />
          )}
          {viewMode === "splitTwo" && (
            <WorkspaceSplitTwo
              refresh={onRefresh}
              save={onSave}
              idmlEditId={idmlEditId}
            />
          )}
          {viewMode === "list" && <WorkspaceListView booklet={bookletState} />}
          {viewMode === "fullscreen" && viewTarget === "booklet" && (
            <WorkspaceBookletViewFullScreen booklet={bookletState} />
          )}
          {viewMode === "fullscreen" && viewTarget === "form" && (
            <WorkspaceFormFullScreen
              refresh={onRefresh}
              save={onSave}
              idmlEditId={idmlEditId}
            />
          )}
          {viewMode === "fullscreen" && viewTarget === "preview" && (
            <WorkspacePreviewFullScreen />
          )}
        </div>
      </div>
    </AuthLayout>
  )
}

export default Workspace
