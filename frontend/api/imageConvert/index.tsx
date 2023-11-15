import axios from "axios"

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_IMAGE_API_URL}/v1`,
  headers: { "content-type": "multipart/form-data" },
})

export const postConverts = async (image: File) => {
  let formData = new FormData()
  formData.append("image", image)
  const { data } = await axiosInstance.post<{ image: string }>(
    "/converts",
    formData,
  )

  return data.image
}
