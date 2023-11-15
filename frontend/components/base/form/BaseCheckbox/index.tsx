import React from "react"

interface Props {
  label?: string
  name: string
  value: string
  checked: boolean
  disabled: boolean
  onChange?: Function
}

const BaseCheckbox = (props: Props) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!props.onChange) return
    props.onChange(event.target.value)
  }

  return (
    <label className='inline-flex items-center'>
      <input
        type='checkbox'
        name={props.name}
        value={props.value}
        checked={props.checked}
        disabled={props.disabled}
        onChange={handleChange}
      />
      {props.label && <span className='ml-1 text-sm'>{props.label}</span>}
    </label>
  )
}

BaseCheckbox.defaultProps = {
  label: "",
  name: "",
  value: "",
  checked: false,
  disabled: false,
  onChange: undefined,
}

export default BaseCheckbox
