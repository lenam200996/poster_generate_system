import { useState } from "react"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"

import BaseModalPreview from "@/components/base/overlay/BaseModalPreview"

interface Props {
  href?: string
}

const ProjectManuscriptPreviewModal = (props: Props) => {
  const [shown, setShown] = useState<boolean>(false)
  return (
    <div>
      <BaseButtonIconText
        icon='plagiarism'
        text='表示'
        size='small'
        disabled={!props.href}
        onClick={() => setShown(true)}
      />
      <BaseModalPreview
        download
        imageUrl={props.href}
        shown={shown}
        onClose={() => setShown(false)}
      />
    </div>
  )
}

export default ProjectManuscriptPreviewModal
