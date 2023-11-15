import { useEffect, useState } from "react"
import BaseModal from "@/components/base/overlay/BaseModal/index"
import MuiButton from "@mui/material/Button"
import BaseTextField from "@/components/base/form/BaseTextField"
import BaseButtonText from "@/components/base/button/BaseButtonText"
import { useRecoilValue } from "recoil"
import { workspaceBookletState } from "@/atoms/workspace"

interface Props {
  shown?: boolean
  pageNumber: number
  onPrev: () => void
  onClose: () => void
  onExact: ({ indexHeader }: { indexHeader: string }) => void
}

const WorkspaceModalSelectIndexHeader = (props: Props) => {
  const bookletState = useRecoilValue(workspaceBookletState)
  const [keyword, setKeyword] = useState("")

  const handleOnClickClose = () => {
    props.onClose()
  }
  const handleOnClick = ({ indexHeader }: { indexHeader: string }) => {
    props.onExact({ indexHeader })
  }
  const handleOnClickPrev = () => {
    props.onPrev()
  }

  return (
    <div>
      <BaseModal shown={props.shown} onClickClose={handleOnClickClose}>
        <div className='relative h-[640px] w-[1200px] px-[50px] pt-[56px]'>
          <div className='flex items-center'>
            <p className=' text-content-primary-dark90 text-lg font-bold'>
              ツメ見出しの選択
            </p>
            <div className='ml-8'>
              <BaseTextField
                sx={{ width: 440 }}
                size='small'
                placeholder='例）松茸コラム'
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
            </div>
            <div className='ml-8 flex w-[440px] space-x-11'>
              <MuiButton variant='contained' sx={{ width: 104 }}>
                検索
              </MuiButton>
              <BaseButtonText
                disabled={keyword === ""}
                onClick={() => setKeyword("")}
              >
                <span className='text-[15px] leading-6'>クリア</span>
              </BaseButtonText>
            </div>
          </div>
          <div className='scrollbar-hide mt-8 grid max-h-[410px] grid-cols-4 gap-3 overflow-y-auto'>
            {bookletState.masterEditionCode.thumbIndexByEditionCodes.length >
              0 &&
              bookletState.masterEditionCode.thumbIndexByEditionCodes[0].thumbIndexImages
                .filter((item) => (props.pageNumber % 2 == 0) === item.isRight)
                .map((item) => (
                  <div
                    className='w-[256px] rounded border border-divider-accent-primary py-3'
                    key={item.id}
                  >
                    <div className='mx-auto flex h-[238px] justify-center'>
                      <img
                        src={item.imageConvert}
                        className='h-full w-auto'
                        alt={item.code}
                      />
                    </div>
                    <div className='mt-6 px-7'>
                      <p className='text-sm font-bold'>{item.code}</p>
                      <div className='mt-4 flex justify-end'>
                        <MuiButton
                          variant='contained'
                          size='small'
                          sx={{ width: 47 }}
                          onClick={() =>
                            handleOnClick({ indexHeader: item.groupId })
                          }
                        >
                          選択
                        </MuiButton>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
          <div className='absolute bottom-0 left-0 flex w-full items-center justify-center px-9 pb-9'>
            <MuiButton
              color='inherit'
              variant='outlined'
              sx={{ width: 104 }}
              onClick={handleOnClickPrev}
            >
              戻る
            </MuiButton>
          </div>
        </div>
      </BaseModal>
    </div>
  )
}

export default WorkspaceModalSelectIndexHeader
