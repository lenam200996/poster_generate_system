interface Props {
  chartTitles: any
}

const WorkspaceTableChapterTitle = (props: Props) => {
  return (
    <div className='flex'>
      <p className='flex min-w-[114px] items-center justify-center bg-container-main-secondary text-sm font-medium text-content-default-quaternary'>
        見出し
      </p>
      <table className='border-x-[1px] border-divider-accent-secondary bg-container-main-secondary'>
        <thead>
          <tr className='h-10 border-y-[1px] border-divider-accent-secondary bg-container-main-secondary text-xs text-content-default-quaternary'>
            <th className='w-[100px]'>見出しコード</th>
          </tr>
        </thead>
        <tbody>
          {props.chartTitles.map((chartTitle, i) => (
            <tr
              className='bg-container-neutral-light20 h-12 border-b-[1px] border-divider-accent-secondary text-center text-sm text-content-default-primary odd:bg-container-main-tertiary'
              key={i}
            >
              <td className='break-all px-2 text-sm'>
                {chartTitle.code ?? "A01_M"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default WorkspaceTableChapterTitle
