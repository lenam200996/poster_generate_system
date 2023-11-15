import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import type { NextPage } from "next"
import Link from "next/link"
import { useRecoilState } from "recoil"
import { Manuscript, projects } from "@/config/api/mock/myStock"
import { myStockProjects } from "@/atoms/myStock"
import AuthLayout from "@/components/layout/Auth"
import MuiLink from "@mui/material/Link"
import { ArrowBack } from "@mui/icons-material"
import dayjs from "@/util/dayjs"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import BaseModalPreview from "@/components/base/overlay/BaseModalPreview"
import MyStockTableAlias from "@/components/page/myStock/table/MyStockTableAlias"
import MyStockModalUnSave from "@/components/page/myStock/modal/MyStockModalUnSave"
import { useApiClient } from "@/hooks/useApiClient"
import { DocumentMyStockPublicDto } from "@/openapi"

//-------------------------------------------------------------------------
/**
 * マイストック詳細の表示
 * @returns 表示内容
 */
//-------------------------------------------------------------------------
const MyStockDetailPage: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [myStock, setMyStock] = useState<DocumentMyStockPublicDto>(null)
  const [shownPreview, setShownPreview] = useState(false)
  const apiClient = useApiClient()

  //-------------------------------------------------------------------------
  /**
   * 編集ボタン押下時の処理
   * @returns
   */
  //-------------------------------------------------------------------------
  const handleOnClickEdit = () => {
    if (!myStock) return
    router.push({
      pathname: "/workspace/[id]",
      query: {
        id: myStock.booklet.id,
        viewMode: "split",
        documentId: myStock.document.id,
      },
    })
  }

  //-------------------------------------------------------------------------
  /**
   * フック処理
   */
  //-------------------------------------------------------------------------
  useEffect(() => {
    fetch()
  }, []) // eslint-disable-line

  //-------------------------------------------------------------------------
  /**
   *
   * @returns
   */
  //-------------------------------------------------------------------------
  const fetch = async () => {
    if (typeof id !== "string") return
    const res =
      await apiClient.documentMyStocksApi.documentMyStockControllerGet(
        Number(id),
      )
    setMyStock(res.data)
  }

  //=========================================================================
  /**
   * 表示内容
   */
  //=========================================================================
  return (
    <AuthLayout>
      <div className='flex h-[calc(100vh_-_60px)] min-w-[1280px] flex-col bg-container-main-primary'>
        <div className='overflow-y-auto px-10 pt-6 pb-10'>
          {/*----------------------
              前画面に戻るリンク
          -----------------------*/}
          <Link href='/myStock'>
            <MuiLink component='span' underline='none'>
              <div className='flex cursor-pointer items-center text-xs leading-none text-content-default-secondary'>
                <ArrowBack sx={{ width: 18, height: 18, marginLeft: "-3px" }} />
                マイストック 一覧に戻る
              </div>
            </MuiLink>
          </Link>

          <>
            <div className='flex items-center justify-between'>
              <h1 className='mt-4 text-xl font-bold text-content-default-primary'>
                マイストック詳細
              </h1>
              {/*----------------------
                      トップ項目
              -----------------------*/}
              <div className='flex'>
                {/*--- プレビューボタン ---*/}
                <BaseButtonIconText
                  disabled={true}
                  icon='plagiarism'
                  text='プレビュー'
                  onClick={() => setShownPreview(true)}
                />
                {/*--- 編集ボタン ---*/}
                <div className='ml-3'>
                  <BaseButtonIconText
                    icon='edit_note'
                    text='編集'
                    onClick={handleOnClickEdit}
                  />
                </div>
                {/*--- 保護解除ボタン ---*/}
                <div className='ml-3'>
                  {myStock && <MyStockModalUnSave myStock={myStock} />}
                </div>
              </div>
            </div>
            {/*----------------------
                    中間項目
            -----------------------*/}
            {myStock && (
              <div className='mt-11 text-sm text-content-default-primary'>
                {/*======================
                         1行目 
                =======================*/}
                {/*--- 名称 ---*/}
                <div className='flex h-[48px] items-center border-b-[1px] border-b-divider-accent-primary'>
                  <p className='mr-[36px] w-[176px] font-medium'>名称</p>
                  <p>{myStock.document.documentContent.hotelNameLarge}</p>
                </div>
                {/*======================
                         2行目 
                =======================*/}
                <div className='flex justify-between'>
                  {/*--- 原稿ID ---*/}
                  <div className='flex h-[48px] w-[calc(50%_-_40px)] items-center border-b-[1px] border-b-divider-accent-primary'>
                    <p className='mr-[36px] w-[176px] font-medium'>原稿ID</p>
                    <Link
                      href={{
                        pathname: `/workspace/${myStock.booklet.id}`,
                        query: {
                          viewMode: "split",
                          documentId: myStock.document.id,
                        },
                      }}
                    >
                      <a className='break-all text-content-active-primary underline'>
                        {myStock.document.documentCode}
                      </a>
                    </Link>
                  </div>
                  {/*--- 宿コード ---*/}
                  <div className='flex h-[48px] w-[calc(50%_-_40px)] items-center border-b-[1px] border-b-divider-accent-primary'>
                    <p className='mr-[36px] w-[176px] font-medium'>宿コード</p>
                    <p>{myStock.document.hotelCode}</p>
                  </div>
                </div>
                {/*======================
                         3行目 
                =======================*/}
                <div className='flex justify-between'>
                  {/*--- 原稿サイズ ---*/}
                  <div className='flex h-[48px] w-[calc(50%_-_40px)] items-center border-b-[1px] border-b-divider-accent-primary'>
                    <p className='mr-[36px] w-[176px] font-medium'>
                      原稿サイズ
                    </p>
                    <p>{myStock.document.documentSize.name}</p>
                  </div>
                  {/*--- 版 ---*/}
                  <div className='flex h-[48px] w-[calc(50%_-_40px)] items-center border-b-[1px] border-b-divider-accent-primary'>
                    <p className='mr-[36px] w-[176px] font-medium'>版</p>
                    <p>{myStock.booklet.masterEditionCode.name}</p>
                  </div>
                </div>
                {/*======================
                         4行目 
                ======================*/}
                <div className='flex justify-between'>
                  {/*--- 最終更新日 ---*/}
                  <div className='flex h-[48px] w-[calc(50%_-_40px)] items-center border-b-[1px] border-b-divider-accent-primary'>
                    <p className='mr-[36px] w-[176px] font-medium'>
                      最終更新日
                    </p>
                    <p>
                      {dayjs(myStock.document.modifiedAt).format(
                        "YYYY/MM/DD HH:MM",
                      )}
                    </p>
                  </div>
                  {/*--- ステータス ---*/}
                  <div className='flex h-[48px] w-[calc(50%_-_40px)] items-center border-b-[1px] border-b-divider-accent-primary'>
                    <p className='mr-[36px] w-[176px] font-medium'>
                      ステータス
                    </p>
                    <p>{myStock.document.status.name}</p>
                  </div>
                </div>
              </div>
            )}
            {myStock && myStock.document.sharingAliasTo.length > 0 && (
              <div className='mt-[56px]'>
                <h2 className='text-2xl font-bold text-content-default-primary'>
                  相乗り
                </h2>
                <div className='mt-4'>
                  <MyStockTableAlias
                    onDelete={fetch}
                    alias={myStock.document.sharingAliasTo}
                  />
                </div>
              </div>
            )}

            <BaseModalPreview
              imageUrl={"/" /*myStock.document.image*/}
              shown={shownPreview}
              onClose={() => setShownPreview(false)}
            />
          </>
        </div>
      </div>
    </AuthLayout>
  )
}

export default MyStockDetailPage
