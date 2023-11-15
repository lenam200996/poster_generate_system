import { useEffect, useState } from "react"
import {
  DocumentSizeType,
  Order,
  LayoutPattern,
} from "@/config/api/mock/workspace/booklet"
import WorkspaceModalSelectCopyType from "@/components/page/workspace/Modal/WorkspaceModalSelectCopyType"
import WorkspaceModalPlanOperation from "@/components/page/workspace/Modal/WorkspaceModalPlanOperation"
import WorkspaceButtonManuscript from "@/components/page/workspace/WorkspaceButtonManuscript"
import { PageForBookletDto } from "@/openapi"
import {
  workspaceActivePageNumberState,
  workspaceActivePageOrderState,
} from "@/atoms/workspace"
import { useRecoilState } from "recoil"

type DisplayStatus = "settingManuscript" | "operationManuscript" | "none"

type Props = {
  page: PageForBookletDto
  layout: LayoutPattern
  size: "small" | "large"
  bookletLocked: boolean
}

const WorkspaceModalSettingManuscript = (props: Props) => {
  const [activePageNumber, setActivePageNumber] = useRecoilState(
    workspaceActivePageNumberState,
  )
  const [activeOrderNumber, setActiveOrderNumber] = useRecoilState(
    workspaceActivePageOrderState,
  )
  const [order, setOrder] = useState<Order>(1)
  const [documentSize, setDocumentSize] = useState<DocumentSizeType>("ONE_ONE")
  const [displayStatus, setDisplayStatus] = useState<DisplayStatus>("none")

  const handleOnClickManuscriptSetting = ({ order, size }) => {
    setOrder(order)
    setDocumentSize(size)
    setDisplayStatus("settingManuscript")
    setActiveOrderNumber(order)
  }

  const handleOnClickManuscriptOperation = ({ order }: { order: Order }) => {
    const document = props.page.documents.find((e) => e.order === order)
    setOrder(order)
    setDocumentSize(document.documentSizeCode)
    setDisplayStatus("operationManuscript")
    setActiveOrderNumber(order)
  }

  const checkDataByOrder = (order: Order) => {
    return props.page.documents.some((e) => e.order === order)
  }

  const findImagesByOrder = (order: Order) => {
    const document = props.page.documents.find((e) => e.order === order)
    return document.documentTypeCode === "FILLER"
      ? document.filler.imageConvert
      : document.documentTypeCode === "HEAD_LINE"
      ? "/assets/design-import-header-preview.png"
      : "/assets/dummy/dummy-manuscript.png"
  }

  useEffect(() => {
    if (displayStatus === "none") {
      setActivePageNumber(null)
      setActiveOrderNumber(null)
    } else {
      setActivePageNumber(props.page.pageNumber)
    }
  }, [displayStatus, props.page.pageNumber, setActivePageNumber]) // eslint-disable-line

  return (
    <div className='absolute h-full w-full'>
      <div className='relative h-full w-full'>
        {props.layout === "A" && (
          <>
            {props.page.documents.length > 0 ? (
              <WorkspaceButtonManuscript
                documentSize='ONE_ONE'
                bookletSize={props.size}
                onClick={() => handleOnClickManuscriptOperation({ order: 1 })}
              >
                <div className='group/a1 relative'>
                  <img
                    src={findImagesByOrder(1)}
                    alt=''
                    className='h-full w-full'
                  />
                  <div
                    className={`absolute top-0 left-0 hidden h-full w-full bg-container-active-primary bg-opacity-30 group-hover/a1:block ${
                      props.page.pageNumber === activePageNumber &&
                      activeOrderNumber === 1
                        ? "!block"
                        : ""
                    }`}
                  ></div>
                </div>
              </WorkspaceButtonManuscript>
            ) : (
              <WorkspaceButtonManuscript
                documentSize='ONE_ONE'
                bookletSize={props.size}
                onClick={() =>
                  handleOnClickManuscriptSetting({ order: 1, size: "ONE_ONE" })
                }
              >
                <div className='group/a1 relative flex h-full w-full items-center justify-center'>
                  新規
                  <br />
                  原稿設定
                  <div
                    className={`absolute top-0 left-0 hidden h-full w-full bg-container-active-primary bg-opacity-30 group-hover/a1:block ${
                      props.page.pageNumber === activePageNumber &&
                      activeOrderNumber === 1
                        ? "!block"
                        : ""
                    }`}
                  ></div>
                </div>
              </WorkspaceButtonManuscript>
            )}
          </>
        )}
        {props.layout === "B" && (
          <>
            {checkDataByOrder(1) ? (
              <WorkspaceButtonManuscript
                documentSize='ONE_TWO'
                bookletSize={props.size}
                positionY='top'
                onClick={() => handleOnClickManuscriptOperation({ order: 1 })}
              >
                <div className='group/b1 relative'>
                  <img
                    src={findImagesByOrder(1)}
                    alt=''
                    className='h-full w-full'
                  />
                  <div
                    className={`absolute top-0 left-0 hidden h-full w-full bg-container-active-primary bg-opacity-30 group-hover/b1:block ${
                      props.page.pageNumber === activePageNumber &&
                      activeOrderNumber === 1
                        ? "!block"
                        : ""
                    }`}
                  ></div>
                </div>
              </WorkspaceButtonManuscript>
            ) : (
              <WorkspaceButtonManuscript
                documentSize='ONE_TWO'
                bookletSize={props.size}
                positionY='top'
                onClick={() =>
                  handleOnClickManuscriptSetting({ order: 1, size: "ONE_TWO" })
                }
              >
                <div className='group/b1 relative flex h-full w-full items-center justify-center'>
                  新規
                  <br />
                  原稿設定
                  <div
                    className={`absolute top-0 left-0 hidden h-full w-full bg-container-active-primary bg-opacity-30 group-hover/b1:block ${
                      props.page.pageNumber === activePageNumber &&
                      activeOrderNumber === 1
                        ? "!block"
                        : ""
                    }`}
                  ></div>
                </div>
              </WorkspaceButtonManuscript>
            )}
            {checkDataByOrder(2) ? (
              <WorkspaceButtonManuscript
                documentSize='ONE_TWO'
                bookletSize={props.size}
                positionY='bottom'
                onClick={() => handleOnClickManuscriptOperation({ order: 2 })}
              >
                <div className='group/b2 relative'>
                  <img
                    src={findImagesByOrder(2)}
                    alt=''
                    className='h-full w-full'
                  />
                  <div
                    className={`absolute top-0 left-0 hidden h-full w-full bg-container-active-primary bg-opacity-30 group-hover/b2:block ${
                      props.page.pageNumber === activePageNumber &&
                      activeOrderNumber === 2
                        ? "!block"
                        : ""
                    }`}
                  ></div>
                </div>
              </WorkspaceButtonManuscript>
            ) : (
              <WorkspaceButtonManuscript
                documentSize='ONE_TWO'
                bookletSize={props.size}
                positionY='bottom'
                onClick={() =>
                  handleOnClickManuscriptSetting({ order: 2, size: "ONE_TWO" })
                }
              >
                <div className='group/b2 relative flex h-full w-full items-center justify-center'>
                  新規
                  <br />
                  原稿設定
                  <div
                    className={`absolute top-0 left-0 hidden h-full w-full bg-container-active-primary bg-opacity-30 group-hover/b2:block ${
                      props.page.pageNumber === activePageNumber &&
                      activeOrderNumber === 2
                        ? "!block"
                        : ""
                    }`}
                  ></div>
                </div>
              </WorkspaceButtonManuscript>
            )}
          </>
        )}
        {props.layout === "C" && (
          <>
            {checkDataByOrder(1) ? (
              <WorkspaceButtonManuscript
                documentSize='ONE_TWO'
                bookletSize={props.size}
                positionY='top'
                onClick={() => handleOnClickManuscriptOperation({ order: 1 })}
              >
                <div className='group/c1 relative'>
                  <img
                    src={findImagesByOrder(1)}
                    alt=''
                    className='h-full w-full'
                  />
                  <div
                    className={`absolute top-0 left-0 hidden h-full w-full bg-container-active-primary bg-opacity-30 group-hover/c1:block ${
                      props.page.pageNumber === activePageNumber &&
                      activeOrderNumber === 1
                        ? "!block"
                        : ""
                    }`}
                  ></div>
                </div>
              </WorkspaceButtonManuscript>
            ) : (
              <WorkspaceButtonManuscript
                documentSize='ONE_TWO'
                bookletSize={props.size}
                positionY='top'
                onClick={() =>
                  handleOnClickManuscriptSetting({ order: 1, size: "ONE_TWO" })
                }
              >
                <div className='group/c1 relative flex h-full w-full items-center justify-center'>
                  新規
                  <br />
                  原稿設定
                  <div
                    className={`absolute top-0 left-0 hidden h-full w-full bg-container-active-primary bg-opacity-30 group-hover/c1:block ${
                      props.page.pageNumber === activePageNumber &&
                      activeOrderNumber === 1
                        ? "!block"
                        : ""
                    }`}
                  ></div>
                </div>
              </WorkspaceButtonManuscript>
            )}
            {checkDataByOrder(2) ? (
              <WorkspaceButtonManuscript
                documentSize='ONE_FOUR'
                bookletSize={props.size}
                positionY='bottom'
                positionX='right'
                onClick={() => handleOnClickManuscriptOperation({ order: 2 })}
              >
                <div className='group/c2 relative'>
                  <img
                    src={findImagesByOrder(2)}
                    alt=''
                    className='h-full w-full'
                  />
                  <div
                    className={`absolute top-0 left-0 hidden h-full w-full bg-container-active-primary bg-opacity-30 group-hover/c2:block ${
                      props.page.pageNumber === activePageNumber &&
                      activeOrderNumber === 2
                        ? "!block"
                        : ""
                    }`}
                  ></div>
                </div>
              </WorkspaceButtonManuscript>
            ) : (
              <WorkspaceButtonManuscript
                documentSize='ONE_FOUR'
                bookletSize={props.size}
                positionY='bottom'
                positionX='right'
                onClick={() =>
                  handleOnClickManuscriptSetting({ order: 2, size: "ONE_FOUR" })
                }
              >
                <div className='group/c2 relative flex h-full w-full items-center justify-center'>
                  新規
                  <br />
                  原稿設定
                  <div
                    className={`absolute top-0 left-0 hidden h-full w-full bg-container-active-primary bg-opacity-30 group-hover/c2:block ${
                      props.page.pageNumber === activePageNumber &&
                      activeOrderNumber === 2
                        ? "!block"
                        : ""
                    }`}
                  ></div>
                </div>
              </WorkspaceButtonManuscript>
            )}
            {checkDataByOrder(3) ? (
              <WorkspaceButtonManuscript
                documentSize='ONE_FOUR'
                bookletSize={props.size}
                positionY='bottom'
                positionX='left'
                onClick={() => handleOnClickManuscriptOperation({ order: 3 })}
              >
                <div className='group/c3 relative'>
                  <img
                    src={findImagesByOrder(3)}
                    alt=''
                    className='h-full w-full'
                  />
                  <div
                    className={`absolute top-0 left-0 hidden h-full w-full bg-container-active-primary bg-opacity-30 group-hover/c3:block ${
                      props.page.pageNumber === activePageNumber &&
                      activeOrderNumber === 3
                        ? "!block"
                        : ""
                    }`}
                  ></div>
                </div>
              </WorkspaceButtonManuscript>
            ) : (
              <WorkspaceButtonManuscript
                documentSize='ONE_FOUR'
                bookletSize={props.size}
                positionY='bottom'
                positionX='left'
                onClick={() =>
                  handleOnClickManuscriptSetting({ order: 3, size: "ONE_FOUR" })
                }
              >
                <div className='group/c3 relative flex h-full w-full items-center justify-center'>
                  新規
                  <br />
                  原稿設定
                  <div
                    className={`absolute top-0 left-0 hidden h-full w-full bg-container-active-primary bg-opacity-30 group-hover/c3:block ${
                      props.page.pageNumber === activePageNumber &&
                      activeOrderNumber === 3
                        ? "!block"
                        : ""
                    }`}
                  ></div>
                </div>
              </WorkspaceButtonManuscript>
            )}
          </>
        )}
        {props.layout === "D" && (
          <>
            {checkDataByOrder(1) ? (
              <WorkspaceButtonManuscript
                documentSize='ONE_FOUR'
                bookletSize={props.size}
                positionY='top'
                positionX='right'
                onClick={() => handleOnClickManuscriptOperation({ order: 1 })}
              >
                <div className='group/d1 relative'>
                  <img
                    src={findImagesByOrder(1)}
                    alt=''
                    className='h-full w-full'
                  />
                  <div
                    className={`absolute top-0 left-0 hidden h-full w-full bg-container-active-primary bg-opacity-30 group-hover/d1:block ${
                      props.page.pageNumber === activePageNumber &&
                      activeOrderNumber === 1
                        ? "!block"
                        : ""
                    }`}
                  ></div>
                </div>
              </WorkspaceButtonManuscript>
            ) : (
              <WorkspaceButtonManuscript
                documentSize='ONE_FOUR'
                bookletSize={props.size}
                positionY='top'
                positionX='right'
                onClick={() =>
                  handleOnClickManuscriptSetting({ order: 1, size: "ONE_FOUR" })
                }
              >
                <div className='group/d1 relative flex h-full w-full items-center justify-center'>
                  新規
                  <br />
                  原稿設定
                  <div
                    className={`absolute top-0 left-0 hidden h-full w-full bg-container-active-primary bg-opacity-30 group-hover/d1:block ${
                      props.page.pageNumber === activePageNumber &&
                      activeOrderNumber === 1
                        ? "!block"
                        : ""
                    }`}
                  ></div>
                </div>
              </WorkspaceButtonManuscript>
            )}
            {checkDataByOrder(2) ? (
              <WorkspaceButtonManuscript
                documentSize='ONE_FOUR'
                bookletSize={props.size}
                positionY='top'
                positionX='left'
                onClick={() => handleOnClickManuscriptOperation({ order: 2 })}
              >
                <div className='group/d2 relative'>
                  <img
                    src={findImagesByOrder(2)}
                    alt=''
                    className='h-full w-full'
                  />
                  <div
                    className={`absolute top-0 left-0 hidden h-full w-full bg-container-active-primary bg-opacity-30 group-hover/d2:block ${
                      props.page.pageNumber === activePageNumber &&
                      activeOrderNumber === 2
                        ? "!block"
                        : ""
                    }`}
                  ></div>
                </div>
              </WorkspaceButtonManuscript>
            ) : (
              <WorkspaceButtonManuscript
                documentSize='ONE_FOUR'
                bookletSize={props.size}
                positionY='top'
                positionX='left'
                onClick={() =>
                  handleOnClickManuscriptSetting({ order: 2, size: "ONE_FOUR" })
                }
              >
                <div className='group/d2 relative flex h-full w-full items-center justify-center'>
                  新規
                  <br />
                  原稿設定
                  <div
                    className={`absolute top-0 left-0 hidden h-full w-full bg-container-active-primary bg-opacity-30 group-hover/d2:block ${
                      props.page.pageNumber === activePageNumber &&
                      activeOrderNumber === 2
                        ? "!block"
                        : ""
                    }`}
                  ></div>
                </div>
              </WorkspaceButtonManuscript>
            )}
            {checkDataByOrder(3) ? (
              <WorkspaceButtonManuscript
                documentSize='ONE_TWO'
                bookletSize={props.size}
                positionY='bottom'
                onClick={() => handleOnClickManuscriptOperation({ order: 3 })}
              >
                <div className='group/d3 relative'>
                  <img
                    src={findImagesByOrder(3)}
                    alt=''
                    className='h-full w-full'
                  />
                  <div
                    className={`absolute top-0 left-0 hidden h-full w-full bg-container-active-primary bg-opacity-30 group-hover/d3:block ${
                      props.page.pageNumber === activePageNumber &&
                      activeOrderNumber === 3
                        ? "!block"
                        : ""
                    }`}
                  ></div>
                </div>
              </WorkspaceButtonManuscript>
            ) : (
              <WorkspaceButtonManuscript
                documentSize='ONE_TWO'
                bookletSize={props.size}
                positionY='bottom'
                onClick={() =>
                  handleOnClickManuscriptSetting({ order: 3, size: "ONE_TWO" })
                }
              >
                <div className='group/d3 relative flex h-full w-full items-center justify-center'>
                  新規
                  <br />
                  原稿設定
                  <div
                    className={`absolute top-0 left-0 hidden h-full w-full bg-container-active-primary bg-opacity-30 group-hover/d3:block ${
                      props.page.pageNumber === activePageNumber &&
                      activeOrderNumber === 3
                        ? "!block"
                        : ""
                    }`}
                  ></div>
                </div>
              </WorkspaceButtonManuscript>
            )}
          </>
        )}
        {props.layout === "E" && (
          <>
            {checkDataByOrder(1) ? (
              <WorkspaceButtonManuscript
                documentSize='ONE_FOUR'
                bookletSize={props.size}
                positionY='top'
                positionX='right'
                onClick={() => handleOnClickManuscriptOperation({ order: 1 })}
              >
                <div className='group/e1 relative'>
                  <img
                    src={findImagesByOrder(1)}
                    alt=''
                    className='h-full w-full'
                  />
                  <div
                    className={`absolute top-0 left-0 hidden h-full w-full bg-container-active-primary bg-opacity-30 group-hover/e1:block ${
                      props.page.pageNumber === activePageNumber &&
                      activeOrderNumber === 1
                        ? "!block"
                        : ""
                    }`}
                  ></div>
                </div>
              </WorkspaceButtonManuscript>
            ) : (
              <WorkspaceButtonManuscript
                documentSize='ONE_FOUR'
                bookletSize={props.size}
                positionY='top'
                positionX='right'
                onClick={() =>
                  handleOnClickManuscriptSetting({ order: 1, size: "ONE_FOUR" })
                }
              >
                <div className='group/e1 relative flex h-full w-full items-center justify-center'>
                  新規
                  <br />
                  原稿設定
                  <div
                    className={`absolute top-0 left-0 hidden h-full w-full bg-container-active-primary bg-opacity-30 group-hover/e1:block ${
                      props.page.pageNumber === activePageNumber &&
                      activeOrderNumber === 1
                        ? "!block"
                        : ""
                    }`}
                  ></div>
                </div>
              </WorkspaceButtonManuscript>
            )}
            {checkDataByOrder(2) ? (
              <WorkspaceButtonManuscript
                documentSize='ONE_FOUR'
                bookletSize={props.size}
                positionY='top'
                positionX='left'
                onClick={() => handleOnClickManuscriptOperation({ order: 2 })}
              >
                <div className='group/e2 relative'>
                  <img
                    src={findImagesByOrder(2)}
                    alt=''
                    className='h-full w-full'
                  />
                  <div
                    className={`absolute top-0 left-0 hidden h-full w-full bg-container-active-primary bg-opacity-30 group-hover/e2:block ${
                      props.page.pageNumber === activePageNumber &&
                      activeOrderNumber === 2
                        ? "!block"
                        : ""
                    }`}
                  ></div>
                </div>
              </WorkspaceButtonManuscript>
            ) : (
              <WorkspaceButtonManuscript
                documentSize='ONE_FOUR'
                bookletSize={props.size}
                positionY='top'
                positionX='left'
                onClick={() =>
                  handleOnClickManuscriptSetting({ order: 2, size: "ONE_FOUR" })
                }
              >
                <div className='group/e2 relative flex h-full w-full items-center justify-center'>
                  新規
                  <br />
                  原稿設定
                  <div
                    className={`absolute top-0 left-0 hidden h-full w-full bg-container-active-primary bg-opacity-30 group-hover/e2:block ${
                      props.page.pageNumber === activePageNumber &&
                      activeOrderNumber === 2
                        ? "!block"
                        : ""
                    }`}
                  ></div>
                </div>
              </WorkspaceButtonManuscript>
            )}
            {checkDataByOrder(3) ? (
              <WorkspaceButtonManuscript
                documentSize='ONE_FOUR'
                bookletSize={props.size}
                positionY='bottom'
                positionX='right'
                onClick={() => handleOnClickManuscriptOperation({ order: 3 })}
              >
                <div className='group/e3 relative'>
                  <img
                    src={findImagesByOrder(3)}
                    alt=''
                    className='h-full w-full'
                  />
                  <div
                    className={`absolute top-0 left-0 hidden h-full w-full bg-container-active-primary bg-opacity-30 group-hover/e3:block ${
                      props.page.pageNumber === activePageNumber &&
                      activeOrderNumber === 3
                        ? "!block"
                        : ""
                    }`}
                  ></div>
                </div>
              </WorkspaceButtonManuscript>
            ) : (
              <WorkspaceButtonManuscript
                documentSize='ONE_FOUR'
                bookletSize={props.size}
                positionY='bottom'
                positionX='right'
                onClick={() =>
                  handleOnClickManuscriptSetting({ order: 3, size: "ONE_FOUR" })
                }
              >
                <div className='group/e3 relative flex h-full w-full items-center justify-center'>
                  新規
                  <br />
                  原稿設定
                  <div
                    className={`absolute top-0 left-0 hidden h-full w-full bg-container-active-primary bg-opacity-30 group-hover/e3:block ${
                      props.page.pageNumber === activePageNumber &&
                      activeOrderNumber === 3
                        ? "!block"
                        : ""
                    }`}
                  ></div>
                </div>
              </WorkspaceButtonManuscript>
            )}
            {checkDataByOrder(4) ? (
              <WorkspaceButtonManuscript
                documentSize='ONE_FOUR'
                bookletSize={props.size}
                positionY='bottom'
                positionX='left'
                onClick={() => handleOnClickManuscriptOperation({ order: 4 })}
              >
                <div className='group/e4 relative'>
                  <img
                    src={findImagesByOrder(4)}
                    alt=''
                    className='h-full w-full'
                  />
                  <div
                    className={`absolute top-0 left-0 hidden h-full w-full bg-container-active-primary bg-opacity-30 group-hover/e4:block ${
                      props.page.pageNumber === activePageNumber &&
                      activeOrderNumber === 4
                        ? "!block"
                        : ""
                    }`}
                  ></div>
                </div>
              </WorkspaceButtonManuscript>
            ) : (
              <WorkspaceButtonManuscript
                documentSize='ONE_FOUR'
                bookletSize={props.size}
                positionY='bottom'
                positionX='left'
                onClick={() =>
                  handleOnClickManuscriptSetting({ order: 4, size: "ONE_FOUR" })
                }
              >
                <div className='group/e4 relative flex h-full w-full items-center justify-center'>
                  新規
                  <br />
                  原稿設定
                  <div
                    className={`absolute top-0 left-0 hidden h-full w-full bg-container-active-primary bg-opacity-30 group-hover/e4:block ${
                      props.page.pageNumber === activePageNumber &&
                      activeOrderNumber === 4
                        ? "!block"
                        : ""
                    }`}
                  ></div>
                </div>
              </WorkspaceButtonManuscript>
            )}
          </>
        )}
        {displayStatus === "settingManuscript" && (
          <WorkspaceModalSelectCopyType
            page={props.page}
            documentSize={documentSize}
            order={order}
            onClose={() => setDisplayStatus("none")}
            onExact={() => setDisplayStatus("none")}
          />
        )}
        {displayStatus === "operationManuscript" && (
          <WorkspaceModalPlanOperation
            documentSize={documentSize}
            page={props.page}
            order={order}
            onClose={() => setDisplayStatus("none")}
            bookletLocked={props.bookletLocked}
          />
        )}
        {/* {displayStatus === "operationManuscript" &&
          props.page.documents.length > 0 &&
          props.page.documents.find((item) => item.order === order).alias && (
            <WorkspaceModalOperationManuscriptAfterAlias
              manuscriptId={
                props.page.documents.find((item) => item.order === order).id
              }
              onClose={() => setDisplayStatus("none")}
            />
          )} */}
      </div>
    </div>
  )
}

WorkspaceModalSettingManuscript.defaultProps = {
  size: "small",
}

export default WorkspaceModalSettingManuscript
