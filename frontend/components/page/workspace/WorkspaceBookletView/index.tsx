import { useRouter } from "next/router"
import Link from "next/link"
import WorkspaceBookletSmall from "@/components/page/workspace/WorkspaceBookletSmall"
import WorkspaceChangeSplitListBar from "@/components/page/workspace/WorkspaceChangeSplitListBar"
import { BookletDetailResponseDto } from "@/openapi"
import { useState } from "react"
import WorkspaceModalAddPage from "../Modal/WorkspaceModalAddPage"

//-------------------------------------------------------------------------
/**
 * 冊子情報
 */
//-------------------------------------------------------------------------
type Props = {
  booklet: BookletDetailResponseDto
}

//-------------------------------------------------------------------------
/**
 * ワークスペース表示
 *
 * @param props 冊子情報
 * @returns ワークスペースでの表示内容
 */
//-------------------------------------------------------------------------
const WorkspaceBookletView = (props: Props) => {
  const [displayStatus, setDisplayStatus] = useState<"none" | "addNew">("none")
  const router = useRouter()

  // 冊子情報がなければ処理終了
  if (props.booklet === null) return

  // ページ情報の取得
  const pageNumbers = [
    ...Array(props.booklet ? props.booklet.numberOfPages : 0),
  ]
    .map((_, i) => i + 3)
    .reverse()

  // ワークスペースの表示内容
  return (
    <>
      <div className='relative h-[18px] w-full bg-[#F0F2F8] shadow-[0_14px_34px_rgba(16,42,73,0.05)]'>
        <div className='absolute left-0 top-0 flex h-[20px] w-full justify-end'>
          <Link
            href={{
              query: {
                id: router.query.id,
                viewMode: "fullscreen",
                viewTarget: "booklet",
                documentId: router.query.documentId,
              },
            }}
            replace
          >
            {/* ページの上の矢印アイコン */}
            <button className='flex h-5 w-5 items-center justify-center bg-[#1976D2]'>
              <span className='material-symbols-outlined text-xl leading-none text-white-0'>
                call_made
              </span>
            </button>
          </Link>
        </div>
      </div>
      {/* 並べられているページ */}
      <div className='flex overflow-x-auto bg-container-main-primary'>
        <div className='w-full' />
        {/* 初期値である３ページを表示 */}
        {/*  - onAddNewModal：画面の状態をページ追加モーダルが表示している状態にする */}
        <WorkspaceBookletSmall
          key={props.booklet.numberOfPages + 3}
          booklet={props.booklet}
          pageNumber={props.booklet.numberOfPages + 3}
          addNew={true}
          onAddNewModal={() => setDisplayStatus("addNew")}
        />
        {/* ページの数だけ繰り返してページを表示 */}
        {pageNumbers.map((pageNumber, i) => {
          const page =
            props.booklet &&
            props.booklet.pages.find((page) => page.pageNumber === pageNumber)
          return (
            <WorkspaceBookletSmall
              key={i}
              booklet={props.booklet}
              pageNumber={pageNumber}
              page={page}
            />
          )
        })}
      </div>
      {/* ページ項目のバー */}
      <WorkspaceChangeSplitListBar />

      {/* ページ追加モーダル */}
      {/*  - onClose：ページ追加モーダルを閉じた際の処理にこの画面の表示状態を初期化に設定 */}
      {displayStatus === "addNew" && (
        <WorkspaceModalAddPage onClose={() => setDisplayStatus("none")} />
      )}
    </>
  )
}

export default WorkspaceBookletView
