import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { useState } from "react"
import BaseModal from "@/components/base/overlay/BaseModal"
import MuiButton from "@mui/material/Button"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation } from "swiper"
import WorkspaceModalSelectIndexHeader from "@/components/page/workspace/Modal/WorkspaceModalSelectIndexHeader"

interface Props {
  shown: boolean
  pageNumber: number
  onExact?: Function
  onClose?: Function
}

type DisplayStatus = "selectIndexHeader" | "none"

const WorkspaceModalSelectLayout = (props: Props) => {
  const [selectedValue, setSelectedValue] = useState<string>("")
  const [displayStatus, setDisplayStatus] = useState<DisplayStatus>("none")

  const handleOnClickClose = () => {
    props.onClose()
  }

  const handleOnClick = (value: string) => {
    setSelectedValue(value)
    setDisplayStatus("selectIndexHeader")
  }

  const handleOnExactSelectIndexHeader = ({
    indexHeader,
  }: {
    indexHeader: string
  }) => {
    props.onExact({ layout: selectedValue, indexHeader })
    setDisplayStatus("none")
  }

  return (
    <>
      <BaseModal shown={props.shown} onClickClose={handleOnClickClose}>
        <div className='relative h-[640px] w-[1200px] px-9 pt-[56px]'>
          <p className='text-center text-lg font-bold'>ページレイアウト選択</p>
          <div className='mt-5'>
            <Swiper
              slidesPerView={1}
              loop={true}
              navigation={{
                prevEl: ".custom-prev",
                nextEl: ".custom-next",
              }}
              modules={[Pagination, Navigation]}
              pagination={{
                clickable: true,
                el: "#pagination",
              }}
            >
              <SwiperSlide>
                <div className='relative m-auto h-[462px] w-[324px]'>
                  <img
                    src='/assets/layout-a.png'
                    className='h-auto w-full'
                    alt=''
                  />
                  <div className='absolute -right-[120px] top-[156px] flex flex-col'>
                    <div className='mb-4'>
                      <p className='text-[30px] font-bold text-[#1976D2]'>A</p>
                      <span className='font-medium text-[#001F29]'>
                        原稿 1×1
                      </span>
                    </div>
                    <MuiButton
                      variant='contained'
                      onClick={() => handleOnClick("a")}
                    >
                      選択
                    </MuiButton>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className='relative m-auto h-[462px] w-[324px]'>
                  <img
                    src='/assets/layout-b.png'
                    className='h-auto w-full'
                    alt=''
                  />
                  <div className='absolute -right-[120px] top-[156px] flex flex-col'>
                    <div className='mb-4'>
                      <p className='text-[30px] font-bold text-[#1976D2]'>B</p>
                      <span className='font-medium text-[#001F29]'>
                        原稿 1/2×2
                      </span>
                    </div>
                    <MuiButton
                      variant='contained'
                      onClick={() => handleOnClick("b")}
                    >
                      選択
                    </MuiButton>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className='relative m-auto h-[462px] w-[324px]'>
                  <img
                    src='/assets/layout-c.png'
                    className='h-auto w-full'
                    alt=''
                  />
                  <div className='absolute -right-[120px] top-[156px] flex flex-col'>
                    <div className='mb-4'>
                      <p className='text-[30px] font-bold text-[#1976D2]'>C</p>
                      <span className='block font-medium text-[#001F29]'>
                        原稿 1/2×1
                      </span>
                      <span className='block font-medium text-[#001F29]'>
                        原稿 1/4×1
                      </span>
                    </div>
                    <MuiButton
                      variant='contained'
                      onClick={() => handleOnClick("c")}
                    >
                      選択
                    </MuiButton>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className='relative m-auto h-[462px] w-[324px]'>
                  <img
                    src='/assets/layout-d.png'
                    className='h-auto w-full'
                    alt=''
                  />
                  <div className='absolute -right-[120px] top-[156px] flex flex-col'>
                    <div className='mb-4'>
                      <p className='text-[30px] font-bold text-[#1976D2]'>D</p>
                      <span className='block font-medium text-[#001F29]'>
                        原稿 1/4×2
                      </span>
                      <span className='block font-medium text-[#001F29]'>
                        原稿 1/2×1
                      </span>
                    </div>
                    <MuiButton
                      variant='contained'
                      onClick={() => handleOnClick("d")}
                    >
                      選択
                    </MuiButton>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className='relative m-auto h-[462px] w-[324px]'>
                  <img
                    src='/assets/layout-e.png'
                    className='h-auto w-full'
                    alt=''
                  />
                  <div className='absolute -right-[120px] top-[156px] flex flex-col'>
                    <div className='mb-4'>
                      <p className='text-[30px] font-bold text-[#1976D2]'>E</p>
                      <span className='font-medium text-[#001F29]'>
                        原稿 1/4×4
                      </span>
                    </div>
                    <MuiButton
                      variant='contained'
                      onClick={() => handleOnClick("e")}
                    >
                      選択
                    </MuiButton>
                  </div>
                </div>
              </SwiperSlide>
              <button className='custom-prev absolute left-0 top-[50%] z-10 h-12 w-12 bg-transparent'>
                <span className='material-symbols-outlined text-[48px] leading-none text-[#1976D2]'>
                  chevron_left
                </span>
              </button>
              <button className='custom-next absolute right-0 top-[50%] z-10 h-12 w-12 bg-transparent'>
                <span className='material-symbols-outlined text-[48px] leading-none text-[#1976D2]'>
                  chevron_right
                </span>
              </button>
            </Swiper>
          </div>
          <div
            id='pagination'
            className='swiper-pagination !bottom-[32px] right-0 m-auto !w-[400px]'
          ></div>
        </div>
      </BaseModal>
      <WorkspaceModalSelectIndexHeader
        shown={displayStatus === "selectIndexHeader"}
        pageNumber={props.pageNumber}
        onClose={() => setDisplayStatus("none")}
        onPrev={() => setDisplayStatus("none")}
        onExact={handleOnExactSelectIndexHeader}
      />
    </>
  )
}

export default WorkspaceModalSelectLayout
