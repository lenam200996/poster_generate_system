interface Props {
  children: any
  size?: number
}

const BaseErrorBody = (props: Props) => {
  return (
    <p
      className={`text-[${props.size || 13}px] text-content-error-primary ${
        props.size == 10 ? "text-10px" : ""
      }`}
    >
      {props.children}
    </p>
  )
}

export default BaseErrorBody
