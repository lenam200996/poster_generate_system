import { smallAssemblies } from "@/config/api/mock/workspace/index"
interface Props {
  smallAssemblies: typeof smallAssemblies
}

const WorkspaceTableSmallAssembly = (props: Props) => {
  return (
    <div className='flex'>
      <p className='flex min-w-[114px] items-center justify-center bg-container-main-secondary text-sm font-medium text-content-default-quaternary'>
        うめ草
      </p>
      <table className='border-x-[1px] border-divider-accent-secondary bg-container-main-secondary'>
        <thead>
          <tr className='h-10 border-y-[1px] border-divider-accent-secondary bg-container-main-secondary text-xs text-content-default-quaternary'>
            <th className='w-[100px]'>うめ草コード</th>
            <th className='w-[80px]'>サイズ</th>
            <th className='w-[236px]'>内容</th>
          </tr>
        </thead>
        <tbody>
          {props.smallAssemblies.map((smallAssembly, i) => (
            <tr
              className='bg-container-neutral-light20 h-12 border-b-[1px] border-divider-accent-secondary text-center text-sm text-content-default-primary odd:bg-container-main-tertiary'
              key={i}
            >
              <td className='break-all px-2 text-sm'>
                {smallAssembly.code ?? "Y01"}
              </td>
              <td className='break-all px-2 text-sm'>{smallAssembly.size}</td>
              <td className='break-all px-2 text-sm'>
                {smallAssembly.detail ?? "カレンダー10-12月"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default WorkspaceTableSmallAssembly
