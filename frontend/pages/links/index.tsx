import type { NextPage } from "next"
import Link from "next/link"
import AuthLayout from "@/components/layout/Auth"

const Links: NextPage = () => {
  return (
    <AuthLayout>
      <div className='p-10'>
        <div>
          <Link href='/'>プロジェクトリストへ移動する</Link>
        </div>
        <div className='mt-5'>
          <Link href='/management/1'>プロジェクト管理へ移動する</Link>
        </div>
        <div className='mt-5'>
          <Link href='/workspace/1?viewMode=split'>
            ワークスペース 分割ビューへ移動する
          </Link>
        </div>
        <div className='mt-5'>
          <Link href='/workspace/1?viewMode=list'>
            ワークスペース リストビューへ移動する
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}

export default Links
