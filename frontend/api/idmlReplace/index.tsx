export const createWorkspaceImageURL = (fileName: string): string => {
  return `${process.env.NEXT_PUBLIC_API_URL}/v1/idml-replace/workspace/image/${fileName}`
}

export const createWorkspaceBackgroundImageURL = (
  documentSizeCode: string,
): string => {
  return `${process.env.NEXT_PUBLIC_API_URL}/v1/idml-replace/workspace/bg-image/${documentSizeCode}`
}
